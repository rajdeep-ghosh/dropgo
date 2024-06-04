'use client';

import { useState } from 'react';
import { File, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { UploadAPIRespData } from '@/types';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    setSelectedFile(e.target.files[0]);
  }

  async function handleFileUpload() {
    if (!selectedFile) return;

    try {
      setIsLoading(true);

      const uploadResp = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        })
      });
      const data = (await uploadResp.json()) as UploadAPIRespData;
      if (!uploadResp.ok) throw new Error(data.error);

      const s3Resp = await fetch(data.success.url, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type
        },
        body: selectedFile
      });
      if (!s3Resp.ok) throw new Error('upload failed');

      toast({
        title: 'Success 🥳',
        description: 'File uploaded successfully'
      });
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

  return (
    <main className='py-20'>
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
                    Drag and drop files here or click to select
                  </p>
                  <span className='text-sm text-gray-400'>
                    For multiple file uploads zip them
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
            {selectedFile && (
              <Button
                onClick={() => setSelectedFile(null)}
                className='w-full sm:w-auto'
              >
                Clear
              </Button>
            )}
            <Button
              variant='secondary'
              disabled={selectedFile && !isLoading ? false : true}
              onClick={handleFileUpload}
              className='w-full sm:w-auto'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </>
              ) : (
                <>Upload File</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
