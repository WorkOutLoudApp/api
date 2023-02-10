import { App, Stack, StackProps } from "aws-cdk-lib";
import { aws_ecs as ecs } from "aws-cdk-lib";
import { aws_ec2 as ec2 } from "aws-cdk-lib";
import { aws_ecr as ecr } from "aws-cdk-lib";
import { aws_iam as iam } from "aws-cdk-lib";
import { aws_route53 as r53 } from "aws-cdk-lib";
import { aws_ecs_patterns as ecs_patterns } from "aws-cdk-lib";

export class CdkApiStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // ECR repository
    const repository = new ecr.Repository(this, 'wol-api', {
      repositoryName: 'wol-api',
    })

    // Configuration parameters
    const imageRepo = ecr.Repository.fromRepositoryName(
      this,
      "wol-backend-image",
      "wol-api"
    );
    const tag = process.env.IMAGE_TAG ? process.env.IMAGE_TAG : "latest";
    const image = ecs.ContainerImage.fromEcrRepository(imageRepo, tag);

    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3, 
    });

    const taskIamRole = new iam.Role(this, "AppRole", {
      roleName: "AppRole",
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, "Task", {
      taskRole: taskIamRole,
    });

    taskDefinition.addContainer("MyContainer", {
      image,
      portMappings: [{ containerPort: 3000 }],
      memoryReservationMiB: 256,
      cpu: 256,
    });

    // Fargate service + load balancer
    new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "MyFargateService",
      {
        vpc: vpc,
        taskDefinition: taskDefinition,
        desiredCount: 1,
        serviceName: "wol-backend",
        assignPublicIp: true,
        publicLoadBalancer: true,
      }
    );
  }
}
