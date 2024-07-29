import { PieChart } from "@mui/x-charts";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionnaireAnswerItem } from "../components/QuestionnaireAnswer/QuestionnaireAnswerItem";
import {
  useQuestionnaireAnswers,
  type Answers,
} from "../hooks/useQuestionnaireAnswers";
import { useQuestionnaireEvent } from "../hooks/useQuestionnaireEvent";
import { useQuestionnaires } from "../hooks/useQuestionnaires";

export const QuestionnaireAnswerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF5A5E",
    "#5AD3D1",
    "#A8E6CF",
    "#FFD3B6",
    "#FF8A80",
    "#82B1FF",
    "#B39DDB",
    "#FFCC80",
    "#81C784",
  ];

  const [{ data }] = useQuestionnaireAnswers({
    questionnaireId: parseInt(id!),
  });
  const { data: newData } = useQuestionnaireEvent({ questionnaireId: id! });

  const [{ data: questionnairesData }] = useQuestionnaires();

  const questionnaire = useMemo(() => {
    if (questionnairesData == null) return;
    const questionnaire = questionnairesData.questionnaires.find(
      (item) => item.id === parseInt(id!, 10)
    );

    if (questionnaire == null) {
      throw new Error("対象のアンケートが見つかりません");
    }
    return questionnaire;
  }, [questionnairesData, id]);

  const choiceCounts = useMemo(() => {
    if (data == null) {
      return null;
    }

    const allAnswers = [...data.answers, ...(newData?.answers || [])];
    const sortedAnswers = allAnswers.sort(
      (a, b) => new Date(b.answerAt).getTime() - new Date(a.answerAt).getTime()
    );
    // sortedAnswersには、過去の回答も含まれるので、最新の回答のみを取得する
    const filteredAnswers: Answers["answers"] = [];
    for (const answer of sortedAnswers) {
      if (
        !filteredAnswers.some(
          (filteredAnswer) =>
            filteredAnswer.participantId === answer.participantId
        )
      ) {
        filteredAnswers.push(answer);
      }
    }

    return filteredAnswers.reduce(
      (acc, curr) => {
        acc[curr.choice] = (acc[curr.choice] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [newData, data]);

  const choiceTotal = useMemo(() => {
    if (choiceCounts == null) {
      return 1;
    }

    return Object.values(choiceCounts).reduce((acc, curr) => acc + curr, 0);
  }, [choiceCounts]);

  const graphData = useMemo(() => {
    if (choiceCounts == null) {
      return null;
    }

    return Object.entries(choiceCounts)
      .map(([key, value]) => ({
        value,
        label: key,
      }))
      .sort((a, b) => b.value - a.value);
  }, [choiceCounts]);

  const handleAnswer = () => {
    navigate(`/questionnaire/${id}`);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
      <div style={{ display: "grid", gap: "8px", marginBottom: "80px" }}>
        <div>
          <h2
            style={{
              margin: "0",
              color: "#5C5B64",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {questionnaire?.title}
          </h2>
        </div>
        <div>
          {graphData ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <PieChart
                colors={colors}
                series={[
                  {
                    data: graphData,
                    innerRadius: 0,
                    outerRadius: 120,
                    cx: 138,
                    cy: 138,
                  },
                ]}
                width={288}
                height={288}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
              />
              <CustomLabel data={graphData} colors={colors} />
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div>
          {choiceCounts ? (
            Object.entries(choiceCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([key, value]) => (
                <div
                  style={{
                    width: "100%",
                  }}
                  key={key}
                >
                  <QuestionnaireAnswerItem
                    choice={key}
                    count={value}
                    allCount={choiceTotal}
                  />
                </div>
              ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          backgroundColor: "#F5F5F5",
        }}
      >
        <button
          style={{
            width: "100%",
            height: "48px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "9999px",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={handleAnswer}
        >
          回答
        </button>
      </div>
    </div>
  );
};

interface CustomLabelProps {
  data: Array<{ label: string; value: number }>;
  colors: string[];
}

const CustomLabel: React.FC<CustomLabelProps> = ({ data, colors }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      margin: "12px 16px",
      fontSize: "14px",
    }}
  >
    {data.map((item, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0 12px 4px 0",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            backgroundColor: colors[index % colors.length],
            marginRight: 8,
          }}
        />
        <div>
          {item.label}: {item.value}
        </div>
      </div>
    ))}
  </div>
);
