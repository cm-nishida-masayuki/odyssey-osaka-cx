import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AddChoiceModal } from "../components/AddChoiceModal";
import { useQuestionnaireAnswers } from "../hooks/useQuestionnaireAnswers";

type Option = "GraphQL" | "RestAPI";

export const QuestionnairePage: React.FC = () => {
  const options: Option[] = ["GraphQL", "RestAPI"];
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleOptionClick = (option: Option): void => {
    setSelectedOption(option);
  };

  const { id: questionnaireId } = useParams();
  if (questionnaireId === undefined) {
    throw new Error("idが未入力になっています");
  }

  const [isDisplayAddChoiceModal, setIsDisplayAddChoiceModal] =
    useState<boolean>(false);

  const [_, { handlePutChoices }] = useQuestionnaireAnswers({
    questionnaireId: parseInt(questionnaireId, 10),
  });

  const onAddChoice = async (choice: string) => {
    await handlePutChoices({ title: choice });
    setIsDisplayAddChoiceModal(false);
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
        fontWeight={500}
        style={{ fontSize: "14px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        gap="8px"
        onClick={() => setIsDisplayAddChoiceModal(true)}
      >
        <span style={{ fontSize: "24px", lineHeight: "32px" }}>+</span>
        <span style={{ paddingTop: "3px" }}>選択肢を追加</span>
      </Box>

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
      {isDisplayAddChoiceModal && (
        <AddChoiceModal
          onAdd={onAddChoice}
          onClose={() => setIsDisplayAddChoiceModal(false)}
        />
      )}
    </Box>
  );
};
