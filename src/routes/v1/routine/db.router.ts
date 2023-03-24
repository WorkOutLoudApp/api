import { Router } from 'express';

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "wol-app-db-dev-secret";

const client = new SecretsManagerClient({
  region: "us-west-2",
});

let response;

// Your code goes here

const router = Router({ mergeParams: true })

router.get('/secret', async (req, res) => {
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
    const secret = response.SecretString;

    res.send(secret);
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    res.send(error);
  }
});

export default router