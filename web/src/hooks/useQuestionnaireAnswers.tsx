import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { config } from "../config";
import { useLocalStore } from "./useLocalStore";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export type AnswerType = "choice" | "free";

export type Answers =
  // 選択式アンケート
  {
    answers: {
      participantId: string;
      participantName: string;
      answerAt: string;
      choice: string;
    }[];
  };

export const useQuestionnaireAnswers = ({
  questionnaireId,
}: {
  questionnaireId: number;
}) => {
  const [participantId] = useLocalStore<string>("participantId");
  const [participantName] = useLocalStore<string>("participantName");

  const [answeredQuestionnaires, setAnsweredQuestionnaires] = useLocalStore<
    string[]
  >("answeredQuestionnaires");
  const { mutate } = useSWRConfig();
  const ANSWER_KEY = `${config.API_URL}/questionnaires/${questionnaireId}/answers`;
  const { data, error, isLoading } = useSWR<Answers>(ANSWER_KEY, fetcher);

  const handlePostAnswer = async ({ choice }: { choice: string }) => {
    await axios.post(
      `${config.API_URL}/questionnaires/${questionnaireId}/answers`,
      {
        participantId,
        participantName,
        choice,
      }
    );

    setAnsweredQuestionnaires(
      (answeredQuestionnaires ?? []).concat(questionnaireId.toString())
    );
  };

  const handlePutChoices = async ({
    title,
    choices,
  }: {
    title: string;
    choices: {
      choiceTitle: string;
      createAt: string;
    }[];
  }): Promise<string> => {
    // 大文字小文字を区別せずに、配列に含まれているかを確認
    const filterResult = choices.filter(
      (c) => c.choiceTitle.toLowerCase() === title.toLowerCase()
    );
    if (0 < filterResult.length) {
      return filterResult.at(0)?.choiceTitle as string;
    }

    await axios.put(
      `${config.API_URL}/questionnaires/${questionnaireId}/choices`,
      {
        title,
      }
    );
    // キャッシュを破棄
    await mutate(ANSWER_KEY);

    return title;
  };

  return [
    {
      data,
      isLoading,
      error,
    },
    {
      handlePostAnswer,
      handlePutChoices,
    },
  ] as const;
};
