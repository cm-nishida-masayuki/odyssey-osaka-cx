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
              actions: ["dynamodb:PutItem", "dynamodb:Scan"],
              resources: [
                `arn:aws:dynamodb:${region}:${accountId}:table/${props.questionnairesTabName}`,
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

    questionnaires.addMethod("GET", queryQuestionnairesItg, this.methodOptions);

    const putChoicesItg = new apigateway.AwsIntegration({
      service: "dynamodb",
      integrationHttpMethod: "POST",
      action: "PutItem",
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
              "application/json": "{}",
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
          requestValidatorName: "PutChoiceRequestValidator",
          validateRequestBody: true,
          validateRequestParameters: true,
        },
      });

    this.addCreateAnswerResources(questionnaireIdResource);
  }

  private addCreateAnswerResources(
    questionnaireIdResource: apigateway.Resource,
  ) {
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

    questionnaireIdResource
      .addResource("answers")
      .addMethod("POST", createAnswerItg, {
        requestModels: {
          "application/json": createAnswerRequestModel,
        },
        ...this.methodOptions,
        requestParameters: {
          "method.request.path.questionnaireId": true,
        },
        requestValidatorOptions: {
          requestValidatorName: "CreateAnswerRequest",
          validateRequestBody: true,
          validateRequestParameters: true,
        },
      });
  }
}
