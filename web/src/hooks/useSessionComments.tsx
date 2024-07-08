import useSWR from "swr";
import { config } from "../config";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export type Comments = {
  comments: {
    sessionId: number;
    commentAt: string;
    participantId: string;
    participantName: string;
    comment: string;
  }[];
};

export const useSessionComments = ({ sessionId }: { sessionId: number }) => {
  const { data, error, isLoading } = useSWR<Comments>(
    `${config.API_URL}/sessions/${sessionId}/comments`,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  } as const;
};
