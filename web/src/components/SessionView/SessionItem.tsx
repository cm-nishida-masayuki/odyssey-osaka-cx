import { Box } from "@mui/material";
import ClockIcon from "../../assets/clock-regular.svg";
import UserIcon from "../../assets/user.svg";
import { format } from "date-fns";
import { Link } from "react-router-dom";

type Props = {
  id: string;
  startAt: Date;
  endAt: Date;
  speakerTitle: string;
  speakerName: string;
};

export const SessionItem = ({
  id,
  startAt,
  endAt,
  speakerTitle,
  speakerName,
}: Props) => {
  return (
    <Box
      component={Link}
      sx={{
        textDecoration: "none",
        color: "inherit",
        ":visited": { color: "inherit" },
      }}
      to={`/session/${id}`}
      border="0.5px solid"
      borderRadius="16px"
      borderColor="rgba(209, 208, 221, 1)"
      padding="20px"
    >
      <Box display="flex" gap="32px">
        <Box
          display="flex"
          alignItems="center"
          gap="8px"
          fontWeight="600"
          fontSize="14px"
        >
          <img src={ClockIcon} width="12px" height="12px" />
          {format(startAt, "H:mm")}~{format(endAt, "H:mm")}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap="8px"
          fontWeight="500"
          fontSize="14px"
        >
          <img src={UserIcon} width="12px" height="12px" />
          {speakerName}
        </Box>
      </Box>
      <p
        style={{
          lineBreak: "anywhere",
          fontWeight: "500",
          fontSize: "16px",
          margin: 0,
          paddingTop: "8px",
        }}
      >
        {speakerTitle}
      </p>
    </Box>
  );
};
