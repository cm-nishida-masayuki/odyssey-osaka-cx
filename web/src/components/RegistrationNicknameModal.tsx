import { v4 as uuidv4 } from "uuid";

import { Box } from "@mui/material";
import { DarkBackDrop } from "./DarkBackDrop";
import { useState } from "react";
import { useLocalStore } from "../hooks/useLocalStore";

export const RegistrationModal = () => {
  const [nickName, setNickName] = useState("");

  const [participantId, setParticipantId] =
    useLocalStore<string>("participantId");
  const [_, setParticipantName] = useLocalStore<string>("participantName");

  const onRegister = () => {
    setParticipantId(uuidv4());
    setParticipantName(nickName);
  };

  if (participantId !== null) {
    return <></>;
  }
  return (
    <DarkBackDrop isShow onClickBackdrop={() => {}}>
      <Box
        display="grid"
        bgcolor="#F5F5F5"
        width="299px"
        borderRadius="16px"
        color="black"
      >
        <Box p="16px">
          <h3 style={{ fontWeight: 600, fontSize: "20px", margin: 0 }}>
            ニックネームを登録
          </h3>
          <Box pt="20px" pl="8px">
            <input
              onInput={(e) => {
                setNickName(e.currentTarget.value);
              }}
              maxLength={50}
              placeholder="ニックネーム（最大50文字）"
              style={{
                width: "100%",
                height: "40px",
                fontSize: "16px",
                fontWeight: "600",
                paddingLeft: "16px",
                paddingRight: "16px",
                border: "none",
                backgroundColor: "#D9D9D9",
                borderRadius: "20px",
              }}
            />
          </Box>

          <Box pt="16px" pl="8px">
            <button
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "20px",
                color: "white",
                backgroundColor: "#212121",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "21.79px",
                textAlign: "center",
              }}
              onClick={onRegister}
            >
              登録
            </button>
          </Box>
        </Box>
      </Box>
    </DarkBackDrop>
  );
};
