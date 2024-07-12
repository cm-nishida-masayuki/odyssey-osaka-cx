import useSWR from "swr";
import { config } from "../config";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export type Questionnaire = {
  questionnaireId: number;
  title: string;
  content: string;
  type: string;
  choices?: string[];
};

export type Questionnaires = {
  questionnaires: Questionnaire[];
};

export const useQuestionnaires = () => {
  const { data, error, isLoading } = useSWR<Questionnaires>(
    `${config.API_URL}/questionnaires`,
    fetcher
  );

  return [
    {
      data,
      isLoading,
      error,
    },
    {},
  ] as const;
};
