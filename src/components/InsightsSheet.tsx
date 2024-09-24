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

  const augustAverage = calculateAveragePain(sorted, 7, 2024); // August is month 7 (0-based index)
  const septemberAverage = calculateAveragePain(sorted, 8, 2024); //

  console.log(Math.floor(augustAverage), Math.floor(septemberAverage));

  return (
    <Sheet>
      <SheetTrigger className="bg-card-coolorsSecondary text-white p-3 rounded-sm">
        Monthly Insights
      </SheetTrigger>
      <SheetContent
        side={'top'}
        className="w-full h-1/3 bg-card-coolorsPrimary border-none"
      >
        <SheetHeader>
          <SheetTitle className="text-xl text-card-darkModeTextPrimary">
            Month to Month comparison
          </SheetTitle>
          <SheetDescription className="text-white">
            <h2 className="text-sm">
              As it's reaching the end of September, we've prepared an end of
              the month comparison for you.
            </h2>
            <div className="flex gap-4">
              <div className="relative flex w-1/3 mt-5 bg-card-darkModePrimary px-0 py-7 rounded-lg">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">August</p>
                  <div className="p-10 bg-card-coolorsAccent rounded-sm text-center">
                    <p className="text-xl">{Math.floor(augustAverage)}</p>
                  </div>
                </div>
                <h2 className="absolute text-xl left-1/2 transform -translate-x-1/2 top-1/2 py-2">
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
                    <p className="text-xl">{}</p>
                  </div>
                </div>
                <h2 className="absolute text-lg left-1/2 transform -translate-x-1/2 top-1/2 py-2">
                  Average Migraine Duration
                </h2>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">September</p>
                  <div className="p-10 bg-card-coolorsSecondary rounded-sm text-center">
                    <p className="text-xl">{}</p>
                  </div>
                </div>
              </div>
              <div className="relative flex w-1/3 mt-5 bg-card-darkModePrimary px-0 py-7 rounded-lg">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">August</p>
                  <div className="p-10 bg-card-coolorsAccent rounded-sm text-center">
                    <p className="text-xl">{Math.floor(augustAverage)}</p>
                  </div>
                </div>
                <h2 className="absolute text-xl left-1/2 transform -translate-x-1/2 top-1/2 py-2">
                  Average Pain Level
                </h2>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-lg font-customText">September</p>
                  <div className="p-10 bg-card-coolorsSecondary rounded-sm text-center">
                    <p className="text-xl">{Math.floor(septemberAverage)}</p>
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
