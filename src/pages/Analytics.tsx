import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { type ChartConfig } from '@/components/ui/chart';
import { Frown, Download } from 'lucide-react';
import { XAxis, CartesianGrid, BarChart, Bar, Pie, PieChart } from 'recharts';
import { MigraineDurationFreqChart } from '@/components/MigraineDurationFreqChart';
import { DateRangeToggle } from '@/components/AnalyticsDateRangeToggle';
import InsightsSheet from '@/components/InsightsSheet';

import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from '@/components/PDFGenerator';

import { format, subMonths } from 'date-fns';
import { useState } from 'react';
import DaysWithoutMigraineChart from '@/components/DaysWithoutMigraineChart';

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
  duration: number;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface AnalyticsProps {
  migraines: Migraine[];
}

interface TermFrequency {
  term: string;
  frequency: number;
  fill: string;
}

interface DurationFrequency {
  [duration: number]: number;
}

interface DurationFrequencyItem {
  duration: string;
  frequency: number;
}

const barChartConfig = {
  pain: {
    label: 'Pain Level',
    color: '#006594',
    icon: Frown,
  },
} satisfies ChartConfig;

const chartConfigPie = {} satisfies ChartConfig;

const similarColors = [
  '#004c8b',
  '#0077b6',
  '#005f99',
  '#1a73e8',
  '#003f72',
  '#005682',
  '#1e6091',
  '#468faf',
  '#00527a',
  '#0071a1',
];

function getStartDateThreeMonthsAgo(): Date {
  const currentDate = new Date();
  const startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
  return new Date(startDate.setDate(1)); // Set to the first day of the month
}

