import AWS from 'aws-sdk';
import request from 'request';
import stream from 'stream';
import uuidv4 from 'uuid/v4';

import logger from '../../utils/logger';
import { MEDIA_BUCKET, MEDIA_BUCKET_REGION } from '../../utils/env-loader';

interface MimeType {
  type: string;
  extension: string;
}

export interface UploadResult {
  success: boolean;
  error?: Error;
  uri?: string;
}

const ENABLED_MIME_TYPES: MimeType[] = [
  { type: 'image/jpeg', extension: '.jpg' },
  { type: 'image/png', extension: '.png' },
  { type: 'video/mp4', extension: '.mp4' },
];

AWS.CredentialProviderChain.defaultProviders = [() => new AWS.EC2MetadataCredentials()];
const credentialProvider = new AWS.CredentialProviderChain();

export const uploadImage2S3Bucket = async (url: string): Promise<UploadResult> => {
  const result = {
    success: false,
    error: {},
  } as UploadResult;

  try {
    logger.log(`Upload to S3 Bucket. url = ${url}`);

    const fileExtension = url.match(/\.[^.]+$/);
    if (!fileExtension) {
      logger.log('No file extension found');
      result.error.message = 'No file extension found';
      return result;
    }

    const type = ENABLED_MIME_TYPES.find((item) => item.extension === fileExtension[0]);

    if (!type) {
      logger.log('Non supported file extension');
      result.error.message = 'Non supported file extension';
      return result;
    }

    const objectId = uuidv4();
    const fileName = `userdata/${generatePathPrefix()}/${objectId}${fileExtension}`;
    const s3 = new AWS.S3({
      signatureVersion: 'v4',
      region: MEDIA_BUCKET_REGION,
      credentialProvider,
    });

    const streamPassThUpload = new stream.PassThrough();

    const params = {
      Bucket: MEDIA_BUCKET,
      Key: fileName,
      ContentType: type.type,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000, public',
      Body: streamPassThUpload
    };

    const tsBegin = new Date().getTime();

    const manager = s3.upload(params);

    request
      .get({ url, encoding: null })
      .on('response', (response) => {
        const { statusCode, statusMessage } = response;

        if (statusCode !== 200) {
          streamPassThUpload.emit(
            'error',
            new Error(`Error loading file: statusCode: ${statusCode}, statusMessage: ${statusMessage}`)
          );
        }
      })
      .on('error', function (error) {
        streamPassThUpload.emit('error', error);
      })
      .pipe(streamPassThUpload);

    // for progress bar implementation
    manager.on('httpUploadProgress', (progress: AWS.S3.ManagedUpload.Progress) => {
      logger.log(`progress - part ${progress.loaded} of ${progress.total}`);
    });

    const { Location } = await manager.promise();
    logger.log('AWS S3 Upload performed in:', (new Date().getTime() - tsBegin));

    return ({ success: true, uri: Location });

  } catch (error) {
    logger.log(error);
    result.error = error;
    return result;
  }
};

const generatePathPrefix = (): string => {
  const dictionary = 'abcdefghijklmnopqrstuvwxyz0123456789';

  return dictionary[Math.floor(Math.random() * dictionary.length)]
    + dictionary[Math.floor(Math.random() * dictionary.length)];
};
