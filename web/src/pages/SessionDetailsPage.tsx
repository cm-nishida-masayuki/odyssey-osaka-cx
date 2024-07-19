import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import Clock from "../assets/clock-regular.svg";
import Loading from "../components/Loading";
import { useSessions } from "../hooks/useSessions";

// 時間をフォーマットする関数
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  });
};

export const SessionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ data, isLoading, error }] = useSessions();

  if (isLoading || data === undefined) {
    return <Loading />;
  }
  if (error) {
    return <div>Error...</div>;
  }

  const session = data.sessions.find((s) => s.sessionId.toString() === id);

  if (!session) {
    return <div>Session not found</div>;
  }

  const startTime = formatTime(session.startAt);
  const endTime = formatTime(session.endAt);

  return (
    <Box padding="24px">
      <img
        className=""
        src={session.sessionImageUrl || "https://placehold.jp/150x150.png"}
        style={{
          width: "100%",
          marginBottom: "16px",
          aspectRatio: 4 / 3,
          objectFit: "cover",
        }}
      />
      <h2
        style={{
          color: "#5C5B64",
          fontSize: "20px",
          margin: "0 0 16px 0",
        }}
      >
        {session.sessionTitle}
      </h2>
      <Box display={"flex"} alignItems={"center"} marginBottom={"16px"}>
        <img
          src={Clock}
          alt=""
          style={{
            width: "14px",
            height: "14px",
          }}
        />
        <p style={{ margin: "0 0 0 8px", color: "#5C5B64" }}>
          {startTime} ~ {endTime}
        </p>
      </Box>

      <p
        style={{
          margin: "0 0 24px 0",
          color: "#5C5B64",
          whiteSpace: "pre-wrap",
        }}
      >
        {session.description.replace(/\\n/g, "\n")}
      </p>

      {session.speakers.map((speaker, index) => (
        <Box
          key={index}
          display={"flex"}
          alignItems={"center"}
          marginBottom={"40px"}
        >
          <img
            src={speaker.speakerImageUrl || "https://placehold.jp/150x150.png"}
            alt={`${speaker.speakerName}'s profile`}
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
            }}
          />
          <Box marginLeft={"24px"}>
            <p
              style={{
                fontSize: "12px",
                lineHeight: "14px",
                margin: "0 0 8px 0",
                color: "#5C5B64",
              }}
            >
              {speaker.speakerCompany}
              <br />
              {speaker.speakerDepartment}
              <br />
              {speaker.speakerTitle}
            </p>
            <p
              style={{
                margin: 0,
                color: "#5C5B64",
              }}
            >
              {speaker.speakerName}
            </p>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
