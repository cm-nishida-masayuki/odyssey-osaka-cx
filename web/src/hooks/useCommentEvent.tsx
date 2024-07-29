import { useEffect, useRef, useState } from "react";
import { config } from "../config";
import { Comments } from "./useSessionComments";

type Params = {
  questionnaireId: string;
};

export const useCommentEvent = ({ questionnaireId }: Params) => {
  const ws = useRef<WebSocket | null>(null);
  const [data, setData] = useState<Comments>();

  useEffect(() => {
    ws.current = new WebSocket(config.WS_URL);

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          action: "hello",
          id: parseInt(questionnaireId),
          type: "SESSION",
        })
      );
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const inComingAnswers = JSON.parse(event.data) as Comments;

      setData((prev) => {
        if (prev == null) {
          return inComingAnswers;
        }

        return {
          comments: [...prev.comments, ...inComingAnswers.comments],
        };
      });
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
    };
  }, [questionnaireId]);

  return {
    data,
  };
};
