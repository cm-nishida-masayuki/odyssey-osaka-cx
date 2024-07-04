import type { Meta, StoryObj } from "@storybook/react";
import SessionList from "./SessionList";
import TimeBorder from "./TimeBorder";
import SessionItem from "./SessionItem";
import BreakItem from "./BreakList";

const meta: Meta<typeof SessionList> = {
  title: "SessionList",
  component: SessionList,
};

export default meta;

type Story = StoryObj<typeof SessionList>;

export const SessionListSample: Story = {
  render: () => (
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
  ),
  args: {},
};
