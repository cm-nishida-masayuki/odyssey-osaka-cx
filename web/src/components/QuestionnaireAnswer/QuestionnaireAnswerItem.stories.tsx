import type { Meta, StoryObj } from "@storybook/react";
import { QuestionnaireAnswerItem } from "./QuestionnaireAnswerItem";

const meta = {
  title: "pages/QuestionnaireAnswerItem",
  component: QuestionnaireAnswerItem,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof QuestionnaireAnswerItem>;

export default meta;

type Story = StoryObj<typeof QuestionnaireAnswerItem>;

export const Default: Story = {
  args: {
    choice: "choice",
    count: 33,
    allCount: 100,
  },
} satisfies Story;
