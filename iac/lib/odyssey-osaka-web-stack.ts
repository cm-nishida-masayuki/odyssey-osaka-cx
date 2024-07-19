import {
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_iam,
  aws_s3,
  aws_s3_deployment,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
} from "aws-cdk-lib";
import type { Construct } from "constructs";
import { existsSync } from "fs";
import { resolve } from "path";
export class OdysseyOsakaWebStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const webBucket = new aws_s3.Bucket(this, "WebBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      bucketName: "odyssey-osaka-web",
      encryption: aws_s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
    });

    const originAccessIdentity = new aws_cloudfront.OriginAccessIdentity(
      this,
      "WebOriginAccessIdentity"
    );

    const webSiteBucketPolicyStatement = new aws_iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: aws_iam.Effect.ALLOW,
      principals: [
        new aws_iam.CanonicalUserPrincipal(
          originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ),
      ],
      resources: [`${webBucket.bucketArn}/*`],
    });

    webBucket.addToResourcePolicy(webSiteBucketPolicyStatement);

    const webDistribution = new aws_cloudfront.Distribution(
      this,
      "WebDistribution",
      {
        defaultRootObject: "index.html",
        errorResponses: [
          {
            ttl: Duration.seconds(300),
            httpStatus: 403,
            responseHttpStatus: 403,
            responsePagePath: "/index.html",
          },
          {
            ttl: Duration.seconds(300),
            httpStatus: 404,
            responseHttpStatus: 404,
            responsePagePath: "/index.html",
          },
        ],
        defaultBehavior: {
          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachedMethods: aws_cloudfront.CachedMethods.CACHE_GET_HEAD,
          cachePolicy: aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
          viewerProtocolPolicy:
            aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          origin: new aws_cloudfront_origins.S3Origin(webBucket, {
            originAccessIdentity,
          }),
          responseHeadersPolicy: new aws_cloudfront.ResponseHeadersPolicy(
            this,
            "WebResponseHeaderPolicy",
            {
              securityHeadersBehavior: {
                contentTypeOptions: { override: true },
                frameOptions: {
                  frameOption: aws_cloudfront.HeadersFrameOption.DENY,
                  override: true,
                },
                referrerPolicy: {
                  referrerPolicy:
                    aws_cloudfront.HeadersReferrerPolicy.SAME_ORIGIN,
                  override: true,
                },
                strictTransportSecurity: {
                  accessControlMaxAge: Duration.seconds(63072000),
                  includeSubdomains: true,
                  preload: true,
                  override: true,
                },
                xssProtection: {
                  protection: true,
                  modeBlock: true,
                  override: true,
                },
              },
            }
          ),
        },
        priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_ALL,
      }
    );

    const webDeploySources = [
      aws_s3_deployment.Source.data(
        "/error.html",
        "<html><body><h1>Error!!!!!!!!!!!!!</h1></body></html>"
      ),
    ];

    const webDeployAssetPath = resolve(__dirname, "../../web/dist");
    if (existsSync(webDeployAssetPath)) {
      webDeploySources.push(aws_s3_deployment.Source.asset(webDeployAssetPath));
    }

    new aws_s3_deployment.BucketDeployment(this, "WebDeploy", {
      sources: webDeploySources,
      destinationBucket: webBucket,
      distribution: webDistribution,
      distributionPaths: ["/*"],
    });
  }
}
