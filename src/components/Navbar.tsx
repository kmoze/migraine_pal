import { useState } from 'react';
import { Button } from './ui/button';
import {
  Cog6ToothIcon,
  Squares2X2Icon,
  ArrowLeftStartOnRectangleIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline';

import MultiStepForm from './MultiStepForm';
import { Link } from 'react-router-dom';
import { SheetDemo } from './SettingsSheet';

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
  duration: number;
}

interface IntermediaryComponentProps {
  getMigraines: () => Promise<void>;
  deleteMostRecentMigraine: () => void;
  mostRecentMigraine: Migraine | null;
}

function Navbar({
  getMigraines,
  deleteMostRecentMigraine,
  mostRecentMigraine,
}: IntermediaryComponentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);

  return (
    <>
      <div className="w-1/6 h-full flex flex-col justify-between bg-card-coolorsPrimary text-white p-4">
        <h2 className="text-3xl text-center mt-4 font-custom">MigrainePal</h2>
        <div className="flex-grow flex flex-col items-center">
          <Button className="mt-10 w-10/12 bg-foreground text-base flex items-center justify-start gap-2 pl-4">
            <Squares2X2Icon className="h-5 w-5" />
            <div className="flex-1 text-center">
              <Link to="/">Dashboard</Link>
            </div>
          </Button>
          <Button className="mt-6 w-10/12 bg-foreground text-base flex items-center justify-start gap-2 pl-4">
            <ChartBarSquareIcon className="h-5 w-5" />
            <div className="flex-1 text-center">
              <Link to="/analytics">Analytics</Link>
            </div>
          </Button>
        </div>
        <div>
          <Button
            onClick={openDialog}
            className="mt-6 w-full text-lg mb-10 py-6 rounded-md dark:bg-card-lightModeOther dark:text-card-dashboard dark:hover:bg-card-lightModeTertiary bg-[hsl(var(--button-primary))] hover:bg-[hsl(var(--button-primary-hover))]"
          >
            Log Migraine
          </Button>
          <SheetDemo
            onDelete={deleteMostRecentMigraine}
            mostRecentMigraine={mostRecentMigraine}
          />
          <Link to={'/login'}>
            <Button className="text-base mb-10 w-1/2 bg-foreground rounded-sm flex items-center justify-start gap-2 pl-4 ml-4">
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
              <div className="flex-1 text-center">Log out</div>
            </Button>
          </Link>
        </div>
      </div>
      <MultiStepForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        getMigraines={getMigraines}
      />
    </>
  );
}

export default Navbar;
