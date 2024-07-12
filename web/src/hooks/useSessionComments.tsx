import useSWR from "swr";
import { config } from "../config";
import axios from "axios";
import { useLocalStore } from "./useLocalStore";

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
  const [participantId] = useLocalStore<string>("participantId");
  const [participantName] = useLocalStore<string>("participantName");

  const { data, error, isLoading } = useSWR<Comments>(
    `${config.API_URL}/sessions/${sessionId}/comments`,
    fetcher
  );

  const handlePostComments = async ({ comment }: { comment: string }) => {
    await axios.post(`${config.API_URL}/sessions/${sessionId}/comments`, {
      participantId,
      participantName,
      comment,
    });
  };

  return [
    {
      data,
      isLoading,
      error,
    },
    {
      handlePostComments,
    },
  ] as const;
};
