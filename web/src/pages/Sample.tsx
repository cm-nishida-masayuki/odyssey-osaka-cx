import "./Sample.css";
import { useQuestionnaireAnswers } from "../hooks/useQuestionnaireAnswers";

function SamplePage() {
  const [{ data, isLoading, error }, { handlePostAnswer }] =
    useQuestionnaireAnswers({
      questionnaireId: 1,
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
            handlePostAnswer({
              AnswerType: "choice",
              choice: "A",
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
