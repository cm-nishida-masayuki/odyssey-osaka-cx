import { Box } from "@mui/material";
import { useState } from "react";

export const GenAIPage = () => {
  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");

  const generateText = async (question: string) => {
    const response = await fetch(
      "https://kxgkenb5zxrap6wadcjgglvvzu0wtlhh.lambda-url.us-east-1.on.aws/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      }
    );
    const data = (await response.json()) as { response: string };
    return data;
  };

  const onClick = async () => {
    const res = await generateText(question);
    setText(res.response);
  };

  return (
    <Box padding={"24px"} display={"flex"} flexDirection={"column"} gap={2}>
      <Box>
        <h3 style={{ fontWeight: 600, fontSize: "20px", margin: 0 }}>
          質問を入力してください
        </h3>
        <Box pt="20px">
          <input
            type="text"
            maxLength={100}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            placeholder="選択肢（最大20文字）"
            style={{
              width: "100%",
              height: "40px",
              fontSize: "16px",
              fontWeight: "600",
              paddingInline: "16px",
              border: "none",
              backgroundColor: "#D9D9D9",
              borderRadius: "20px",
            }}
          />
        </Box>
        <Box pt="16px">
          <button
            onClick={onClick}
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "20px",
              backgroundColor: "#212121",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "21.79px",
              textAlign: "center",
            }}
          >
            回答を生成
          </button>
        </Box>
      </Box>
      <Box>
        <Box height={100} bgcolor={"#D9D9D9"} borderRadius={"8px"}>
          {text}
        </Box>
      </Box>
    </Box>
  );
};
