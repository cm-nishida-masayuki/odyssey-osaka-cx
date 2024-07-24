import { Box, Button, Container, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionnaireAnswerItem } from "../components/QuestionnaireAnswer/QuestionnaireAnswerItem";
import { useQuestionnaireAnswers } from "../hooks/useQuestionnaireAnswers";
import { useQuestionnaireEvent } from "../hooks/useQuestionnaireEvent";
import { useQuestionnaires } from "../hooks/useQuestionnaires";

export const QuestionnaireAnswerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  const handleAnswer = () => {
    navigate(`/questionnaire/${id}`);
  };

  return (
    <Container>
      <Grid container spacing={2} mb={10}>
        <Grid item xs={12}>
          <h2
            style={{
              margin: "0 0 24px 0",
              color: "#5C5B64",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {questionnaire?.title}
          </h2>
        </Grid>
        <Grid item>
          {graphData ? (
            <PieChart
              series={[
                {
                  arcLabel: "label",
                  data: graphData!,
                  arcLabelMinAngle: 25,
                  arcLabelRadius: 60,
                },
              ]}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
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
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        padding="16px"
        bgcolor="#F5F5F5"
      >
        <Button
          variant="contained"
          fullWidth
          style={{
            height: "48px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "9999px",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: "bold",
          }}
          onClick={handleAnswer}
        >
          回答
        </Button>
      </Box>
    </Container>
  );
};
