import { useState } from 'react';
import { Button } from './ui/button';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import MultiStepForm from './MultiStepForm';

function Navbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);

  return (
    <>
      <div className="w-1/6 h-full flex flex-col justify-between bg-gray-800 text-white p-4">
        <div className="flex-grow">
          <h2 className="text-2xl text-left ml-1 mt-4">MigrainePal</h2>
          <Button className="mt-10 w-3/4 bg-foreground text-base">
            Dashboard
          </Button>
          <Button className="mt-6 w-3/4 bg-foreground text-base">
            Analytics
          </Button>
        </div>
        <div>
          <Button
            onClick={openDialog}
            className="mt-6 w-3/4 text-lg mb-10 py-5 rounded-md bg-[hsl(var(--button-primary))] hover:bg-[hsl(var(--button-primary-hover))]"
          >
            Log Migraine
          </Button>
          <Button className="mt-6 w-1/2 py-0 text-base mb-2 bg-foreground rounded-sm">
            <Cog6ToothIcon className="h-5 w-5 mr-3" />
            Settings
          </Button>
        </div>
      </div>
      <MultiStepForm isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}

export default Navbar;
