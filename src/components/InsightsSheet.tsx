import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { ChartNoAxesGantt } from 'lucide-react';
import { monthNames } from '@/data/monthOptions';

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
  duration: number;
}

interface InsightsSheetProps {
  sorted: Migraine[];
}

function InsightsSheet({ sorted }: InsightsSheetProps) {
  const currentDate = new Date();

  // Calculate current and previous month/year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Previous month and year calculation
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  function calculateAveragePain(data: Migraine[], month: number, year: number) {
    const filteredData = data.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    if (filteredData.length === 0) return 0;

    const totalPain = filteredData.reduce((acc, item) => acc + item.pain, 0);
    return totalPain / filteredData.length;
  }

  const currentMonthAvgPain = calculateAveragePain(
    sorted,
    currentMonth,
    currentYear
  );
  const prevMonthAvgPain = calculateAveragePain(
    sorted,
    previousMonth,
    previousMonthYear
  );

  function calculateAverageDuration(
    data: Migraine[],
    month: number,
    year: number
  ) {
    const filteredData = data.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    if (filteredData.length === 0) return 0;

    const totalDuration = filteredData.reduce(
      (acc, item) => acc + item.duration,
      0
    );
    return totalDuration / filteredData.length;
  }

  const currMonthAverageDuration = calculateAverageDuration(
    sorted,
    currentMonth,
    currentYear
  );
  const prevMonthAverageDuration = calculateAverageDuration(
    sorted,
    previousMonth,
    previousMonthYear
  );

  function getMonthlyMigraineCount(
    data: Migraine[],
    month: number,
    year: number
  ) {
    return data.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === month && date.getFullYear() === year;
    }).length;
  }

  const currMonthMigraineCount = getMonthlyMigraineCount(
    sorted,
    currentMonth,
    currentYear
  );
  const prevMonthMigraineCount = getMonthlyMigraineCount(
    sorted,
    previousMonth,
    previousMonthYear
  );

  return (
    <Sheet>
      <SheetTrigger>
        <Button className="bg-card-coolorsSecondary hover:bg-card-coolorsAccent text-white px-2 py-1">
          Monthly Insights
          <ChartNoAxesGantt className="h-5 w-5 ml-2" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={'top'}
        className="w-full lg:h-1/2 2xl:h-auto bg-card-coolorsPrimary border-none pt-10"
      >
        <SheetHeader>
          <SheetTitle className="text-xl text-card-darkModeTextPrimary">
            Month to Month Comparison
          </SheetTitle>
          <SheetDescription className="text-white">
            <h2 className="text-sm text-gray-100">
              It's ideal to check this towards the end of the month but here you
              <br />
              can quickly see how {monthNames[currentMonth]} compares to{' '}
              {monthNames[previousMonth]}.
            </h2>
            <div className="flex gap-4">
              <div className="relative flex w-1/3 mt-5 bg-card-darkModePrimary px-0 pt-10 pb-4 rounded-lg">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-sm font-customText">
                    {monthNames[previousMonth]}
                  </p>
                  <div className="p-10 bg-card-coolorsAccent rounded-sm text-center">
                    <p className="text-xl">{Math.floor(prevMonthAvgPain)}</p>
                  </div>
                </div>
                <h2 className="absolute top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md py-2 px-2 rounded-lg">
                  Average Pain Level
                </h2>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-sm font-customText">
                    {monthNames[currentMonth]}
                  </p>
                  <div className="p-10 bg-card-coolorsSecondary rounded-sm text-center">
                    <p className="text-xl">{Math.floor(currentMonthAvgPain)}</p>
                  </div>
                </div>
              </div>
              <div className="relative flex w-1/3 mt-5 bg-card-darkModePrimary px-0 pt-10 pb-4 rounded-lg">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-sm font-customText">
                    {monthNames[previousMonth]}
                  </p>
                  <div className="p-10 bg-card-coolorsAccent rounded-sm text-center">
                    <p className="text-xl">
                      {Math.floor(prevMonthAverageDuration)}h
                    </p>
                  </div>
                </div>
                <h2 className="absolute top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md py-2 px-2 rounded-lg">
                  Average Duration
                </h2>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-sm font-customText">
                    {monthNames[currentMonth]}
                  </p>
                  <div className="p-10 bg-card-coolorsSecondary rounded-sm text-center">
                    <p className="text-xl">
                      {Math.floor(currMonthAverageDuration)}h
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative flex w-1/3 mt-5 bg-card-darkModePrimary px-0 pt-10 pb-4 rounded-lg">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-sm font-customText">
                    {monthNames[previousMonth]}
                  </p>
                  <div className="p-10 bg-card-coolorsAccent rounded-sm text-center">
                    <p className="text-xl">{prevMonthMigraineCount}</p>
                  </div>
                </div>
                <h2 className="absolute top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md py-2 px-2 rounded-lg">
                  Migraines Logged
                </h2>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-sm font-customText">
                    {monthNames[currentMonth]}
                  </p>
                  <div className="p-10 bg-card-coolorsSecondary rounded-sm text-center">
                    <p className="text-xl">{currMonthMigraineCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default InsightsSheet;
