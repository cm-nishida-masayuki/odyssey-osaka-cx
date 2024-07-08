import useSWR from "swr";
import { config } from "../config";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

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

  return {
    data,
    isLoading,
    error,
  } as const;
};
