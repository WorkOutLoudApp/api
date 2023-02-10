import {
  App,
  CfnOutput,
  CfnParameter,
  SecretValue,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { aws_codebuild as codebuild } from "aws-cdk-lib";
import { aws_codepipeline as codepipeline } from "aws-cdk-lib";
import { aws_codepipeline_actions as codepipeline_actions } from "aws-cdk-lib";
import { aws_ecs as ecs } from "aws-cdk-lib";
import { aws_ec2 as ec2 } from "aws-cdk-lib";
import { aws_ecr as ecr } from "aws-cdk-lib";
import { aws_iam as iam } from "aws-cdk-lib";
import { aws_ecs_patterns as ecs_patterns } from "aws-cdk-lib";

export class ApiCdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    /// Github Repository Information ///

    const githubUserName = new CfnParameter(this, "githubUserName", {
      type: "String",
      description: "Github username for source code repository",
      default: "WorkOutLoudApp",
    });

    const githubRepository = new CfnParameter(this, "githubRepository", {
      type: "String",
      description: "Github source code repository",
      default: "api",
    });

    const githubPersonalTokenSecretName = new CfnParameter(
      this,
      "githubPersonalTokenSecretName",
      {
        type: "String",
        description:
          "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
        default: "/wol-api/dev/GITHUB_TOKEN",
      }
    );

    /// ECR and ECS Setup ///

    const ecrRepo = new ecr.Repository(this, "wol-api");

    const vpc = new ec2.Vpc(this, "wol-api-ecs-cdk-vpc", {
      maxAzs: 3,
    });

    const cluster = new ecs.Cluster(this, "ecs-cluster", {
      vpc: vpc,
    });

    const logging = new ecs.AwsLogDriver({
      streamPrefix: "ecs-logs",
    });

    const taskRole = new iam.Role(this, `ecs-taskrole-${this.stackName}`, {
      roleName: `ecs-taskrole-${this.stackName}`,
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    // Allows code build to deploy to ECR
    const executionRolePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ["*"],
      actions: [
        "ecr:getauthorizationtoken",
        "ecr:batchchecklayeravailability",
        "ecr:getdownloadurlforlayer",
        "ecr:batchgetimage",
        "logs:createlogstream",
        "logs:putlogevents",
      ],
    });

    // Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, "WolApiTask", {
      taskRole: taskRole,
    });

    taskDefinition.addToExecutionRolePolicy(executionRolePolicy);

    const baseImage = "amazon/amazon-ecs-sample";
    const taskContainerName = "WolApiContainer";

    taskDefinition.addContainer(taskContainerName, {
      image: ecs.ContainerImage.fromRegistry(baseImage),
      portMappings: [{ containerPort: 3000 }],
      memoryLimitMiB: 256,
      cpu: 256,
      logging,
    });

    // Fargate service + load balancer
    const fargateService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "WolApiFargateService",
        {
          cluster,
          taskDefinition,
          desiredCount: 1,
          serviceName: "wol-api-service",
          assignPublicIp: true,
          publicLoadBalancer: true,
        }
      );

    const gitHubSource = codebuild.Source.gitHub({
      owner: githubUserName.valueAsString,
      repo: githubRepository.valueAsString,
      webhook: true, // optional, default: true if `webhookfilters` were provided, false otherwise
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs(
          "main"
        ),
      ], // optional, by default all pushes and pull requests will trigger a build
    });

    /// Codebuild Project ///

    const project = new codebuild.Project(this, "myProject", {
      projectName: `${this.stackName}`,
      source: gitHubSource,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2,
        privileged: true,
      },
      environmentVariables: {
        AWS_DEFAULT_REGION: {
          value: `us-west-2`,
        },
        AWS_ACCOUNT_ID: {
          value: `205472260469`,
        },
        IMAGE_TAG: {
          value: `latest`,
        },
        ECR_REPO_URI: {
          value: `${ecrRepo.repositoryUri}`,
        },
      },
      badge: true,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          pre_build: {
            commands: [
              "echo Logging in to Amazon ECR...",
              "aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com",
            ],
          },
          build: {
            commands: [
              "echo Build started on `date`",
              `echo Building the Docker image...`,
              "docker build -t $ECR_REPO_URI:$IMAGE_TAG .",
            ],
          },
          post_build: {
            commands: [
              "echo Build completed on `date`",
              "docker push $ECR_REPO_URI:$IMAGE_TAG",
              `printf '[{\"name\":\"${taskContainerName}\",\"imageUri\":\"%s\"}]' $ECR_REPO_URI:$IMAGE_TAG > imagedefinitions.json`,
              "cat imagedefinitions.json",
            ],
          },
        },
        artifacts: {
          files: ["imagedefinitions.json"],
        },
      }),
    });

    /// Pipeline Actions ///

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    const nameOfGithubPersonTokenParameterAsString =
      githubPersonalTokenSecretName.valueAsString;

    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: "github_source",
      owner: githubUserName.valueAsString,
      repo: githubRepository.valueAsString,
      branch: "main",
      oauthToken: SecretValue.secretsManager(
        nameOfGithubPersonTokenParameterAsString
      ),
      output: sourceOutput,
    });

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: "codebuild",
      project,
      input: sourceOutput,
      outputs: [buildOutput], // optional
    });

    const manualApprovalAction = new codepipeline_actions.ManualApprovalAction({
      actionName: "approve",
    });

    const deployAction = new codepipeline_actions.EcsDeployAction({
      actionName: "deployAction",
      service: fargateService.service,
      imageFile: new codepipeline.ArtifactPath(
        buildOutput,
        `imagedefinitions.json`
      ),
    });

    /// Pipeline Stages ///

    // NOTE - Approve action is commented out!
    new codepipeline.Pipeline(this, "myecspipeline", {
      stages: [
        {
          stageName: "source",
          actions: [sourceAction],
        },
        {
          stageName: "build",
          actions: [buildAction],
        },
        // {
        //   stageName: 'approve',
        //   actions: [manualApprovalAction],
        // },
        {
          stageName: "deploy-to-ecs",
          actions: [deployAction],
        },
      ],
    });

    ecrRepo.grantPullPush(project.role!);
    project.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "ecs:describecluster",
          "ecr:getauthorizationtoken",
          "ecr:batchchecklayeravailability",
          "ecr:batchgetimage",
          "ecr:getdownloadurlforlayer",
        ],
        resources: [`${cluster.clusterArn}`],
      })
    );

    new CfnOutput(this, "image", { value: ecrRepo.repositoryUri + ":latest" });
    new CfnOutput(this, "loadbalancerdns", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}
