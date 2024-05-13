import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className='py-20'>
      <div className='mx-auto grid max-w-3xl gap-8 px-4 sm:px-6 lg:px-8'>
        <div className='space-y-4 text-center'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            Simple, Secure File Storage
          </h1>
          <p className='text-lg text-gray-300'>
            DropGo makes it easy to store files temporarily. Your uploaded files
            will be automatically deleted after 24 hours.
          </p>
        </div>
        <div className='rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-lg'>
          <div className='flex h-48 items-center justify-center rounded-md border-2 border-dashed border-gray-500 bg-gray-700 text-gray-400'>
            <div className='space-y-2 text-center'>
              <Upload className='mx-auto size-10' />
              <p>Drag and drop files or click to select</p>
            </div>
          </div>
          <div className='mt-4 flex justify-end'>
            <Button variant='secondary' className='w-full sm:w-auto'>
              Upload Files
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
