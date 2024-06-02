'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    setSelectedFile(e.target.files[0]);
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
              <span>{selectedFile.name}</span>
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
            <Button variant='secondary' className='w-full sm:w-auto'>
              Upload File
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
