import useSWR from "swr";
import { config } from "../config";
import axios from "axios";
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

  const { data, error, isLoading } = useSWR<Answers>(
    `${config.API_URL}/questionnaires/${questionnaireId}/answers`,
    fetcher
  );

  const handlePostAnswer = async (
    answer:
      | {
          AnswerType: "choice";
          choice: string;
        }
      | {
          AnswerType: "free";
          content: string;
        }
  ) => {
    const { AnswerType: _, ...props } = answer;

    await axios.post(
      `${config.API_URL}/questionnaires/${questionnaireId}/answers`,
      {
        participantId,
        participantName,
        ...props,
      }
    );
  };

  const handlePutChoices = async ({ title }: { title: string }) => {
    await axios.put(
      `${config.API_URL}/questionnaires/${questionnaireId}/choices`,
      {
        title,
      }
    );
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
