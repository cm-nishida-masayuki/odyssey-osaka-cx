import { Box, Typography } from "@mui/material";

type Props = {
  time: string;
};

const TimeBorder = ({ time }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginLeft: "-68px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: "12px",
        }}
      >
        {time}
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          borderBottom: "1px dashed black",
          marginLeft: "8px",
        }}
      />
    </Box>
  );
};

export default TimeBorder;
