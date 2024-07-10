import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { aws_iam, aws_s3, aws_bedrock } from "aws-cdk-lib";
import { PythonLayerVersion } from "@aws-cdk/aws-lambda-python-alpha";

export class GenAiApiConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const tag = "odyssey-osaka-cx";
    /**
     * Amazon Bedrock リソースの作成
     */
    const bucketName = `${tag}-${cdk.Stack.of(scope).account}`;
    const embeddingModelArn = this.node.tryGetContext("embeddingModelArn");
    const pineconeEndpoint = this.node.tryGetContext("pineconeEndpoint");
    const pineconeSecretArn = this.node.tryGetContext("pineconeSecretArn");

    // S3 bucket for the data source
    const dataSourceBucket = new aws_s3.Bucket(this, "DataSourceBucket", {
      bucketName: bucketName,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Role for the knowledge base
    const knowledgeBaseRole = new aws_iam.Role(this, `KnowledgeBaseRole`, {
      roleName: `${tag}_role`,
      assumedBy: new aws_iam.ServicePrincipal("bedrock.amazonaws.com"),
      inlinePolicies: {
        inlinePolicy1: new aws_iam.PolicyDocument({
          statements: [
            new aws_iam.PolicyStatement({
              resources: [pineconeSecretArn],
              actions: ["secretsmanager:GetSecretValue"],
            }),
            new aws_iam.PolicyStatement({
              resources: [embeddingModelArn],
              actions: ["bedrock:InvokeModel"],
            }),
            new aws_iam.PolicyStatement({
              resources: [
                `arn:aws:s3:::${bucketName}`,
                `arn:aws:s3:::${bucketName}/*`,
              ],
              actions: ["s3:ListBucket", "s3:GetObject"],
            }),
          ],
        }),
      },
    });

    // knowledge Base
    const knowledgeBase = new aws_bedrock.CfnKnowledgeBase(
      this,
      "KnowledgeBase",
      {
        knowledgeBaseConfiguration: {
          type: "VECTOR",
          vectorKnowledgeBaseConfiguration: {
            embeddingModelArn: embeddingModelArn,
          },
        },
        name: tag,
        roleArn: knowledgeBaseRole.roleArn,
        storageConfiguration: {
          type: "PINECONE",
          pineconeConfiguration: {
            connectionString: pineconeEndpoint,
            credentialsSecretArn: pineconeSecretArn,
            fieldMapping: {
              metadataField: "metadata",
              textField: "text",
            },
          },
        },
        description: "Knowledge base for all the odyssey sessions",
      }
    );

    // data source
    new aws_bedrock.CfnDataSource(this, "BedrockKnowledgeBaseDataStore", {
      name: `${tag}-data-source`,
      knowledgeBaseId: knowledgeBase.ref,
      dataSourceConfiguration: {
        s3Configuration: {
          bucketArn: dataSourceBucket.bucketArn,
        },
        type: "S3",
      },
    });

    // Output the AWS CLI command to upload a file to the S3 bucket
    const dataSourceFiles: string[] = ["odyssey-sessions.csv"];
    dataSourceFiles.forEach((dataSourceFile) => {
      const uploadCommand = `aws s3 cp assets/${dataSourceFile} s3://${bucketName}/${dataSourceFile}`;
      new CfnOutput(this, `UploadCommand_${dataSourceFile}`, {
        value: uploadCommand,
        description: `AWS CLI command to upload a file to the S3 bucket`,
      });
    });

    /**
     * セッション検索チャット用APIの作成
     */
    const genAiServerLayer = new PythonLayerVersion(this, "GenAiServerLayer", {
      entry: "../gen-ai-server",
      bundling: {
        assetExcludes: ["**/__pycache__", ".venv", "handler.py"],
      },
      compatibleRuntimes: [cdk.aws_lambda.Runtime.PYTHON_3_12],
      compatibleArchitectures: [cdk.aws_lambda.Architecture.ARM_64],
    });

    const genAiChatLambda = new cdk.aws_lambda.Function(
      this,
      "GenAiChatLambda",
      {
        code: cdk.aws_lambda.Code.fromAsset("../gen-ai-server", {
          // ハンドラーファイルのみをLambda関数に含める
          exclude: ["*", "!handler.py"],
          ignoreMode: cdk.IgnoreMode.GIT,
        }),
        handler: "handler.handler",
        runtime: cdk.aws_lambda.Runtime.PYTHON_3_12,
        architecture: cdk.aws_lambda.Architecture.ARM_64,
        memorySize: 1769, // 1vCPUフルパワー @see https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/gettingstarted-limits.html
        timeout: cdk.Duration.minutes(15),
        layers: [genAiServerLayer],
      }
    );

    const functionUrl = genAiChatLambda.addFunctionUrl({
      authType: cdk.aws_lambda.FunctionUrlAuthType.NONE, // MEMO: 当日限りのプロジェクトなので全公開
      cors: {
        allowedMethods: [cdk.aws_lambda.HttpMethod.ALL],
        allowedOrigins: ["*"],
      },
    });

    new CfnOutput(this, "FunctionUrl", {
      value: functionUrl.url,
      description: "URL of the Lambda function",
    });

    genAiChatLambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
        ],
        resources: ["*"],
      })
    );
  }
}
