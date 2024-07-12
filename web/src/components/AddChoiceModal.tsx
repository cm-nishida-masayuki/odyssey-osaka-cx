import { Box } from "@mui/material";
import { DarkBackDrop } from "./DarkBackDrop";
import { useState } from "react";

export const AddChoiceModal = ({
  onAdd,
  onClose,
}: {
  onAdd: (choice: string) => void;
  onClose: () => void;
}) => {
  const [choice, setChoice] = useState("");
  const canSubmit = choice.trim() !== "";
  return (
    <DarkBackDrop isShow onClickBackdrop={onClose}>
      <Box
        display="grid"
        bgcolor="#F5F5F5"
        width="299px"
        borderRadius="16px"
        color="black"
        onClick={(e) => e.stopPropagation()}
      >
        <Box p="16px">
          <h3 style={{ fontWeight: 600, fontSize: "20px", margin: 0 }}>
            選択肢を追加
          </h3>
          <Box pt="20px" pl="8px">
            <input
              onInput={(e) => {
                setChoice(e.currentTarget.value);
              }}
              maxLength={20}
              placeholder="選択肢（最大20文字）"
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
              disabled={!canSubmit}
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "20px",
                color: "white",
                backgroundColor: canSubmit ? "#212121" : "#818181",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "21.79px",
                textAlign: "center",
              }}
              onClick={() => onAdd(choice)}
            >
              追加
            </button>
          </Box>
        </Box>
      </Box>
    </DarkBackDrop>
  );
};
