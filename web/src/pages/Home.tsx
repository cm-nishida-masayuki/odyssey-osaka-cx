import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { addMinutes } from "date-fns";
import { Link } from "react-router-dom";
import { QuestionnaireList } from "../components/QuestionnaireItem";
import { SessionItem } from "../components/SessionView/SessionItem";

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

const sessionList = Array.from({ length: 20 }).map((_, i) => {
  return {
    id: "" + i,
    startAt: new Date(),
    endAt: addMinutes(new Date(), 90),
  };
});

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
          <p>Developers IO Odysseyに関する情報を生成AIが答えます</p>
          <Box
            component={Link}
            to="/gen-ai"
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
          <SessionItem
            id={sessionList[0].id}
            startAt={sessionList[0].startAt}
            endAt={sessionList[0].endAt}
            speakerTitle={
              "セッションのタイトルがここに入ります。2行になる可能性もあります。"
            }
            speakerName={"山田太郎"}
          />
          <SessionItem
            id={sessionList[0].id}
            startAt={sessionList[0].startAt}
            endAt={sessionList[0].endAt}
            speakerTitle={
              "セッションのタイトルがここに入ります。2行になる可能性もあります。"
            }
            speakerName={"山田太郎"}
          />
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
          <QuestionnaireList />
          <QuestionnaireList />
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
    </>
  );
};
