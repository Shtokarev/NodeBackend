import AWS from 'aws-sdk';

import logger from '../../utils/logger';
import { MEDIA_BUCKET, MEDIA_BUCKET_REGION } from '../../utils/env-loader';

AWS.CredentialProviderChain.defaultProviders = [() => new AWS.EC2MetadataCredentials()];
const credentialProvider = new AWS.CredentialProviderChain();

export const getAwsModerationLabels = async (url: string): Promise<string> => {
  try {
    const region = MEDIA_BUCKET_REGION;

    const rekognition = new AWS.Rekognition({
      apiVersion: '2016-06-27',
      region,
      credentialProvider,
    });

    const found = url.match(/userdata\/..\/.+$/i);
    if (!found) {
      throw new Error(`Wrong path format, ${url}`);
    }

    const Name = found[0];
    const params = {
      Image: {
        S3Object: {
          Bucket: MEDIA_BUCKET,
          Name,
        },
      },
      MinConfidence: 40,  // default 50%
    };

    const tsBegin = new Date().getTime();

    const result: AWS.Rekognition.Types.DetectModerationLabelsResponse = await new Promise(
      (resolve, reject) => rekognition.detectModerationLabels(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }));

    logger.log('AWS Rekognition performed in:', (new Date().getTime() - tsBegin));

    if (!result.ModerationLabels.length) {
      return;
    }

    const labelsString = result.ModerationLabels
      .filter(item => item.ParentName !== '')
      .map(item => `${item.Name} - ${item.Confidence.toFixed(1)}%`)
      .join(', ');

    return labelsString;
  } catch (error) {
    logger.log(error);
    return error.message;
  }
};
