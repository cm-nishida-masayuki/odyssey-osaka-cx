import { Box } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const SessionList: React.FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        marginRight: "16px",
      }}
    >
      <Box
        sx={{
          width: "2px",
          backgroundColor: "#BBBBBB",
          marginRight: "16px",
          marginLeft: "65px",
        }}
      />
      <Box
        sx={{
          flexGrow: "1",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SessionList;
