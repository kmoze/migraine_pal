import { useState } from 'react';
import { Button } from './ui/button';
import MultiStepForm from './MultiStepForm';

function Navbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <div className="w-1/6 h-full flex flex-col justify-between bg-gray-800 text-white p-4">
        <div>
          <h2 className="text-2xl text-left ml-1 mt-4">MigrainePal</h2>
          <Button className="mt-10 w-3/4 bg-foreground text-base">
            Dashboard
          </Button>
          <Button className="mt-6 w-3/4 bg-foreground text-base">
            Analytics
          </Button>
        </div>
        <Button
          onClick={openDialog}
          className="mt-6 w-3/4 text-base mb-4 bg-[hsl(var(--button-primary))] hover:bg-[hsl(var(--button-primary-hover))]"
        >
          Log Migraine
        </Button>
      </div>
      <MultiStepForm isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}

export default Navbar;
