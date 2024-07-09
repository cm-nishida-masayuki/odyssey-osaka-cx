import useSWR from "swr";
import { config } from "../config";
import axios from "axios";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export type AnswerType = "choice" | "free";

export type Answers =
  // 選択式アンケート
  | {
      answers: {
        participantId: string;
        participantName: string;
        answerAt: string;
        choice: string;
      }[];
    }
  // 自由記述アンケート
  | {
      answers: {
        participantId: string;
        participantName: string;
        answerAt: string;
        content: string;
      }[];
    };

export const useQuestionnaireAnswers = ({
  questionnaireId,
}: {
  questionnaireId: number;
}) => {
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
    const participantId = localStorage.getItem("participantId");
    const participantName = localStorage.getItem("participantName");

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
