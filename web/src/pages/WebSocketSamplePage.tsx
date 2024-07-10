import { useQuestionnaireEvent } from "../hooks/useQuestionnaireEvent";

export const WebSocketSamplePage = () => {
  const { data } = useQuestionnaireEvent({ url: "ws://localhost:8080" });

  return (
    <>
      <p>{data}</p>
      <div>WebSocketSamplePage</div>
    </>
  );
};
