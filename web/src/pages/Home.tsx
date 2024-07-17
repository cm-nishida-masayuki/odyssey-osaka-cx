import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { QuestionnaireList } from "../components/QuestionnaireItem";
import { RegistrationModal } from "../components/RegistrationNicknameModal";
import { SessionItem } from "../components/SessionView/SessionItem";
import { useHome } from "../hooks/useHome";

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

export const HomePage = () => {
  const [{ data, error, isLoading }] = useHome();

  if (isLoading || data === undefined) {
    return <Loading />;
  }
  if (error) {
    return <div>Error...</div>;
  }

  return (
    <>
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
              speakerName={session.speakerName}
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
        paddingTop="32px"
        display="flex"
        flexDirection="column"
      >
        <Title title="アンケート" />
        <Box display="flex" flexDirection="column" gap="12px" paddingTop="16px">
          {data?.questionnaires.map((questionnaire) => (
            <QuestionnaireList
              key={questionnaire.questionnaireId}
              {...questionnaire}
            />
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
      <RegistrationModal />
    </>
  );
};
