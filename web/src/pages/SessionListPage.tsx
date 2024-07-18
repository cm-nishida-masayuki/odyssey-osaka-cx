import { Box } from "@mui/material";
import Loading from "../components/Loading";
import { SessionItem } from "../components/SessionView/SessionItem";
import { useSessions } from "../hooks/useSessions";

export const SessionListPage = () => {
  const [{ data, isLoading, error }] = useSessions();

  if (isLoading || data === undefined) {
    return <Loading />;
  }
  if (error) {
    return <div>Error...</div>;
  }

  return (
    <>
      <>
        <Box paddingX="24px" paddingTop="32px">
          {0 < data.currentSessions.length && (
            <Box
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
              {data.currentSessions.map((session) => (
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
          )}

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
