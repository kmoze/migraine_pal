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
import { PyramidIcon, Frown, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Pie,
  PieChart,
} from 'recharts';

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
}

interface AnalyticsProps {
  migraines: Migraine[];
}

interface TermFrequency {
  term: string;
  frequency: number;
  fill: string;
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

  return (
    <>
      <div className="h-full flex flex-col w-full p-4 bg-custom-gradient gap-2">
        Analytics
        <Card className="flex flex-col w-1/3 bg-gray-300 border-none">
          <CardHeader className="items-center pb-0">
            <CardTitle>Pain Levels</CardTitle>
            <CardDescription>
              Hover over the chart to see the pain levels
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={barChartConfig}
              className="min-h-[300px] w-full mt-10"
            >
              <BarChart accessibilityLayer data={migraines}>
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
        </Card>
        {/* Pie Chart experimentation */}
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
      </div>
    </>
  );
}

export default Analytics;