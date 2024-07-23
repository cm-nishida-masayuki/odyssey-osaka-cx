import { Backdrop, Box, Slide } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { QuestionnaireList } from "../components/QuestionnaireItem";
import { RegistrationModal } from "../components/RegistrationNicknameModal";
import { SessionItem } from "../components/SessionView/SessionItem";
import { useHome } from "../hooks/useHome";
import { GenAIPage } from "./GenAIPage";

const Title = ({ title }: { title: string }) => (
  <h2
    style={{
      fontSize: "20px",
      fontWeight: "700",
      lineHeight: "27.24px",
      textAlign: "left",
      margin: "0",
    }}
  >
    {title}
  </h2>
);

const ClassmethodLogoBox = styled(Box)(() => ({
  border: "2px solid #000",
  position: "relative",
  paddingInline: "16px",
  marginTop: "16px",
  "&::before": {
    content: '""',
    position: "absolute",
    width: 16,
    height: 16,
    background: "#F5F5F5",
    top: -8,
    right: 25,
    borderRight: "2px solid #000",
    borderBottom: "2px solid #000",
    transform: "rotate(45deg)",
  },
}));

export const HomePage = () => {
  const [{ data, error, isLoading }] = useHome();
  const [genAiOpen, setGenAiOpen] = useState(false);

  if (isLoading || data === undefined) {
    return <Loading />;
  }
  if (error) {
    return <div>Error...</div>;
  }

  return (
    <>
      {/* 生成AI */}
      <Box
        paddingX="24px"
        paddingTop="32px"
        display="flex"
        flexDirection="column"
      >
        <Title title="生成AI" />
        <ClassmethodLogoBox
          paddingBlock="16px"
          sx={{
            border: "2px solid #000",
            borderRadius: "8px",
            "&::after": {
              bottom: "-2px",
              right: "-2px",
              "border-left": "2px solid #000",
              transform: "rotate(45deg)",
            },
          }}
        >
          <p>
            Developers IO
            Odysseyに関する情報を本日までに開催された情報も含めて生成AIが答えます
          </p>
          <Box
            onClick={() => setGenAiOpen(true)}
            sx={{
              fontSize: "12px",
              fontWeight: "600",
              lineHeight: "14.95px",
              textDecoration: "none",
              color: "inherit",
              ":visited": { color: "inherit" },
            }}
          >
            生成AIに質問する
          </Box>
        </ClassmethodLogoBox>
      </Box>

      {/* セッション */}
      <Box
        paddingX="24px"
        paddingTop="32px"
        display="flex"
        flexDirection="column"
      >
        <Title title="セッション" />
        <Box display="flex" flexDirection="column" gap="12px" paddingTop="16px">
          {data?.sessions.map((session) => (
            <SessionItem
              id={`${session.sessionId}`}
              key={session.sessionId}
              startAt={new Date(session.startAt)}
              endAt={new Date(session.endAt)}
              speakerTitle={session.sessionTitle}
              speakerName={session.speakers
                .map((speaker) => speaker.speakerName)
                .join("・")}
            />
          ))}
        </Box>
        <Box
          component={Link}
          to="/session"
          sx={{
            paddingTop: "24px",
            fontSize: "12px",
            fontWeight: "600",
            lineHeight: "14.95px",
            textAlign: "right",
            textDecoration: "none",
            color: "inherit",
            ":visited": { color: "inherit" },
          }}
        >
          他のセッションを見る →
        </Box>
      </Box>

      {/* アンケート */}
      <Box
        paddingX="24px"
        paddingY="32px"
        display="flex"
        flexDirection="column"
      >
        <Title title="アンケート" />
        <Box display="flex" flexDirection="column" gap="12px" paddingTop="16px">
          {data?.questionnaires.map((questionnaire) => (
            <QuestionnaireList key={questionnaire.id} {...questionnaire} />
          ))}
        </Box>
        <Box
          component={Link}
          to="/questionnaire"
          sx={{
            paddingTop: "24px",
            fontSize: "10px",
            fontWeight: "600",
            lineHeight: "14.95px",
            textAlign: "right",
            textDecoration: "none",
            color: "inherit",
            ":visited": { color: "inherit" },
          }}
        >
          他のアンケートを見る →
        </Box>
      </Box>
      <Backdrop
        open={genAiOpen}
        onClick={() => setGenAiOpen(false)}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          padding: "16px",
        }}
      >
        <Slide direction="up" in={genAiOpen} mountOnEnter unmountOnExit>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              bgcolor: "#F5F5F5",
              width: "100%",
              height: "60vh",
              padding: "16px",
              borderRadius: "16px",
              zIndex: (theme) => theme.zIndex.drawer + 2,
            }}
          >
            <GenAIPage />
          </Box>
        </Slide>
      </Backdrop>
      <RegistrationModal />
    </>
  );
};
