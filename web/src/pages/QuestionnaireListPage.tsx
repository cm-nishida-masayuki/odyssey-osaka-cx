import { Box } from "@mui/material";

export const QuestionnaireListPage = () => {
  return (
    <Box padding={"24px"}>
      <QuestionnaireList />
      <QuestionnaireList />
    </Box>
  );
};

const QuestionnaireList = () => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      padding={"16px"}
      marginBottom={"12px"}
      border={"solid 0.5px #BCBACF"}
      borderRadius={"16px"}
    >
      <p
        style={{
          margin: 0,
        }}
      >
        GraphQL vs RestAPI
      </p>

      <p
        style={{
          margin: 0,
          color: "#5C5B64",
          fontSize: "14px",
        }}
      >
        回答する
      </p>
    </Box>
  );
};
