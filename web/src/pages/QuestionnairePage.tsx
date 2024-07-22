import { Box, Button, Snackbar } from "@mui/material";
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AddChoiceModal } from "../components/AddChoiceModal";
import Loading from "../components/Loading";
import { useQuestionnaireAnswers } from "../hooks/useQuestionnaireAnswers";
import { useQuestionnaires } from "../hooks/useQuestionnaires";

export const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isDisplayAddChoiceModal, setIsDisplayAddChoiceModal] =
    useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const { id: questionnaireId } = useParams();
  if (questionnaireId === undefined) {
    throw new Error("idが未入力になっています");
  }

  const [{ data: questionnairesData, error, isLoading }, { clearCache }] =
    useQuestionnaires();
  const [_, { handlePutChoices, handlePostAnswer }] = useQuestionnaireAnswers({
    questionnaireId: parseInt(questionnaireId, 10),
  });

  const questionnaire = useMemo(() => {
    if (questionnairesData == null) return;
    const questionnaire = questionnairesData.questionnaires.find(
      (item) => item.id === parseInt(questionnaireId, 10)
    );

    if (questionnaire == null) {
      throw new Error("対象のアンケートが見つかりません");
    }
    return questionnaire;
  }, [questionnairesData, questionnaireId]);

  const handleOptionClick = (option: string): void => {
    setSelectedOption(option);
  };

  const onAddChoice = async (choice: string) => {
    await handlePutChoices({ title: choice });
    setSelectedOption(choice); //選択肢を追加したら、それを選択する
    clearCache(); //キャッシュを破棄
    setIsDisplayAddChoiceModal(false);
  };

  const handleAnswer = async () => {
    if (selectedOption === "") {
      setIsOpenSnackbar(true); //ユーザーに選択肢を選択するように促す
      return;
    }
    await handlePostAnswer({ choice: selectedOption });
    navigate(`/questionnaire/${questionnaireId}/answer`);
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setIsOpenSnackbar(false);
  };

  if (
    isLoading ||
    questionnairesData === undefined ||
    questionnaire === undefined
  ) {
    return <Loading />;
  }
  if (error) {
    return <div>Error...</div>;
  }

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
        {questionnaire.title}
      </h2>

      <Box marginBottom={"100px"}>
        {questionnaire.choices.map((option) => (
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
            to={`/questionnaire/${questionnaireId}/answer`}
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
          onClick={handleAnswer}
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
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
        message="選択肢を選択する必要があります"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Box>
  );
};
