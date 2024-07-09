import { Box } from "@mui/material";
import { SessionItem } from "../components/SessionView/SessionItem";
import { useSessions } from "../hooks/useSessions";
import Loading from "../components/Loading";

export const SessionListPage = () => {
  const [{ data, isLoading, error }] = useSessions();

  // TODO: ローディングのデザイン
  if (isLoading || data === undefined) {
    return <Loading />;
  }
  // TODO: エラーのデザイン
  if (error) {
    return <div>Error...</div>;
  }

  return (
    <>
      <>
        <Box paddingX="24px" paddingTop="32px">
          {/* <Box
            marginBottom={"24px"}
            display="flex"
            flexDirection="column"
            gap="12px"
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "27.24px",
                textAlign: "left",
                margin: "0",
              }}
            >
              進行中のセッション
            </h2>

            <SessionItem
              id={"1"}
              key={1}
              startAt={new Date()}
              endAt={addMinutes(new Date(), 90)}
              speakerTitle="セッションのタイトルが入ります。長い可能性があります。"
              speakerName="大阪太郎"
            />
          </Box> */}

          <Box display="flex" flexDirection="column" gap="12px">
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "27.24px",
                textAlign: "left",
                margin: "0",
              }}
            >
              全セッション
            </h2>
            {data.sessions.map((session) => (
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
        </Box>
      </>
    </>
  );
};
