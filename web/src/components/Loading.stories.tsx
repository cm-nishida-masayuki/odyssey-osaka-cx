import type { Meta, StoryObj } from "@storybook/react";
import Loading from "./Loading";

const meta = {
  title: "components/Loading",
  component: Loading,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof Loading>;

export const Default: Story = {};
