import { useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { config } from "../config";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export type Questionnaire = {
  id: number;
  title: string;
  type: string;
  choices: {
    choiceTitle: string;
    createAt: string;
  }[];
};

export type Questionnaires = {
  questionnaires: Questionnaire[];
};

export const useQuestionnaires = () => {
  const { mutate } = useSWRConfig();
  const ANSWER_KEY = `${config.API_URL}/questionnaires`;
  const { data, error, isLoading } = useSWR<Questionnaires>(
    ANSWER_KEY,
    fetcher
  );

  const clearCache = useCallback(async () => {
    await mutate(ANSWER_KEY);
  }, [mutate, ANSWER_KEY]);

  return [
    {
      data,
      isLoading,
      error,
    },
    {
      clearCache,
    },
  ] as const;
};
