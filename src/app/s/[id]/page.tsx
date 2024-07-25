'use client';

import { useEffect, useState } from 'react';
import { extension as mimeExtention } from 'mime-types';
import Link from 'next/link';
import { AlertCircle, Download } from 'lucide-react';

import { formatBytes, getTimeDifference } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import type { FileData } from '@/types';

type DetailsPageProps = {
  params: {
    id: string;
  };
};

export default function DetailsPage({ params }: DetailsPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] =
    useState<Extract<FileData, { status: 'success' }>['data']>();
  const [error, setError] = useState<
    Extract<FileData, { status: 'error' }>['message']
  >('Something went wrong');

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/drop?id=${params.id}`);
        const body = (await res.json()) as FileData;

        switch (body.status) {
          case 'error':
            throw new Error(body.message);

          case 'success':
            setData(body.data);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchData();
  }, [params.id]);

  return (
    <div className='mx-auto grid max-w-lg gap-8 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-center font-poppins text-2xl font-bold tracking-tight text-white sm:text-3xl'>
        File shared with you
      </h1>
      {isLoading ? (
        <Skeleton className='h-72 rounded-xl bg-slate-400' />
      ) : data ? (
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
                <span className='font-medium'>Expires In:</span>
                <time dateTime={data.expiresAt.toString()}>
                  {getTimeDifference(data.expiresAt)}{' '}
                  <span className='hidden sm:inline'>
                    (
                    {new Date(data.expiresAt).toLocaleString(
                      navigator.language
                    )}
                    )
                  </span>
                </time>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className='w-full' asChild>
              <Link href={data.url} target='_blank' download={data.key}>
                <Download className='mr-2 size-4' />
                Download File
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Alert variant='destructive'>
          <AlertCircle className='size-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <p className='text-center text-sm text-gray-400'>
        This is a temporary file sharing service. All files will be deleted
        within 24 hours.
      </p>
    </div>
  );
}
