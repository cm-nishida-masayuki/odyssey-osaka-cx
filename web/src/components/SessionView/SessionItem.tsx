import CampaignIcon from "@mui/icons-material/Campaign";
import { Box, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";

type Props = {
  title: string;
  speaker: string;
};

const SessionList = ({ title, speaker }: Props) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <CampaignIcon
          sx={{
            color: blue[800],
            fontSize: 18,
            marginRight: "12px",
          }}
        />
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {speaker}
        </Typography>
      </Box>
    </Box>
  );
};

export default SessionList;
