import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
  duration: number;
}

interface SheetDemoProps {
  onDelete: () => void;
  mostRecentMigraine: Migraine | null;
}

export function SheetDemo({ onDelete, mostRecentMigraine }: SheetDemoProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  function durationFormatted(duration: number) {
    if (duration === 15) {
      return '12h+';
    } else if (duration === 24) {
      return 'A full day';
    } else {
      return duration + 'h';
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-card-coolorsSecondary text-base mb-4 w-1/2 md:min-w-fit bg-foreground rounded-sm flex items-center justify-center gap-2 pl-4">
          <Cog6ToothIcon className="h-5 w-5" />
          <div className="flex-1 text-center">Settings</div>
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className="bg-gray-700 border-gray-300">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg text-white">
              Delete most recent migraine
            </SheetTitle>
            <SheetClose asChild>
              <button className="text-white bg-transparent hover:bg-gray-600 rounded-full p-2">
                <XMarkIcon className="h-5 w-5" />{' '}
              </button>
            </SheetClose>
          </div>
          <SheetDescription className="text-white">
            {mostRecentMigraine ? (
              <div className="border p-2 rounded-md dark:border-card-darkModeTextPrimary">
                <p className="text-gray-300">
                  Date:{' '}
                  <span className="text-white">
                    {format(mostRecentMigraine.date, 'MMM do')}
                  </span>
                </p>
                <p className="capitalize text-gray-300">
                  Symptoms:{' '}
                  <span className="text-white">
                    {mostRecentMigraine.symptoms.join(', ')}
                  </span>
                </p>
                <p className="capitalize text-gray-300">
                  Triggers:
                  <span className="text-white">
                    {' '}
                    {mostRecentMigraine.triggers.join(', ')}
                  </span>
                </p>
                <p className="text-gray-300">
                  Pain:{' '}
                  <span className="text-white">{mostRecentMigraine.pain}</span>
                </p>
                <p className="text-gray-300">
                  Duration:{' '}
                  <span className="text-white">
                    {durationFormatted(mostRecentMigraine.duration)}
                  </span>
                </p>
              </div>
            ) : (
              <p>Most recent migraine already deleted.</p>
            )}
            <Button
              onClick={() => {
                onDelete();
                toast({
                  title: 'Migraine successfully deleted',
                });
              }}
              disabled={!mostRecentMigraine}
              className={`w-full mt-4 p-2 rounded-sm dark:text-card-darkModeTextPrimary ${
                !mostRecentMigraine
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Delete Migraine
            </Button>
          </SheetDescription>
        </SheetHeader>
        <div className="flex items-center space-x-2 mt-8">
          <Switch
            id="dark-mode-toggle"
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
            className={`inline-flex items-center cursor-pointer ${
              darkMode ? 'dark:bg-card-coolorsPrimary' : 'bg-card-lightMode'
            }`}
          ></Switch>
          <Label
            htmlFor="dark-mode-toggle"
            className="dark:text-card-lightMode text-card-lightMode mt-1"
          >
            {darkMode ? (
              <>
                Switch to Light Mode{' '}
                <Sun className="inline-block h-5 w-5 mb-1 text-yellow-200 fill-current" />
              </>
            ) : (
              <>
                Switch to Dark Mode{' '}
                <Moon className="inline-block h-5 w-4 mb-1 text-card-dashboard fill-current" />
              </>
            )}
          </Label>
        </div>
      </SheetContent>
    </Sheet>
  );
}
