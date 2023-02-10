"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkApiStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cdk_lib_2 = require("aws-cdk-lib");
const aws_cdk_lib_3 = require("aws-cdk-lib");
const aws_cdk_lib_4 = require("aws-cdk-lib");
const aws_cdk_lib_5 = require("aws-cdk-lib");
const aws_cdk_lib_6 = require("aws-cdk-lib");
class CdkApiStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Configuration parameters
        const imageRepo = aws_cdk_lib_4.aws_ecr.Repository.fromRepositoryName(this, "wol-backend-image", "workoutloud");
        const tag = process.env.IMAGE_TAG ? process.env.IMAGE_TAG : "latest";
        const image = aws_cdk_lib_2.aws_ecs.ContainerImage.fromEcrRepository(imageRepo, tag);
        const vpc = new aws_cdk_lib_3.aws_ec2.Vpc(this, "MyVpc", {
            maxAzs: 3,
        });
        const taskIamRole = new aws_cdk_lib_5.aws_iam.Role(this, "AppRole", {
            roleName: "AppRole",
            assumedBy: new aws_cdk_lib_5.aws_iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
        });
        const taskDefinition = new aws_cdk_lib_2.aws_ecs.FargateTaskDefinition(this, "Task", {
            taskRole: taskIamRole,
        });
        taskDefinition.addContainer("MyContainer", {
            image,
            portMappings: [{ containerPort: 3000 }],
            memoryReservationMiB: 256,
            cpu: 256,
        });
        // Fargate service + load balancer
        new aws_cdk_lib_6.aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
            vpc: vpc,
            taskDefinition: taskDefinition,
            desiredCount: 1,
            serviceName: "Backend",
            assignPublicIp: true,
            publicLoadBalancer: true,
        });
    }
}
exports.CdkApiStack = CdkApiStack;
