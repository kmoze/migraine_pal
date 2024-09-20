import { TrendingUp } from 'lucide-react';
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A line chart with a label';

// Migraine interface
interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
}

// Sample array of migraines (you will be fetching this from your state or database)
const migraines: Migraine[] = [
  {
    id: 1,
    date: new Date('2024-09-01'),
    symptoms: ['nausea'],
    triggers: ['stress'],
    pain: 7,
  },
  {
    id: 2,
    date: new Date('2024-09-05'),
    symptoms: ['blurred vision'],
    triggers: ['lack of sleep'],
    pain: 6,
  },
  {
    id: 3,
    date: new Date('2024-09-20'),
    symptoms: ['throbbing'],
    triggers: ['caffeine'],
    pain: 8,
  },
  {
    id: 4,
    date: new Date('2024-09-21'),
    symptoms: ['throbbing'],
    triggers: ['caffeine'],
    pain: 8,
  },
];

// Step 1: Sort migraines by date (just in case they are not in order)
const sortedMigraines = migraines.sort(
  (a, b) => a.date.getTime() - b.date.getTime()
);

function formatDateWithSuffix(date: Date): string {
  // 'MMM do' format will give us something like 'Sep 1st'
  return format(date, 'MMM do');
}

// Step 2: Calculate the number of days without a migraine between each entry
const daysWithoutMigraine = sortedMigraines.map((migraine, index) => {
  if (index === 0) {
    return {
      date: formatDateWithSuffix(new Date(migraine.date)),
      daysWithout: 0, // First migraine doesn't have previous one to compare
    };
  } else {
    const previousMigraine = sortedMigraines[index - 1];
    const differenceInTime =
      migraine.date.getTime() - previousMigraine.date.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Convert from milliseconds to days

    return {
      date: formatDateWithSuffix(new Date(migraine.date)),
      daysWithout: differenceInDays,
    };
  }
});

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function LineChartTest() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lorem, ipsum dolor.</CardTitle>
        <CardDescription>Lorem ipsum dolor sit.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={daysWithoutMigraine}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="daysWithout"
              type="bumpX"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-desktop)',
              }}
              activeDot={{
                r: 8,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Lorem ipsum dolor sit amet. <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Lorem, ipsum dolor sit amet consectetur adipisicing.
        </div>
      </CardFooter>
    </Card>
  );
}

export default LineChartTest;
