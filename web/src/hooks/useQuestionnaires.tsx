import useSWR from "swr";
import { config } from "../config";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export type Questionnaires = {
  questionnaires: {
    questionnaireId: number;
    title: string;
    content: string;
    type: string;
    choices?: string[];
  }[];
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
