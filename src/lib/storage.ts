import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const kv = new Redis({
  url: process.env.KV_URL,
  token: process.env.KV_TOKEN
});

async function putObject(
  key: string,
  contentType: string,
  contentLength: number,
  fileId: string
) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength,
    Metadata: {
      fileId
    }
  });

  return await getSignedUrl(s3, command, { expiresIn: 90 });
}

async function getObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  });

  return await getSignedUrl(s3, command, { expiresIn: 900 });
}

const ratelimit = {
  upload: new Ratelimit({
    redis: kv,
    prefix: 'dropgo-ratelimit:upload',
    analytics: true,
    limiter: Ratelimit.slidingWindow(12, '1d') // 12 requests per day
  }),
  download: new Ratelimit({
    redis: kv,
    prefix: 'dropgo-ratelimit:download',
    analytics: true,
    limiter: Ratelimit.slidingWindow(30, '1m') // 30 requests per minute
  })
};

export { putObject, getObject, ratelimit };
