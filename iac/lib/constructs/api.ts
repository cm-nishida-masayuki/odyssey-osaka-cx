import {
  aws_apigateway as apigateway,
  aws_iam as iam,
  Stack,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { readFileSync } from "fs";
import { resolve } from "path";

type ApiConstructProps = {
  questionnairesTabName: string;
  questionnaireIdGsiName: string;
  sessionsTabName: string;
  sessionIdGsiName: string;
};

export class ApiConstruct extends Construct {
  private readonly restApi: apigateway.RestApi;
  private readonly itgIamRole: iam.Role;
  private readonly responseCorsHeaders: {
    [key: string]: string;
  };
  private readonly methodOptions: apigateway.MethodOptions;
  private readonly vtlDir: string;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    this.restApi = new apigateway.RestApi(this, "Default", {
      restApiName: "odyssey-osaka-api",
      description:
        "This service provides the API for Odyssey Osaka ex CX booth",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    const region = Stack.of(this).region;
    const accountId = Stack.of(this).account;
    this.vtlDir = resolve(__dirname, "../vtl-templates");

    this.itgIamRole = new iam.Role(this, "ItgIamRole", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      inlinePolicies: {
        dynamoDBPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                "dynamodb:ConditionCheckItem",
                "dynamodb:PutItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:TransactWriteItems",
                "dynamodb:UpdateItem",
              ],
              resources: [
                `arn:aws:dynamodb:${region}:${accountId}:table/${props.questionnairesTabName}`,
                `arn:aws:dynamodb:${region}:${accountId}:table/${props.sessionsTabName}`,
              ],
            }),
          ],
        }),
      },
    });

    const sharedMethodOptions = {
      responseModels: {
        "application/json": apigateway.Model.EMPTY_MODEL,
      },
      responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": true,
      },
    };

    this.methodOptions = {
      methodResponses: [
        {
          statusCode: "200",
          ...sharedMethodOptions,
        },
        {
          statusCode: "400",
          ...sharedMethodOptions,
        },
        {
          statusCode: "500",
          ...sharedMethodOptions,
        },
      ],
    };

    this.responseCorsHeaders = {
      "method.response.header.Access-Control-Allow-Origin": "'*'",
    };

    const queryQuestionnairesItg = new apigateway.AwsIntegration({
      service: "dynamodb",
      integrationHttpMethod: "POST",
      action: "Scan",
      options: {
        credentialsRole: this.itgIamRole,
        requestTemplates: {
          "application/json": JSON.stringify({
            TableName: props.questionnairesTabName,
            IndexName: props.questionnaireIdGsiName,
          }),
        },
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              ...this.responseCorsHeaders,
            },
            responseTemplates: {
              "application/json": readFileSync(
                resolve(this.vtlDir, "list-questionnaires-response.vtl"),
              ).toString(),
            },
          },
        ],
      },
    });

    const questionnaires = this.restApi.root.addResource("questionnaires");
    const sessionsResource = this.restApi.root.addResource("sessions");

    questionnaires.addMethod("GET", queryQuestionnairesItg, this.methodOptions);

    const putChoicesItg = new apigateway.AwsIntegration({
      service: "dynamodb",
      integrationHttpMethod: "POST",
      action: "TransactWriteItems",
      options: {
        credentialsRole: this.itgIamRole,
        requestTemplates: {
          "application/json": readFileSync(
            resolve(this.vtlDir, "put-choice-request.vtl"),
          ).toString(),
        },
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              ...this.responseCorsHeaders,
            },
            responseTemplates: {
              "application/json": readFileSync(
                resolve(this.vtlDir, "put-choice-response.vtl"),
              ).toString(),
            },
          },
        ],
      },
    });

    const putChoiceRequestModel = this.restApi.addModel("PutChoiceRequest", {
      contentType: "application/json",
      modelName: "PutChoiceRequest",
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: "PutChoiceRequest",
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          title: {
            type: apigateway.JsonSchemaType.STRING,
            maxLength: 50,
            minLength: 1,
          },
        },
        required: ["title"],
      },
    });

    const questionnaireIdResource =
      questionnaires.addResource("{questionnaireId}");

    questionnaireIdResource
      .addResource("choices")
      .addMethod("PUT", putChoicesItg, {
        requestModels: {
          "application/json": putChoiceRequestModel,
        },
        ...this.methodOptions,
        requestParameters: {
          "method.request.path.questionnaireId": true,
        },
        requestValidatorOptions: {
          validateRequestBody: true,
          validateRequestParameters: true,
        },
      });

    const answersResource = questionnaireIdResource.addResource("answers");
    this.addCreateAnswerResources(answersResource);
    this.addListAnswersResources(answersResource);
    this.addListSessionsResources(sessionsResource, props);

    const commentsResource = sessionsResource
      .addResource("{sessionId}")
      .addResource("comments");

    this.addCreateSessionsCommentResources(commentsResource, props);
    this.addListSessionCommentssResources(commentsResource);
  }

  private addCreateAnswerResources(answersResource: apigateway.Resource) {
    const createAnswerRequestModel = this.restApi.addModel(
      "CreateAnswerRequest",
      {
        contentType: "application/json",
        modelName: "CreateAnswerRequest",
        schema: {
          schema: apigateway.JsonSchemaVersion.DRAFT4,
          title: "CreateAnswerRequest",
          type: apigateway.JsonSchemaType.OBJECT,
          properties: {
            participantId: {
              type: apigateway.JsonSchemaType.STRING,
              minLength: 36,
              maxLength: 36,
            },
            participantName: {
              type: apigateway.JsonSchemaType.STRING,
              minLength: 1,
              maxLength: 50,
            },
            choice: {
              type: apigateway.JsonSchemaType.STRING,
              minLength: 1,
              maxLength: 50,
            },
            content: {
              type: apigateway.JsonSchemaType.STRING,
              minLength: 1,
              maxLength: 400,
            },
          },
          required: ["participantId", "participantName", "choice"],
        },
      },
    );

    const createAnswerItg = new apigateway.AwsIntegration({
      service: "dynamodb",
      integrationHttpMethod: "POST",
      action: "PutItem",
      options: {
        credentialsRole: this.itgIamRole,
        requestTemplates: {
          "application/json": readFileSync(
            resolve(this.vtlDir, "create-answer-request.vtl"),
          ).toString(),
        },
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              ...this.responseCorsHeaders,
            },
            responseTemplates: {
              "application/json": "{}",
            },
          },
        ],
      },
    });

    answersResource.addMethod("POST", createAnswerItg, {
      requestModels: {
        "application/json": createAnswerRequestModel,
      },
      ...this.methodOptions,
      requestParameters: {
        "method.request.path.questionnaireId": true,
      },
      requestValidatorOptions: {
        validateRequestBody: true,
        validateRequestParameters: true,
      },
    });
  }

  private addListAnswersResources(answersResource: apigateway.Resource) {
    const listAnswersItg = new apigateway.AwsIntegration({
      service: "dynamodb",
      integrationHttpMethod: "POST",
      action: "Query",
      options: {
        credentialsRole: this.itgIamRole,
        requestTemplates: {
          "application/json": readFileSync(
            resolve(this.vtlDir, "list-answers-request.vtl"),
          ).toString(),
        },
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              ...this.responseCorsHeaders,
            },
            responseTemplates: {
              "application/json": readFileSync(
                resolve(this.vtlDir, "list-answers-response.vtl"),
              ).toString(),
            },
          },
        ],
      },
    });

    answersResource.addMethod("GET", listAnswersItg, {
      ...this.methodOptions,
      requestParameters: {
        "method.request.path.questionnaireId": true,
      },
    });
  }

  private addListSessionsResources(
    sessionsResource: apigateway.Resource,
    props: ApiConstructProps,
  ) {
    const listSessionsItg = new apigateway.AwsIntegration({
      service: "dynamodb",
      integrationHttpMethod: "POST",
      action: "Scan",
      options: {
        credentialsRole: this.itgIamRole,
        requestTemplates: {
          "application/json": JSON.stringify({
            TableName: props.sessionsTabName,
            IndexName: props.sessionIdGsiName,
          }),
        },
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              ...this.responseCorsHeaders,
            },
            responseTemplates: {
              "application/json": readFileSync(
                resolve(this.vtlDir, "list-sessions-response.vtl"),
              ).toString(),
            },
          },
        ],
      },
    });

    sessionsResource.addMethod("GET", listSessionsItg, this.methodOptions);
  }

  private addCreateSessionsCommentResources(
    commentsResource: apigateway.Resource,
    props: ApiConstructProps,
  ) {
    const createSessionCommentItg = new apigateway.AwsIntegration({
      service: "dynamodb",
      integrationHttpMethod: "POST",
      action: "TransactWriteItems",
      options: {
        credentialsRole: this.itgIamRole,
        requestTemplates: {
          "application/json": readFileSync(
            resolve(this.vtlDir, "create-session-comment-request.vtl"),
          ).toString(),
        },
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              ...this.responseCorsHeaders,
            },
            responseTemplates: {
              "application/json": readFileSync(
                resolve(this.vtlDir, "create-session-comment-response.vtl"),
              ).toString(),
            },
          },
        ],
      },
    });

    const createSessionCommentRequestModel = this.restApi.addModel(
      "CreateSessionCommentRequest",
      {
        contentType: "application/json",
        modelName: "CreateSessionCommentRequest",
        schema: {
          schema: apigateway.JsonSchemaVersion.DRAFT4,
          title: "CreateSessionCommentRequest",
          type: apigateway.JsonSchemaType.OBJECT,
          properties: {
            participantId: {
              type: apigateway.JsonSchemaType.STRING,
              minLength: 36,
              maxLength: 36,
            },
            participantName: {
              type: apigateway.JsonSchemaType.STRING,
              minLength: 1,
              maxLength: 50,
            },
            comment: {
              type: apigateway.JsonSchemaType.STRING,
              minLength: 1,
              maxLength: 200,
            },
          },
          required: ["participantId", "participantName", "comment"],
        },
      },
    );

    commentsResource.addMethod("POST", createSessionCommentItg, {
      requestModels: {
        "application/json": createSessionCommentRequestModel,
      },
      ...this.methodOptions,
      requestParameters: {
        "method.request.path.sessionId": true,
      },
      requestValidatorOptions: {
        validateRequestBody: true,
        validateRequestParameters: true,
      },
    });
  }

  private addListSessionCommentssResources(
    sessionsResource: apigateway.Resource,
  ) {
    const listSessionCommentsItg = new apigateway.AwsIntegration({
      service: "dynamodb",
      integrationHttpMethod: "POST",
      action: "Query",
      options: {
        credentialsRole: this.itgIamRole,
        requestTemplates: {
          "application/json": readFileSync(
            resolve(this.vtlDir, "list-session-comments-request.vtl"),
          ).toString(),
        },
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              ...this.responseCorsHeaders,
            },
            responseTemplates: {
              "application/json": readFileSync(
                resolve(this.vtlDir, "list-session-comments-response.vtl"),
              ).toString(),
            },
          },
        ],
      },
    });

    sessionsResource.addMethod(
      "GET",
      listSessionCommentsItg,
      this.methodOptions,
    );
  }
}
