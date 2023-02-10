# API

Backend stack for WorkOutLoud.

---

## Docker

### Running the Docker image locally
Download Docker and make sure it's running.
- `docker build . -t wol-api`
- `docker run -p 3000:3000 -d wol-api`
- Open `localhost:3000`

Stopping the container.
- List running containers `docker ps` 
- `docker stop [container id]`

### Testing before committing
- Make sure the docker image builds locally  `docker build . -t api`

### Manually pushing the docker image to ECR (Not recommended)
Pre-req: CDK stack already deployed (most likely yes).
- (Optional) Get the repositoryURI of the wol-api repo `aws ecr describe-repositories`
- Build docker image `docker build . -t api`
- Authenticate docker with AWS ECR authorization token. `aws ecr get-login-password | docker login --username AWS --password-stdin 205472260469.dkr.ecr.us-west-2.amazonaws.com`
- Tag the built docker image `docker tag api 205472260469.dkr.ecr.us-west-2.amazonaws.com/wol-api:latest` 
  - The last value is the repositoryURI from step 1.
- `docker push 205472260469.dkr.ecr.us-west-2.amazonaws.com/wol-api:latest`

### Manually updating ECS to get new ECR image (Not recommended)
<!-- - `aws ecs update-service --force-new-deployment --cluster app-cluster --service sample-express-app -->
---

## CDK

### Deploying CDK stack
Pre-req: Downloaded AWS and CDK cli. Ran `cdk bootstrap`. Cd into `cdk` folder.

- Double check the CFN change set `cdk synth`
- `cdk deploy`