import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";


export async function setDatabaseUrlEnvVar(dev: boolean) {
  // Set database connection url env var for Prisma
  const secret_name = dev ? "wol-app-db-dev-secret" : "wol-app-db-prod-secret";

  const client = new SecretsManagerClient({
    region: "us-west-2",
  });

  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );

    const secret = response.SecretString;
    let databaseUrl;

    if (secret) {
      const secretJson = JSON.parse(secret);
      databaseUrl = `postgresql://${secretJson.username}:${secretJson.password}@${secretJson.host}:${secretJson.port}/${secretJson.dbname}`;
    }
    
    process.env["DATABASE_URL"] = databaseUrl;
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    console.error("Unable to fetch database connection url secret: ", error);
    throw new Error();
  }
}