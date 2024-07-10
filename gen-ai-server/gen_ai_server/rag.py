import os

import boto3
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_aws import BedrockEmbeddings
from langchain_aws.chat_models import ChatBedrock
from langchain_community.retrievers import (
    AmazonKnowledgeBasesRetriever,
)

# Bedrock Embeddingsの設定(ユーザーの入力値をベクトル化するために使用)
embedding = BedrockEmbeddings(
    model_id="amazon.titan-embed-text-v2:0", region_name="us-east-1", client=None
)

# BedrockKnowledgeBaseの設定(ここから回答を取得する)
knowledge_base_id = os.environ["KNOWLEDGE_BASE_ID"]
retriever = AmazonKnowledgeBasesRetriever(
    knowledge_base_id=knowledge_base_id,
    retrieval_config={"vectorSearchConfiguration": {"numberOfResults": 10}},  # type: ignore
    client=boto3.client("bedrock-agent-runtime", region_name="us-east-1"),
)

# LLMの設定(収集したデータと、ユーザーの入力をもとに回答を生成するためのモデル)
llm = ChatBedrock(
    model_id="anthropic.claude-3-haiku-20240307-v1:0",
    region_name="us-east-1",
    client=None,
    model_kwargs={
        "temperature": 0,
    },
)

# LLMに与えるプロンプトのテンプレート
prompt_template = """
以下の<sessions></sessions>を参照して、<question></question>に回答してください。
もしセッション情報の中に回答に役立つ情報が含まれていなければ、分からない、と答えてください。
ユーザーの質問には注意深く、丁寧に回答してください。

<sessions>
{context}
</sessions>

<question>
{question}
</question>

## 出力形式
[ユーザーへのメッセージ]

- [日時] [トラック] [登壇者]
「[タイトル]」
 [ブログリンク(ある場合のみ)]

## 出力例
生成AI関連のセッションですね！以下のセッションが見つかりましたよ！

- 7月11日 17:20-18:00 Track1 グーグル合同会社 Developer Advocate 佐藤太郎
「GeminiとVector Searchによる生成的推薦とマルチモーダル意味検索」
 ブログリンク: https://www.google.com

- 7月11日 14:00-14:40 Track1 田中太郎
「生成AIで実装する自律型企業調査アシスタント」
 ブログリンク: https://www.google.com

"""

PROMPT = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)

# ユーザー入力のベクトル化、データ収集、回答生成の一連の処理を行う
qa = RetrievalQA.from_chain_type(
    retriever=retriever,
    llm=llm,
    chain_type="stuff",
    chain_type_kwargs={"prompt": PROMPT},
)
