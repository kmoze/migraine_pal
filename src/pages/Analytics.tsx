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

const chartConfig = {
  pain: {
    label: 'Pain Level',
    color: '#006594',
    icon: Frown,
  },
} satisfies ChartConfig;

const chartData = [
  { browser: 'chrome', visitors: 275, fill: '#006594' },
  { browser: 'safari', visitors: 200, fill: '#009592' },
  { browser: 'firefox', visitors: 187, fill: '#113594' },
  { browser: 'edge', visitors: 173, fill: '#059211' },
  { browser: 'other', visitors: 90, fill: '#414594' },
];

function Analytics({ migraines }: AnalyticsProps) {
  return (
    <>
      <div className="h-full flex flex-col w-full p-4 bg-custom-gradient">
        Analytics
        <ChartContainer
          config={chartConfig}
          className="min-h-[400px] w-1/3 mt-10"
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
            <ChartLegend className="text-lg" content={<ChartLegendContent />} />
            <Bar dataKey="pain" fill="var(--color-pain)" radius={12} />
          </BarChart>
        </ChartContainer>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Pie Chart - Label</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  label
                  nameKey="browser"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Analytics;
