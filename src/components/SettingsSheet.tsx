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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import profile from '../assets/FDC030EB-E9C5-463E-B234-6F5FA6FB828C_1_105_c.jpeg';

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
        <Button className="bg-card-coolorsSecondary mt-10 mb-3 w-1/2 text-base bg-foreground rounded-sm flex items-center justify-start gap-2 pl-4 ml-4">
          <Cog6ToothIcon className="h-5 w-5" />
          Settings
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
        <div className="p-5 bg-card-coolorsPrimary rounded-sm flex justify-between w-full mt-96">
          <div className="flex flex-col">
            <h2 className="text-xl text-white font-customText">Kier M.</h2>
            <p className="text-lg text-gray-400 font-light">User since 2019</p>
            <p className="text-lg text-gray-400 font-light">kier@gmail.com</p>
          </div>
          <Avatar>
            <AvatarImage
              src={profile}
              alt="profile picture"
              className="w-12 h-16"
            />
            <AvatarFallback>KM</AvatarFallback>
          </Avatar>
        </div>
      </SheetContent>
    </Sheet>
  );
}
