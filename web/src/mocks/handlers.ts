import { http, HttpResponse } from "msw";
import { config } from "../config";

export const handlers = [
  http.get(`${config.API_URL}/sessions`, () => {
    return HttpResponse.json(
      {
        sessions: [
          {
            sessionId: 1,
            startAt: "2024-07-31T04:50:00.000Z",
            endAt: "2024-07-31T05:10:00.000Z",
            speakerCompany: "クラスメソッド株式会社",
            speakerDepartment: "CX事業本部",
            speakerTitle: "エンジニア",
            speakerName: "めそ子",
            sessionTitle: "超すごい登壇",
            description:
              "Auroraについてあますところなく解説してくれるセッションです",
          },
          {
            sessionId: 2,
            startAt: "2024-07-31T05:20:00.000Z",
            endAt: "2024-07-31T05:40:00.000Z",
            speakerCompany: "クラスメソッド株式会社",
            speakerDepartment: "CX事業本部",
            speakerTitle: "エンジニア",
            speakerName: "クラちゃん",
            sessionTitle: "バリすごい登壇",
            description:
              "Lambdaについてあますところなく解説してくれるセッションです",
          },
        ],
      },
      { status: 200 }
    );
  }),
];
