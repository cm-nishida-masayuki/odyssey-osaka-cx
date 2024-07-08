import { Box } from "@mui/material";
import Clock from "../assets/clock-regular.svg";

export const SessionDetailsPage = () => {
  return (
    <Box padding="24px">
      <img
        className=""
        src="https://placehold.jp/345x194.png"
        alt=""
        style={{
          width: "100%",
          marginBottom: "16px",
        }}
      />
      <h2
        style={{
          color: "#5C5B64",
          fontSize: "20px",
          margin: "0 0 16px 0",
        }}
      >
        セッションのタイトルがここに入ります。2行になる可能性もあります。
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
        <p style={{ margin: "0 0 0 8px", color: "#5C5B64" }}>9:00 ~ 9:50</p>
      </Box>

      <p
        style={{
          margin: "0 0 24px 0",
          color: "#5C5B64",
        }}
      >
        セッションの内容説明がここに入ります。 改行されることがあります。
        <br />
        <br />
        複数行が考えられます。
        <br />
        <br />
        セッションの内容説明が入ります。セッションの内容説明が入ります。セッションの内容説明が入ります。セッションの内容説明が入ります。セッションの内容説明が入ります。セッションの内容説明が入ります。セッションの内容説明が入ります。
      </p>

      <Box display={"flex"} alignItems={"center"} marginBottom={"40px"}>
        <img
          src="https://placehold.jp/150x150.png"
          alt=""
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
            クラスメソッド株式会社
            <br />
            産業支援グループ
            <br />
            製造ビジネステクノロジー部
          </p>
          <p
            style={{
              margin: 0,
              color: "#5C5B64",
            }}
          >
            大阪 太郎
          </p>
        </Box>
      </Box>
    </Box>
  );
};
