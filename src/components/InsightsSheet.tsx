import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

function InsightsSheet({ sorted }) {
  function calculateAveragePain(data, month, year) {
    const filteredData = data.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    if (filteredData.length === 0) return 0;

    const totalPain = filteredData.reduce((acc, item) => acc + item.pain, 0);
    return totalPain / filteredData.length;
  }

  const augustAverage = calculateAveragePain(sorted, 7, 2024);
  const septemberAverage = calculateAveragePain(sorted, 8, 2024); //

  function calculateAverageDuration(data, month, year) {
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

  const augustAverageDuration = calculateAverageDuration(sorted, 7, 2024);
  const septemberAverageDuration = calculateAverageDuration(sorted, 8, 2024);

  function getMonthlyMigraineCount(data, month, year) {
    return data.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === month && date.getFullYear() === year;
    }).length;
  }

  const augustMigraineCount = getMonthlyMigraineCount(sorted, 7, 2024);
  const septemberMigraineCount = getMonthlyMigraineCount(sorted, 8, 2024);

  return (
    <Sheet>
      <SheetTrigger className="bg-card-coolorsSecondary text-white px-2 py-1 rounded-sm">
        Monthly Insights
      </SheetTrigger>
      <SheetContent
        side={'top'}
        className="w-full h-1/3 bg-card-coolorsPrimary border-none"
      >
        <SheetHeader>
          <SheetTitle className="text-xl text-card-darkModeTextPrimary">
            Month to Month Comparison
          </SheetTitle>
          <SheetDescription className="text-white">
            <h2 className="text-sm">
              As it's reaching the end of September, we've prepared an end of
              month comparison for you.
            </h2>
            <div className="flex gap-4">
              <div className="relative flex w-1/3 mt-5 bg-card-darkModePrimary px-0 py-7 rounded-lg">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">August</p>
                  <div className="p-10 bg-card-coolorsAccent rounded-sm text-center">
                    <p className="text-xl">{Math.floor(augustAverage)}</p>
                  </div>
                </div>
                <h2 className="absolute text-md left-1/2 transform -translate-x-1/2 top-1/2 py-2">
                  Average Pain Level
                </h2>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">September</p>
                  <div className="p-10 bg-card-coolorsSecondary rounded-sm text-center">
                    <p className="text-xl">{Math.floor(septemberAverage)}</p>
                  </div>
                </div>
              </div>
              <div className="relative flex w-1/3 mt-5 bg-card-darkModePrimary px-0 py-7 rounded-lg">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">August</p>
                  <div className="p-10 bg-card-coolorsAccent rounded-sm text-center">
                    <p className="text-xl">
                      {Math.floor(augustAverageDuration)}h
                    </p>
                  </div>
                </div>
                <h2 className="absolute text-md left-1/2 transform -translate-x-1/2 top-1/2 py-2">
                  Average Migraine Duration
                </h2>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">September</p>
                  <div className="p-10 bg-card-coolorsSecondary rounded-sm text-center">
                    <p className="text-xl">
                      {Math.floor(septemberAverageDuration)}h
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative flex w-1/3 mt-5 bg-card-darkModePrimary px-0 py-7 rounded-lg">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">August</p>
                  <div className="p-10 bg-card-coolorsAccent rounded-sm text-center">
                    <p className="text-xl">{augustMigraineCount}</p>
                  </div>
                </div>
                <h2 className="absolute text-md left-1/2 transform -translate-x-1/2 top-1/2 py-2">
                  Migraines Logged
                </h2>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">September</p>
                  <div className="p-10 bg-card-coolorsSecondary rounded-sm text-center">
                    <p className="text-xl">{septemberMigraineCount}</p>
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
