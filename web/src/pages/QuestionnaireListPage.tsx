import { Box } from "@mui/material";
import { QuestionnaireList } from "../components/QuestionnaireItem";

export const QuestionnaireListPage = () => {
  return (
    <Box padding={"24px"} display="flex" flexDirection="column" gap="12px">
      <QuestionnaireList />
      <QuestionnaireList />
    </Box>
  );
};
