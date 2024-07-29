import { TextareaAutosize } from "@mui/base";
import { Box, Button, Divider, SwipeableDrawer } from "@mui/material";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { ja } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Clock from "../assets/clock-regular.svg";
import closeImage from "../assets/close.png";
import Loading from "../components/Loading";
import { useSessionComments } from "../hooks/useSessionComments";
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
  const [{ data: comments }, { handlePostComments }] = useSessionComments({
    sessionId: parseInt(id || "1", 10),
  });
  const [isOpenCommentSheet, setIsOpenCommentSheet] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [inputComment, setInputComment] = useState("");

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
          borderRadius: "8px",
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
              flexShrink: "0",
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

      <Box position="fixed" bottom={0} left={0} right={0} padding="16px">
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
          onClick={async () => {
            setIsOpenCommentSheet(true);
          }}
        >
          コメント
          {comments !== undefined && `(${comments.length ?? 0})`}
        </Button>
      </Box>
      <React.Fragment key="bottom">
        <SwipeableDrawer
          onOpen={() => setIsOpenCommentSheet(true)}
          anchor="bottom"
          open={isOpenCommentSheet}
          onClose={() => {
            console.log("##");
            setIsOpenCommentSheet(false);
          }}
        >
          <Box maxHeight="80vh">
            <Box
              px="24px"
              py="12px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "27.24px",
                }}
              >
                コメント
                {comments !== undefined && `(${comments.length ?? 0})`}
              </span>
              <span
                onClick={() => {
                  setIsOpenCommentSheet(false);
                }}
              >
                <img
                  style={{ verticalAlign: "bottom" }}
                  height="24px"
                  width="24px"
                  src={closeImage}
                />
              </span>
            </Box>
            <Divider />
            <Box
              px="18px"
              pt="16px"
              display="flex"
              flexDirection="column"
              gap="15px"
              pb={0}
              m={0}
              maxHeight="60vh"
              overflow="scroll"
            >
              {comments?.map((item) => {
                return (
                  <CommentItem
                    key={item.commentAt}
                    comment={item.comment}
                    participantName={item.participantName}
                    createdAt={item.commentAt}
                  />
                );
              })}
            </Box>
            <Divider />

            <Box
              p="16px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap="16px"
            >
              <TextareaAutosize
                value={inputComment}
                onInput={(e) => {
                  setInputComment(e.currentTarget.value);
                }}
                // WARN: なぜか3行以上にするとレイアウト崩れる
                minRows={2}
                maxRows={2}
                style={{
                  resize: "none",
                  width: "100%",
                  fontWeight: "600",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  border: "none",
                  backgroundColor: "#D9D9D9",
                  borderRadius: "20px",
                  scrollbarWidth: "none",
                }}
              />
              <Button
                variant="contained"
                fullWidth
                style={{
                  backgroundColor:
                    inputComment.length === 0 || inputComment.length > 200
                      ? "grey"
                      : "black",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                  width: "60px",
                  height: "40px",
                  borderRadius: "20px",
                }}
                disabled={
                  inputComment.length === 0 || inputComment.length > 200
                }
                onClick={async () => {
                  await handlePostComments({ comment: inputComment });
                  setInputComment("");
                }}
              >
                送信
              </Button>
            </Box>
          </Box>
        </SwipeableDrawer>
      </React.Fragment>
    </Box>
  );
};

const CommentItem = ({
  comment,
  participantName,
  createdAt,
}: {
  comment: string;
  participantName: string;
  createdAt: string;
}) => {
  return (
    <Box p={0}>
      <Box
        style={{
          color: "#878787",
          margin: 0,
          fontSize: "14px",
          fontWeight: "700",
          lineHeight: "19.07px",
        }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <span>{participantName}</span>
        <span style={{ fontSize: "11px" }}>
          {formatDistanceToNow(new Date(createdAt), {
            locale: ja,
            addSuffix: true,
          })}
        </span>
      </Box>
      <p
        style={{
          paddingTop: "5px",
          margin: 0,
          whiteSpace: "pre-wrap",
          fontSize: "14px",
          fontWeight: "700",
          lineHeight: "19.07px",
          overflowWrap: "anywhere",
        }}
      >
        {comment}
      </p>
    </Box>
  );
};
