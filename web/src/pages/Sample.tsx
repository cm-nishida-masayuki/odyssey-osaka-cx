import "./Sample.css";
import { useSessionComments } from "../hooks/useSessionComments";

function SamplePage() {
  const [{ data, isLoading, error }, { handlePostComments }] =
    useSessionComments({
      sessionId: 1,
    });

  if (isLoading || data === undefined) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error!</p>;
  }

  return (
    <>
      <div>
        <button
          onClick={() => {
            handlePostComments({
              comment: "BBB",
            });
          }}
        >
          動作確認
        </button>
      </div>
    </>
  );
}

export default SamplePage;
