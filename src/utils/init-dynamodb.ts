import AWS from 'aws-sdk';

import { MEDIA_BUCKET_REGION } from '../utils/env-loader';

AWS.CredentialProviderChain.defaultProviders = [() => new AWS.EC2MetadataCredentials()];
const credentialProvider = new AWS.CredentialProviderChain();

export interface DynamoDbObj {
  db: AWS.DynamoDB;
  client: AWS.DynamoDB.DocumentClient
};

export const initDynamoDb = (): DynamoDbObj => {
  const db = new AWS.DynamoDB({
    signatureVersion: 'v4',
    region: MEDIA_BUCKET_REGION,
    credentialProvider,
  });

  const client = new AWS.DynamoDB.DocumentClient({
    signatureVersion: 'v4',
    region: MEDIA_BUCKET_REGION,
    credentialProvider,
  });

  return { db, client };
};
