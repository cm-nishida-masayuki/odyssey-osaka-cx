import { Typography } from "@mui/material";
import BreakItem from "../components/SessionView/BreakList";
import SessionItem from "../components/SessionView/SessionItem";
import SessionList from "../components/SessionView/SessionList";
import TimeBorder from "../components/SessionView/TimeBorder";

export const SessionListPage = () => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontSize: "24px",
          fontWeight: "bold",
          margin: "12px 16px",
        }}
      >
        セッション
      </Typography>
      <SessionList>
        <TimeBorder time="11:00" />
        <SessionItem
          title="セッションのタイトルが入ります。長い可能性があります。"
          speaker={`クラスメソッド株式会社製造\nビジネステクノロジー部 山田 太郎`}
        />
        <TimeBorder time="11:50" />
        <BreakItem />
        <TimeBorder time="12:00" />
        <SessionItem
          title="セッションのタイトルが入ります。長い可能性があります。"
          speaker={`クラスメソッド株式会社製造\nビジネステクノロジー部 山田 太郎`}
        />
        <TimeBorder time="12:50" />
        <BreakItem />
        <TimeBorder time="13:00" />
      </SessionList>
    </>
  );
};
