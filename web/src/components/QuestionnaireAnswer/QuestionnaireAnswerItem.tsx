import { Box } from "@mui/material";

export type QuestionnaireAnswerItemProps = {
  choice: string;
  count: number;
  allCount: number;
};

export const QuestionnaireAnswerItem = ({
  choice,
  count,
  allCount,
}: QuestionnaireAnswerItemProps) => {
  const ratio = Math.ceil((count / allCount) * 100);
  const gradientStyle = `linear-gradient(to right, #B2E8AE ${ratio}%, #E7FFE5 ${ratio}%)`;

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      height={"48px"}
      width={"100%"}
      padding={"0 24px"}
      marginBottom={"12px"}
      border={"solid 0.5px #212121"}
      borderRadius={"24px"}
      bgcolor={"transparent"}
      style={{
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
        {choice}
      </p>
      <p>{ratio}%</p>
    </Box>
  );
};