function Analytics({ migraines }: AnalyticsProps) {
  const title = 'Analytics Report';
  const data = [
    'Summary of the data...',
    'Additional details...',
    'Further analysis...',
  ];

  const initialDateRange: DateRange = {
    startDate: getStartDateThreeMonthsAgo(),
    endDate: new Date(),
  };

  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  // Date filtering experiment
  function filterByDateRange(
    migraines: Migraine[],
    { startDate, endDate }: DateRange
  ) {
    if (!startDate && !endDate) {
      return migraines;
    }
    return migraines.filter((migraine) => {
      const migraineDate = new Date(migraine.date);
      const isAfterStart = startDate ? migraineDate >= startDate : true;
      const isBeforeEnd = endDate ? migraineDate <= endDate : true;

      return isAfterStart && isBeforeEnd;
    });
  }

  const filteredMigraines = filterByDateRange(migraines, dateRange);

  let symptomsChartData = frequencyCounter(filteredMigraines, 'symptoms');
  let triggersChartData = frequencyCounter(filteredMigraines, 'triggers');

  function frequencyCounter(
    objectsArray: Migraine[],
    type: 'symptoms' | 'triggers'
  ): TermFrequency[] {
    const combineTerms = (
      objectsArray: Migraine[],
      type: 'symptoms' | 'triggers'
    ): string[] => {
      return objectsArray.reduce<string[]>((acc, obj) => {
        if (Array.isArray(obj[type])) {
          acc = acc.concat(
            obj[type].flatMap((item: string) =>
              item.split(', ').map((str: string) => str.trim())
            )
          );
        }
        return acc;
      }, []);
    };

    let combinedTerms = combineTerms(objectsArray, type);
    const frequencyCount = (terms: string[]): Record<string, number> => {
      return terms.reduce<Record<string, number>>((acc, term) => {
        acc[term] = (acc[term] || 0) + 1;
        return acc;
      }, {});
    };

    let freqCounted = frequencyCount(combinedTerms);

    let termFrequencies: TermFrequency[] = [];

    let index = 0;
    for (let term in freqCounted) {
      if (index < similarColors.length) {
        termFrequencies.push({
          term,
          frequency: freqCounted[term],
          fill: similarColors[index],
        });
        index++;
      }
    }

    return termFrequencies;
  }

  const sortedMigraines = filteredMigraines.slice().sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const barChartDateFormat = filteredMigraines
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((migraine) => ({
      ...migraine,
      date: formatDateWithSuffix(migraine.date),
    }));

  function formatDateWithSuffix(date: Date): string {
    // 'MMM do' format will give us something like 'Sep 1st'
    return format(date, 'MMM do');
  }

  const daysWithoutMigraine = sortedMigraines.map((migraine, index) => {
    if (index === 0) {
      return {
        date: formatDateWithSuffix(new Date(migraine.date)),
        days_without: 0, // First migraine doesn't have previous one to compare
      };
    } else {
      const previousMigraine = sortedMigraines[index - 1];
      const differenceInTime =
        new Date(migraine.date).getTime() -
        new Date(previousMigraine.date).getTime();
      const differenceInDays = Math.floor(
        differenceInTime / (1000 * 3600 * 24)
      );

      return {
        date: formatDateWithSuffix(new Date(migraine.date)),
        days_without: differenceInDays,
      };
    }
  });

  function durationFrequency(
    migraineData: Migraine[]
  ): DurationFrequencyItem[] {
    const durationCount = migraineData.reduce<DurationFrequency>(
      (acc, migraine) => {
        const { duration } = migraine;
        acc[duration] = (acc[duration] || 0) + 1;
        return acc;
      },
      {}
    );

    let termFrequencies: DurationFrequencyItem[] = [];

    for (let duration in durationCount) {
      let displayDuration = duration;

      if (duration === '15') {
        displayDuration = '12h+';
      } else if (duration === '24') {
        displayDuration = 'A full day';
      } else {
        displayDuration += 'h';
      }
      termFrequencies.push({
        duration: displayDuration,
        frequency: durationCount[Number(duration)],
      });
    }

    return termFrequencies;
  }

  let durationFreqData = durationFrequency(filteredMigraines);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen lg:hidden">
        <p className="text-xl ml-10 text-gray-800 dark:text-gray-100">
          Please use a desktop device to view your analytics.
          <br />
          <br />
          But, feel free to log a migraine in the meantime.
        </p>
      </div>
      <div className="min-h-screen hidden w-full lg:flex flex-col p-3 bg-card-lightMode dark:bg-card-dashboard gap-2 overflow-auto">
        <div className="flex justify-between items-center">
          <div className="flex space-x-20 items-center">
            <h2 className="text-3xl font-custom mr-0">Analytics</h2>
            <DateRangeToggle
              allMigraines={() =>
                setDateRange({ startDate: null, endDate: null })
              }
              currentMonth={() =>
                setDateRange({
                  startDate: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                  ),
                  endDate: new Date(),
                })
              }
              last3Months={() =>
                setDateRange({
                  startDate: subMonths(new Date(), 3),
                  endDate: new Date(),
                })
              }
            />
          </div>
          <div className="flex items-center space-x-4">
            <InsightsSheet sorted={sortedMigraines} />
            <Popover>
              <PopoverTrigger asChild>
                <Button className="text-md dark:bg-card-lightMode dark:text-card-dashboard dark:hover:bg-card-lightModeSecondary bg-card-coolorsSecondary hover:bg-card-coolorsAccent">
                  Export
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Download your migraine report
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Handy if you want to share your migraine logs with a
                      health provider or for your own records.
                    </p>
                  </div>
                  <div className="justify-center flex">
                    <PDFDownloadLink
                      document={
                        <MyDocument
                          title={title}
                          data={data}
                          daysWithout={daysWithoutMigraine}
                          durationFreq={durationFreqData}
                          dateRanges={dateRange}
                          migraines={filteredMigraines}
                          freqSymptoms={symptomsChartData}
                          freqTriggers={triggersChartData}
                        />
                      }
                      fileName="report.pdf"
                    >
                      {/* @ts-ignore */}
                      {({ loading }: { loading: boolean }) => (
                        <Button className="relative text-lg bg-card-coolorsSecondary hover:bg-card-coolorsAccent dark:text-card-lightMode px-16 py-5 mt-5 group">
                          Download PDF
                          <span className="absolute right-3 top-3 transform -translate-y-1/4 transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                            <Download w-5 h-5 />
                          </span>
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex gap-2">
          <Card className="flex flex-col w-1/2 shadow-md shadow-slate-400 bg-card-lightModeOther dark:shadow-md dark:shadow-slate-950 dark:bg-card-darkModePrimary border-none">
            <CardHeader className="items-center pb-0">
              <CardTitle>Pain Levels</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-card-darkModeTextPrimary">
                Hover over the chart to see pain levels
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={barChartConfig}
                className="mx-auto aspect-square max-h-[300px] w-full"
              >
                <BarChart accessibilityLayer data={barChartDateFormat}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend
                    className="text-lg"
                    content={<ChartLegendContent />}
                  />
                  <Bar dataKey="pain" fill="var(--color-pain)" radius={12} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="leading-none text-muted-foreground mt-4">
                See how your pain has been historically.
              </div>
            </CardFooter>
          </Card>
          <DaysWithoutMigraineChart daysWithoutMigraine={daysWithoutMigraine} />
        </div>
        <div className="flex gap-3">
          <Card className="flex flex-col w-1/3 shadow-md shadow-slate-400 bg-card-lightModeTertiary dark:shadow-md dark:shadow-slate-950 dark:bg-card-darkModePrimary border-none">
            <CardHeader className="items-center pb-0">
              <CardTitle>Most common symptoms</CardTitle>
              <CardDescription className="dark:text-card-darkModeTextPrimary">
                Hover to see the frequency of each symptom.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfigPie}
                className="mx-auto aspect-square max-h-[300px] w-full [&_.recharts-pie-label-text]:fill-foreground"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={symptomsChartData}
                    dataKey="frequency"
                    label={({ name }) => name}
                    nameKey="term"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="leading-none text-muted-foreground text-sm w-full">
                Keep these in mind for when discussing your migraines with your
                doctor.
              </div>
            </CardFooter>
          </Card>
          <Card className="flex flex-col w-1/3 shadow-md shadow-slate-400 bg-card-lightModeTertiary dark:shadow-md dark:shadow-slate-950 dark:bg-card-darkModePrimary border-none">
            <CardHeader className="items-center pb-0">
              <CardTitle>Most common triggers</CardTitle>
              <CardDescription className="dark:text-card-darkModeTextPrimary">
                Hover to see the frequency of each trigger.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfigPie}
                className="mx-auto aspect-square max-h-[300px] w-full [&_.recharts-pie-label-text]:fill-foreground"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={triggersChartData}
                    dataKey="frequency"
                    label={({ name }) => name}
                    nameKey="term"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="leading-none text-muted-foreground w-3/4 mt-2">
                Are there any triggers here that may be preventable?
              </div>
            </CardFooter>
          </Card>
          <MigraineDurationFreqChart durationFreqData={durationFreqData} />
        </div>
      </div>
    </>
  );
}

export default Analytics;
