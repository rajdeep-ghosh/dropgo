import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

async function putObject(
  key: string,
  contentType: string,
  contentLength: number
) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength
  });

  return await getSignedUrl(s3, command, { expiresIn: 90 });
}

async function getObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  });

  return getSignedUrl(s3, command, { expiresIn: 900 });
}

const ratelimit = {
  upload: new Ratelimit({
    redis: kv,
    prefix: 'dropgo-ratelimit:upload',
    limiter: Ratelimit.slidingWindow(12, '1h') // 12 requests per hour
  }),
  download: new Ratelimit({
    redis: kv,
    prefix: 'dropgo-ratelimit:download',
    limiter: Ratelimit.slidingWindow(20, '1m') // 20 requests per minute
  })
};

export { putObject, getObject, ratelimit };
