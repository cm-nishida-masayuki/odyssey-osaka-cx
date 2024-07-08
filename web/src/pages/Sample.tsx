import "./Sample.css";
import { useSessions } from "../hooks/useSessions";

function SamplePage() {
  const { data, isLoading, error } = useSessions();

  if (isLoading || data === undefined) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error!</p>;
  }

  return (
    <>
      {/* TODO: 型定義 */}
      {data.sessions.map((session: any) => {
        return (
          <div key={session.sessionId}>
            <h1>{session.sessionTitle}</h1>
            <p>{session.description}</p>
          </div>
        );
      })}
    </>
  );
}

export default SamplePage;
