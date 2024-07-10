import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const Loading = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return "";
        }
        return prevDots + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      paddingTop="160px"
    >
      <div
        style={{
          fontFamily: "Kanit, sans-serif",
          // fontSize: "16px",
          position: "relative",
        }}
      >
        Loading
        <span
          style={{
            position: "absolute",
            textAlign: "left",
            marginLeft: "4px",
          }}
        >
          {dots}
        </span>
      </div>
    </Box>
  );
};

export default Loading;
