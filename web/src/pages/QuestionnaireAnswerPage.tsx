import { Container, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useMemo } from "react";
import { QuestionnaireAnswerItem } from "../components/QuestionnaireAnswer/QuestionnaireAnswerItem";
import { useQuestionnaireAnswers } from "../hooks/useQuestionnaireAnswers";
import { useQuestionnaireEvent } from "../hooks/useQuestionnaireEvent";

export const QuestionnaireAnswerPage = () => {
  const [{ data }] = useQuestionnaireAnswers({ questionnaireId: 1 });
  const { data: newData } = useQuestionnaireEvent({ questionnaireId: "1" });

  const choiceCounts = useMemo(() => {
    if (data == null) {
      return null;
    }

    const allAnswers = [...data.answers, ...(newData?.answers || [])];

    return allAnswers.reduce(
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

    return Object.entries(choiceCounts).map(([key, value]) => ({
      value,
      label: key,
    }));
  }, [choiceCounts]);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2
            style={{
              margin: "0 0 24px 0",
              color: "#5C5B64",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            GraphQL vs RestAPI
          </h2>
        </Grid>
        <Grid item>
          {graphData ? (
            <PieChart
              series={[
                {
                  data: graphData!,
                },
              ]}
              width={400}
              height={200}
            />
          ) : (
            <p>Loading...</p>
          )}
        </Grid>
        <Grid item xs={12}>
          {choiceCounts ? (
            Object.entries(choiceCounts).map(([key, value]) => (
              <Grid key={key}>
                <QuestionnaireAnswerItem
                  choice={key}
                  count={value}
                  allCount={choiceTotal}
                />
              </Grid>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
