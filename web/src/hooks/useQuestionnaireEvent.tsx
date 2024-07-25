import { useEffect, useRef, useState } from "react";
import { config } from "../config";
import { Answers } from "./useQuestionnaireAnswers";

type Params = {
  questionnaireId: string;
};

export const useQuestionnaireEvent = ({ questionnaireId }: Params) => {
  const ws = useRef<WebSocket | null>(null);
  const [data, setData] = useState<Answers>();

  useEffect(() => {
    ws.current = new WebSocket(config.WS_URL);

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          action: "hello",
          id: parseInt(questionnaireId),
          type: "QUESTIONNAIRE",
        })
      );
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const inComingAnswers = JSON.parse(event.data) as Answers;

      setData((prev) => {
        if (prev == null) {
          return inComingAnswers;
        }

        return {
          answers: [...prev.answers, ...inComingAnswers.answers],
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
