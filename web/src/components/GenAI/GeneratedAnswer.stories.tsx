import type { Meta, StoryObj } from "@storybook/react";
import { GeneratedAnswer } from "./GeneratedAnswer";

const meta = {
  title: "pages/GenAI",
  component: GeneratedAnswer,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GeneratedAnswer>;

export default meta;

type Story = StoryObj<typeof GeneratedAnswer>;

export const Default: Story = {
  args: {
    text: `AWSのコストについて詳しくなりたいということですね。以下のセッションが参考になると思います。

- 7月16日 17:20-18:00 Track1 株式会社ネットプロテクションズ テックリード/SRE 宮澤孟彰_Takeaki Miyazawa
「hack2theFuture---ベテランアプリケーションを未来に繋げる」
このセッションでは、保守担当が不在となったアプリケーションを、ChatGPTやドキュメントを駆使してキャッチアップし、保守可能な状態に持っていく方法が紹介されています。AWSのコストについても言及されているかもしれません。

- 7月8日 17:10-17:50 Track1 松波花奈
「払いすぎていませんか？AWSコスト最適化へのはじめの一歩」
このセッションでは、AWSのコスト可視化の方法や無駄な支出の特定手順など、初心者でも実践できるコスト最適化の具体的な手法が紹介されています。AWSのコストについて詳しく学べると思います。

ぜひこれらのセッションを参考にしてみてください。AWSのコスト管理について理解を深められると思います。`,
  },
} satisfies Story;

export const TextLink: Story = {
  args: {
    text: `ゲーム業界に詳しくなりたいということですね。以下のセッションが参考になると思います。

- 7月5日 17:20-18:00 Track1 ホットスタッフ・プロモーション エグゼクティブプロデューサー コヤ所長
「特別な才能が無くてもヒット作品を産み出せる科学的企画開発手法＃１」
https://dev.classmethod.jp/articles/developersio-2024-game-koyashochou-session-report/

- 7月5日 13:10-13:50 Track1 バンダイナムコスタジオ スーパーバイザー 坂上陽三
「坂上陽三のプロデューサーって？入門編」

ゲームの企画開発手法やプロデューサーの役割など、ゲーム業界の基本的な知識が得られるセッションが開催されています。ぜひ参加してみてください。`,
  },
} satisfies Story;
