import { Box } from "@mui/material";
import { addMinutes } from "date-fns";
import { SessionItem } from "../components/SessionView/SessionItem";

const sessionList = Array.from({ length: 20 }).map((_, i) => {
  return {
    id: "" + i,
    startAt: new Date(),
    endAt: addMinutes(new Date(), 90),
  };
});

export const SessionListPage = () => {
  return (
    <>
      <Box
        paddingX="24px"
        paddingTop="32px"
        display="flex"
        flexDirection="column"
        gap="12px"
      >
        {sessionList.map(({ id, startAt, endAt }, i) => {
          return (
            <SessionItem
              id={id}
              key={i}
              startAt={startAt}
              endAt={endAt}
              speakerTitle="セッションのタイトルが入ります。長い可能性があります。"
              speakerName="大阪太郎"
            />
          );
        })}
      </Box>
    </>
  );
};
