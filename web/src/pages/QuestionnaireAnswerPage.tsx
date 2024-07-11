import { Box, Container, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useQuestionnaireAnswers } from "../hooks/useQuestionnaireAnswers";
import { useMemo } from "react";

export const QuestionnaireAnswerPage = () => {
  const [{ data }] = useQuestionnaireAnswers({ questionnaireId: 1 });

  const choiceCounts = data?.answers.reduce(
    (acc, curr) => {
      acc[curr.choice] = (acc[curr.choice] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const choiceTotal = useMemo(() => {
    if (choiceCounts == null) {
      return 1;
    }

    return Object.values(choiceCounts).reduce((acc, curr) => acc + curr, 0);
  }, [choiceCounts]);

  const gradientStyle = "linear-gradient(to right, #B2E8AE 25%, #E7FFE5 25%)";

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
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </Grid>
        <Grid item xs={12}>
          {choiceCounts ? (
            Object.entries(choiceCounts).map(([key, value]) => (
              <Grid key={key}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  height={"48px"}
                  padding={"0 24px"}
                  marginBottom={"12px"}
                  border={"solid 0.5px #212121"}
                  borderRadius={"24px"}
                  bgcolor={"transparent"}
                  style={{
                    cursor: "pointer",
                    background: gradientStyle,
                  }}
                >
                  <p
                    style={{
                      color: "#5C5B64",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {key}
                  </p>
                  <p>{Math.ceil((value / choiceTotal) * 100)}%</p>
                </Box>
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
