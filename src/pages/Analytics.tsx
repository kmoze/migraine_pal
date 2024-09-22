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

import { type ChartConfig } from '@/components/ui/chart';
import { Frown, TrendingUp } from 'lucide-react';
import { XAxis, CartesianGrid, BarChart, Bar, Pie, PieChart } from 'recharts';
import LineChartTest from '@/components/LineChartTest';
import RadarChartComponent from '@/components/RadarChart';
import { Component } from '@/components/Component';

import { format } from 'date-fns';

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
  duration: number;
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

function Analytics({ migraines }: AnalyticsProps) {
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

  let symptomsChartData = frequencyCounter(migraines, 'symptoms');
  let triggersChartData = frequencyCounter(migraines, 'triggers');

  const sortedMigraines = migraines.slice().sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const barChartDateFormat = migraines
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
        acc[duration] = (acc[duration] || 0) + 1; // Increment the count for the duration
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

  let durationFreqData = durationFrequency(migraines);

  return (
    <>
      <div className="h-full w-full flex flex-col p-4 bg-custom-gradient gap-2">
        <h2 className="text-2xl">Analytics</h2>
        <Component />
        <div className="flex gap-2">
          <Card className="flex flex-col w-1/2 bg-gray-300 border-none">
            <CardHeader className="items-center pb-0">
              <CardTitle>Pain Levels</CardTitle>
              <CardDescription>
                Hover over the chart to see the pain levels
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
              <div className="flex items-center gap-2 font-medium leading-none">
                Lorem ipsum dolor sit amet consectetur.{' '}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Lorem, ipsum dolor.
              </div>
            </CardFooter>
          </Card>
          <LineChartTest daysWithoutMigraine={daysWithoutMigraine} />
        </div>
        <div className="flex gap-5">
          <Card className="flex flex-col w-1/3 bg-gray-300 border-none">
            <CardHeader className="items-center pb-0">
              <CardTitle>Most common symptoms</CardTitle>
              <CardDescription>
                Hover over the chart to see the frequency
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
              <div className="flex items-center gap-2 font-medium leading-none">
                Lorem ipsum dolor sit amet. <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing.
              </div>
            </CardFooter>
          </Card>
          <Card className="flex flex-col w-1/3 bg-gray-300 border-none">
            <CardHeader className="items-center pb-0">
              <CardTitle>Most common triggers</CardTitle>
              <CardDescription>
                Hover over the chart to see the frequency
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
              <div className="flex items-center gap-2 font-medium leading-none">
                Lorem ipsum dolor sit amet. <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing.
              </div>
            </CardFooter>
          </Card>
          <RadarChartComponent durationFreqData={durationFreqData} />
        </div>
      </div>
    </>
  );
}

export default Analytics;
