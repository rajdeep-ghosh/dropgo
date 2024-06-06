import { Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DetailsPage() {
  return (
    <div className='mx-auto grid max-w-lg gap-8 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-center font-poppins text-2xl font-bold tracking-tight text-white sm:text-3xl'>
        File shared with you
      </h1>
      <Card className=''>
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
              <span>Document.pdf</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Type:</span>
              <span>PDF</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Size:</span>
              <span>1.2 MB</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Expires in:</span>
              <span>12 hr</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className='w-full'>
            <Download className='mr-2 size-4' />
            Download File
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
