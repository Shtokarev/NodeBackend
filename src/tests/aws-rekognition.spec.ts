import { getAwsModerationLabels } from '../modules/aws/aws-rekognition';

import { MEDIA_BUCKET } from '../utils/env-loader';

let mockdetectModerationLabels = jest.fn((param, cb) => cb(null, { ModerationLabels: [] }));
const mockCopyObject = jest.fn((params, cb) => cb(null));

jest.mock('aws-sdk', () => {
  function Rekognition() {
    this.detectModerationLabels = mockdetectModerationLabels;
  }
  function S3() {
    this.copyObject = mockCopyObject;
  }
  function CredentialProviderChain() {/*---*/ }

  return { Rekognition, S3, CredentialProviderChain };
});

describe('AWS.Rekognition tests', () => {
  const img = 'https://s3.amazonaws.com/test.unique.bucket/userdata/d1/a0c54b6e-028c-4d1a-b25b-72eb11114fbc.jpg';
  const Name = 'userdata/d1/a0c54b6e-028c-4d1a-b25b-72eb11114fbc.jpg';

  it('should invoke detectModerationLabels with arguments and return undefined if not received labels', async (done) => {

    const expectedRekognitionArguments = {
      Image: {
        S3Object: {
          Bucket: MEDIA_BUCKET,
          Name,
        },
      },
      MinConfidence: 40,
    };

    const result = await getAwsModerationLabels(img);

    expect(typeof result).toBe('undefined');
    expect(mockdetectModerationLabels.mock.calls[0][0]).toEqual(expectedRekognitionArguments);
    done();
  });

  it('should return formatted string if received labels are allowable', async (done) => {
    mockdetectModerationLabels = jest.fn((param, cb) => cb(null, {
      ModerationLabels: [
        { Name: 'Revealing Clothes', ParentName: 'Suggestive', Confidence: 22.5 },
        { Name: 'Male Swimwear Or Underwear', ParentName: 'Suggestive', Confidence: 22.5 },
        { Name: 'Female Swimwear Or Underwear', ParentName: 'Suggestive', Confidence: 22.5 },
        { Name: 'Suggestive' },
      ],
    }));

    const result = await getAwsModerationLabels(img);
    expect(result).toBe('Revealing Clothes - 22.5%, Male Swimwear Or Underwear - 22.5%, Female Swimwear Or Underwear - 22.5%');
    done();
  });
});
