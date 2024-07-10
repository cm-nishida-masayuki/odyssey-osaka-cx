import { useCallback, useEffect, useRef, useState } from "react";

type Params = {
  url: string;
};

export const useQuestionnaireEvent = ({ url }: Params) => {
  const ws = useRef<WebSocket | null>(null);
  const [data, setData] = useState<string>("");

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      setData(event.data);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
    };
  }, [url]);

  return {
    data,
  };
};
