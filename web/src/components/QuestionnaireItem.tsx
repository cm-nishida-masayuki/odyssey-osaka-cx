import { Box } from "@mui/material";
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
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      padding={"16px"}
      border={"solid 0.5px #BCBACF"}
      borderRadius={"16px"}
      component={Link}
      to={
        isAlreadyAnswered
          ? `/questionnaire/${id}/answer`
          : `/questionnaire/${id}`
      }
      sx={{
        textDecoration: "none",
        color: "inherit",
        ":visited": { color: "inherit" },
      }}
    >
      <p
        style={{
          margin: 0,
        }}
      >
        {title}
      </p>

      <p
        style={{
          margin: 0,
          color: "#5C5B64",
          fontSize: "14px",
          whiteSpace: "nowrap",
          marginLeft: "4px",
        }}
      >
        {isAlreadyAnswered ? "回答を見る" : "回答する"}
      </p>
    </Box>
  );
};
