import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

type Option = "GraphQL" | "RestAPI";

export const QuestionnairePage: React.FC = () => {
  const options: Option[] = ["GraphQL", "RestAPI"];
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleOptionClick = (option: Option): void => {
    setSelectedOption(option);
  };

  return (
    <Box padding={"24px"}>
      <h2
        style={{
          margin: "0 0 24px 0",
          color: "#5C5B64",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        GraphQL vs RestAPI
      </h2>

      {options.map((option) => (
        <Box
          key={option}
          display={"flex"}
          alignItems={"center"}
          height={"48px"}
          padding={"0 24px"}
          marginBottom={"12px"}
          border={
            selectedOption === option
              ? "solid 2px #6BAD65"
              : "solid 0.5px #212121"
          }
          borderRadius={"24px"}
          bgcolor={selectedOption === option ? "#E7FFE5" : "transparent"}
          onClick={() => handleOptionClick(option)}
          style={{ cursor: "pointer" }}
        >
          <p
            style={{
              color: "#5C5B64",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {option}
          </p>
        </Box>
      ))}

      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        padding="16px"
        bgcolor="#F5F5F5"
      >
        <Box display="flex" justifyContent="flex-end" marginBottom="8px">
          <Link
            to=""
            style={{
              marginRight: "8px",
              color: "#5C5B64",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            結果を見る &gt;
          </Link>
        </Box>
        <Button
          variant="contained"
          fullWidth
          style={{
            height: "48px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "9999px",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          回答
        </Button>
      </Box>
    </Box>
  );
};
