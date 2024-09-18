import { useState } from 'react';
import { Button } from './ui/button';
import { Cog6ToothIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import {
  ArrowLeftStartOnRectangleIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline';

import MultiStepForm from './MultiStepForm';

function Navbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);

  return (
    <>
      <div className="w-1/6 h-full flex flex-col justify-between bg-gray-800 text-white p-4">
        <div className="flex-grow">
          <h2 className="text-4xl text-left ml-1 mt-4">MigrainePal</h2>
          <Button className="mt-10 w-8/12 bg-foreground text-base flex items-center justify-start gap-2 pl-4">
            <Squares2X2Icon className="h-5 w-5" />
            <div className="flex-1 text-center">Dashboard</div>
          </Button>
          <Button className="mt-6 w-8/12 bg-foreground text-base flex items-center justify-start gap-2 pl-4">
            <ChartBarSquareIcon className="h-5 w-5" />
            <div className="flex-1 text-center">Analytics</div>
          </Button>
        </div>
        <div>
          <Button
            onClick={openDialog}
            className="mt-6 w-full text-lg mb-10 py-6 rounded-md bg-[hsl(var(--button-primary))] hover:bg-[hsl(var(--button-primary-hover))]"
          >
            Log Migraine
          </Button>
          <Button className="mt-10 mb-5 w-full text-base bg-foreground rounded-sm flex items-center justify-start gap-2 pl-4">
            <Cog6ToothIcon className="h-5 w-5" />
            <div className="flex-1 text-center">Settings</div>
          </Button>
          <Button className="mt-6 py-0 text-base mb-10 w-full bg-foreground rounded-sm flex items-center justify-start gap-2 pl-4">
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
            <div className="flex-1 text-center">Log out</div>
          </Button>
        </div>
      </div>
      <MultiStepForm isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}

export default Navbar;
