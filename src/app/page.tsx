'use client';

import { useState } from 'react';
import { Check, Copy, File, Loader2, Share, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import type { FileMeta } from '@/types';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] =
    useState<Extract<FileMeta, { status: 'success' }>['data']>();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const { toast } = useToast();

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    setSelectedFile(e.target.files[0]);
  }

  async function handleFileUpload() {
    if (!selectedFile) return;

    try {
      setIsLoading(true);

      const createFileMetaRes = await fetch('/api/drop', {
        method: 'POST',
        body: JSON.stringify({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        })
      });

      const body = (await createFileMetaRes.json()) as FileMeta;

      switch (body.status) {
        case 'error':
          throw new Error(body.message);

        case 'success': {
          const fileUploadToS3Res = await fetch(body.data.url, {
            method: 'PUT',
            headers: {
              'Content-Type': selectedFile.type
            },
            body: selectedFile
          });

          if (!fileUploadToS3Res.ok) throw new Error('Upload failed');

          setFileData(body.data);
          toast({
            title: 'Success 🥳',
            description: 'File uploaded successfully'
          });
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: err.message
        });
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopyToClipboard() {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/s/${fileData?.id}`
    );
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  }

  function handleAppStateReset() {
    setSelectedFile(null);
    setFileData(undefined);
  }

  return (
    <div className='mx-auto grid max-w-3xl gap-8 px-4 sm:px-6 lg:px-8'>
      <div className='space-y-4 text-center'>
        <h1 className='font-poppins text-4xl font-bold tracking-tight text-white sm:text-5xl'>
          Simple, Secure File Storage
        </h1>
        <p className='text-lg text-gray-300'>
          DropGo makes it easy to store files temporarily and share them. Your
          uploaded files will be automatically deleted after 24 hours.
        </p>
      </div>
      <div className='rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-lg'>
        <div className='relative flex h-48 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-500 bg-gray-700 text-white'>
          {!selectedFile ? (
            <>
              <div className='space-y-2 text-center'>
                <Upload className='mx-auto size-10 text-gray-400' />
                <p className='text-white'>
                  Drag and drop files here, or click to select
                </p>
                <span className='text-sm text-gray-400'>
                  For multiple files zip them (max size 200 MB)
                </span>
              </div>
              <input
                type='file'
                onChange={handleFileInputChange}
                className='absolute size-full cursor-pointer opacity-0'
              />
            </>
          ) : (
            <div className='flex gap-x-2'>
              <File className='size-6' />
              <span>{selectedFile.name}</span>
            </div>
          )}
        </div>
        <div className='mt-4 flex justify-end gap-4'>
          {selectedFile && fileData ? (
            <Button onClick={handleAppStateReset} className='w-full sm:w-auto'>
              Reset
            </Button>
          ) : selectedFile && !fileData ? (
            <Button
              onClick={() => setSelectedFile(null)}
              className='w-full sm:w-auto'
            >
              Clear
            </Button>
          ) : null}
          {fileData ? (
            <Button
              variant='secondary'
              onClick={() => setShareDialogOpen(true)}
              className='w-full sm:w-auto'
            >
              <Share className='mr-2 size-4' />
              Share
            </Button>
          ) : (
            <Button
              variant='secondary'
              disabled={selectedFile && !isLoading ? false : true}
              onClick={handleFileUpload}
              className='w-full sm:w-auto'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' />
                  Please wait
                </>
              ) : (
                <>
                  <Upload className='mr-2 size-4' />
                  Upload File
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      <AlertDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share this file</AlertDialogTitle>
            <AlertDialogDescription>
              Copy the link below and share it with your friends and colleagues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex items-center space-x-2'>
            <Input
              type='text'
              value={`${process.env.NEXT_PUBLIC_URL}/s/${fileData?.id}`}
              readOnly
              className='flex-1'
            />
            <Button
              variant='secondary'
              size='icon'
              onClick={handleCopyToClipboard}
              className='shrink-0'
            >
              {copiedToClipboard ? (
                <Check className='size-5' />
              ) : (
                <Copy className='size-5' />
              )}
              <span className='sr-only'>Copy link</span>
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
