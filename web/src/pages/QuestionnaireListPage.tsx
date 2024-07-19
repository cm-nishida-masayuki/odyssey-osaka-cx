import { Box } from "@mui/material";
import Loading from "../components/Loading";
import { QuestionnaireList } from "../components/QuestionnaireItem";
import { useQuestionnaires } from "../hooks/useQuestionnaires";

export const QuestionnaireListPage = () => {
  const [{ data, error, isLoading }] = useQuestionnaires();

  if (isLoading || data === undefined) {
    return <Loading />;
  }
  if (error) {
    return <div>Error...</div>;
  }

  return (
    <Box padding={"24px"} display="flex" flexDirection="column" gap="12px">
      {data.questionnaires.map((questionnaire) => (
        <QuestionnaireList key={questionnaire.id} {...questionnaire} />
      ))}
    </Box>
  );
};
