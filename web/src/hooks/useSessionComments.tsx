import useSWR from "swr";
import { config } from "../config";
import axios from "axios";

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

  const handlePostComments = async ({ comment }: { comment: string }) => {
    const participantId = localStorage.getItem("participantId");
    const participantName = localStorage.getItem("participantName");
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
