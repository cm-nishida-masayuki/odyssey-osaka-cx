import { http, HttpResponse } from "msw";
import { config } from "../config";
import { Sessions } from "../hooks/useSessions";
import { Comments } from "../hooks/useSessionComments";
import { Questionnaires } from "../hooks/useQuestionnaires";
import { Answers } from "../hooks/useQuestionnaireAnswers";

export const handlers = [
  http.get(`${config.API_URL}/sessions`, () => {
    return HttpResponse.json<Sessions>(
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
          {
            sessionId: 3,
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
            sessionId: 4,
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

  http.get(`${config.API_URL}/sessions/1/comments`, () => {
    return HttpResponse.json<Comments>(
      {
        comments: [
          {
            sessionId: 1,
            commentAt: "2024-07-31T05:10:00.000Z",
            participantId: "9d5f3a5f-1bf9-4f3f-987f-37137a666992",
            participantName: "参加者1",
            comment: "めっちゃわかりやすい！",
          },
        ],
      },
      { status: 200 }
    );
  }),

  http.post(`${config.API_URL}/sessions/1/comments`, () => {
    return HttpResponse.json(
      {
        sessionId: 1,
        commentAt: "2024-07-31T05:10:00.000Z",
        participantId: "9d5f3a5f-1bf9-4f3f-987f-37137a666992",
        participantName: "参加者1",
        comment: "めっちゃわかりやすい！",
      },
      { status: 201 }
    );
  }),

  http.get(`${config.API_URL}/questionnaires`, () => {
    return HttpResponse.json<Questionnaires>(
      {
        questionnaires: [
          {
            questionnaireId: 1,
            title: "好きなプログラミング言語",
            content: "好きなプログラミング言語は何ですか？",
            type: "choice",
            choices: ["COBOL", "Acess VBA", "Excel VBA"],
          },
          {
            questionnaireId: 2,
            title: "自由に意見下さい",
            content: "なんでも書いていいよ",
            type: "free",
          },
          {
            questionnaireId: 3,
            title: "好きなプログラミング言語",
            content: "好きなプログラミング言語は何ですか？",
            type: "choice",
            choices: ["COBOL", "Acess VBA", "Excel VBA"],
          },
          {
            questionnaireId: 4,
            title: "自由に意見下さい",
            content: "なんでも書いていいよ",
            type: "free",
          },
        ],
      },
      { status: 200 }
    );
  }),

  http.get(`${config.API_URL}/questionnaires/1/answers`, () => {
    return HttpResponse.json<Answers>(
      {
        answers: [
          {
            participantId: "9d5f3a5f-1bf9-4f3f-987f-37137a666992",
            participantName: "参加者1",
            answerAt: "2024-07-31T05:10:00.000Z",
            choice: "COBOL",
          },
          {
            participantId: "1f4ebfc6-0ae0-42e3-8fa0-a9fabd5d474b",
            participantName: "参加者2",
            answerAt: "2024-07-31T05:11:00.000Z",
            choice: "Access VBA",
          },
        ],
      },
      { status: 200 }
    );
  }),

  http.get(`${config.API_URL}/questionnaires/2/answers`, () => {
    return HttpResponse.json<Answers>(
      {
        answers: [
          {
            participantId: "9d5f3a5f-1bf9-4f3f-987f-37137a666992",
            participantName: "参加者1",
            answerAt: "2024-07-31T05:10:00.000Z",
            content: "良かったです",
          },
          {
            participantId: "1f4ebfc6-0ae0-42e3-8fa0-a9fabd5d474b",
            participantName: "参加者2",
            answerAt: "2024-07-31T05:11:00.000Z",
            content: "パチパチパチ888",
          },
        ],
      },
      { status: 200 }
    );
  }),

  http.post(`${config.API_URL}/questionnaires/1/answers`, () => {
    return HttpResponse.json(
      {
        participantId: "9d5f3a5f-1bf9-4f3f-987f-37137a666992",
        participantName: "参加者1",
        answerAt: "2024-07-31T05:10:00.000Z",
        choice: "COBOL",
      },
      { status: 200 }
    );
  }),

  http.put(`${config.API_URL}/questionnaires/1/choices`, () => {
    return HttpResponse.json(
      {
        "title:": "Excel VBA",
      },
      { status: 200 }
    );
  }),
];
