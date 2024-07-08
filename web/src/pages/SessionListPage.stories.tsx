import type { Meta, StoryObj } from "@storybook/react";
import { SessionListPage } from "./SessionListPage";

const meta = {
  title: "pages/SessionListPage",
  component: SessionListPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SessionListPage>;

export default meta;

type Story = StoryObj<typeof SessionListPage>;

export const Default: Story = {};
