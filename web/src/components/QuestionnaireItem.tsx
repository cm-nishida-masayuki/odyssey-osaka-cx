import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useLocalStore } from "../hooks/useLocalStore";
import { Questionnaire } from "../hooks/useQuestionnaires";

export const QuestionnaireList = ({ id, title }: Questionnaire) => {
  const [answeredQuestionnaires] = useLocalStore<string[]>(
    "answeredQuestionnaires"
  );
  const isAlreadyAnswered = (answeredQuestionnaires ?? []).includes(
    id.toString()
  );

  return (
    <Box
      component={Link}
      to={
        isAlreadyAnswered
          ? `/questionnaire/${id}/answer`
          : `/questionnaire/${id}`
      }
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        border: "solid 0.5px #BCBACF",
        borderRadius: "16px",
        textDecoration: "none",
        color: "inherit",
        "&:visited": { color: "inherit" },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          margin: 0,
          fontWeight: 500,
          fontSize: "16px",
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          margin: 0,
          color: "#5C5B64",
          fontSize: "12px",
          whiteSpace: "nowrap",
          marginLeft: "4px",
        }}
      >
        {isAlreadyAnswered ? "回答を見る" : "回答する"}
      </Typography>
    </Box>
  );
};
