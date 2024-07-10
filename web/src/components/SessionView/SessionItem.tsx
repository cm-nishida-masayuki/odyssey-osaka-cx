import { Box } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import ClockIcon from "../../assets/clock-regular.svg";
import UserIcon from "../../assets/user.svg";

interface SessionItemProps {
  id: string;
  startAt: Date;
  endAt: Date;
  speakerTitle: string;
  speakerName: string;
}

const linkStyle = {
  textDecoration: "none",
  color: "inherit",
  ":visited": { color: "inherit" },
  border: "0.5px solid",
  borderRadius: "16px",
  borderColor: "rgba(209, 208, 221, 1)",
  padding: "12px 16px",
};

export const SessionItem: React.FC<SessionItemProps> = ({
  id,
  startAt,
  endAt,
  speakerTitle,
  speakerName,
}) => {
  const timeRange = `${format(startAt, "H:mm")}~${format(endAt, "H:mm")}`;

  return (
    <Box component={Link} to={`/session/${id}`} sx={linkStyle}>
      <Box display="flex" gap="24px" marginBottom="4px">
        <Box display="flex" alignItems="center" gap="8px">
          <img src={ClockIcon} width="12px" height="12px" alt="" />
          <Box
            component="span"
            fontSize="14px"
            fontWeight={600}
            fontFamily="Kanit, sans-serif"
          >
            {timeRange}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap="8px">
          <img src={UserIcon} width="12px" height="12px" alt="" />
          <Box component="span" fontSize="14px">
            {speakerName}
          </Box>
        </Box>
      </Box>
      <Box
        component="p"
        sx={{
          lineBreak: "anywhere",
          fontWeight: 500,
          fontSize: "16px",
          margin: 0,
        }}
      >
        {speakerTitle}
      </Box>
    </Box>
  );
};
