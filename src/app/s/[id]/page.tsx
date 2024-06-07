import { notFound } from 'next/navigation';
import { extension as mimeExtention } from 'mime-types';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { DropAPIRespData } from '@/types';

export const dynamic = 'force-dynamic';

type DetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function DetailsPage({ params }: DetailsPageProps) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/drop`, {
    method: 'POST',
    body: JSON.stringify({
      id: params.id
    })
  });
  if (!resp.ok) return notFound();

  const { success: data } = (await resp.json()) as DropAPIRespData;

  return (
    <div className='mx-auto grid max-w-lg gap-8 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-center font-poppins text-2xl font-bold tracking-tight text-white sm:text-3xl'>
        File shared with you
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>File Details</CardTitle>
          <CardDescription>
            View information about the shared file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='flex justify-between space-x-1 truncate'>
              <span className='font-medium'>Name:</span>
              <span>{data.name}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Type:</span>
              <span className='uppercase'>{mimeExtention(data.type)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Size:</span>
              <span>{formatBytes(data.size)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Expires:</span>
              <span>{new Date(data.expires).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className='w-full' asChild>
            <Link href={data.url} target='_blank' download>
              <Download className='mr-2 size-4' />
              Download File
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <p className='text-center text-sm text-gray-400'>
        This is a temporary file sharing service. All files will be deleted
        within 24 hours.
      </p>
    </div>
  );
}
