import { Box } from "@mui/material";
import { Link } from "react-router-dom";

export const QuestionnaireList = () => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      padding={"16px"}
      border={"solid 0.5px #BCBACF"}
      borderRadius={"16px"}
      component={Link}
      to={""}
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
