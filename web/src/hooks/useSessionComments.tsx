import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import useSWR from "swr";
import { config } from "../config";
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

const useCommentEvent = ({ sessionId }: { sessionId: number }) => {
  const ws = useRef<ReconnectingWebSocket | null>(null);
  const [data, setData] = useState<Comments>();

  useEffect(() => {
    ws.current = new ReconnectingWebSocket(config.WS_URL);

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          action: "hello",
          id: sessionId,
          type: "SESSION",
        })
      );
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const inComingComments = JSON.parse(event.data) as Comments;

      setData((prev) => {
        if (prev == null) {
          return inComingComments;
        }

        return {
          comments: [...prev.comments, ...inComingComments.comments],
        };
      });
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
    };
  }, [sessionId]);

  return {
    data,
  };
};

export const useSessionComments = ({ sessionId }: { sessionId: number }) => {
  const [participantId] = useLocalStore<string>("participantId");
  const [participantName] = useLocalStore<string>("participantName");

  const { data: newData } = useCommentEvent({ sessionId });
  const { data, error, isLoading } = useSWR<Comments>(
    `${config.API_URL}/sessions/${sessionId}/comments`,
    fetcher
  );

  const joinData = useMemo(() => {
    if (data == null) return;
    const allComments = [...data.comments, ...(newData?.comments || [])];
    const uniqueComments = allComments.filter(
      (comment, index, self) =>
        self.findIndex(
          (c) =>
            c.commentAt === comment.commentAt &&
            c.participantId === comment.participantId
        ) === index
    );
    return uniqueComments.sort(
      (a, b) =>
        new Date(b.commentAt).getTime() - new Date(a.commentAt).getTime()
    );
  }, [newData, data]);

  const handlePostComments = async ({ comment }: { comment: string }) => {
    await axios.post(`${config.API_URL}/sessions/${sessionId}/comments`, {
      participantId,
      participantName,
      comment,
    });
  };

  return [
    {
      data: joinData,
      isLoading,
      error,
    },
    {
      handlePostComments,
    },
  ] as const;
};
