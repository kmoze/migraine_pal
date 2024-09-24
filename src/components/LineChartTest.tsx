import { TrendingUp } from 'lucide-react';
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

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

interface LineChartTestProps {
  daysWithoutMigraine: { date: string; days_without: number }[];
}

const chartConfig = {} satisfies ChartConfig;

function LineChartTest({ daysWithoutMigraine }: LineChartTestProps) {
  return (
    <Card className="w-1/2 bg-gray-200 dark:bg-card-darkModePrimary border-none">
      <CardHeader>
        <CardTitle>Days without a migraine</CardTitle>
        <CardDescription>Comparison from day to day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[250px]"
        >
          <LineChart
            accessibilityLayer
            data={daysWithoutMigraine}
            margin={{
              top: 25,
              left: 10,
              right: 10,
              bottom: 0,
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
              cursor={true}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Line
              dataKey="days_without"
              type="bumpX"
              stroke="#1e6091"
              strokeWidth={2}
              dot={{
                fill: '#FFFFFF',
              }}
              activeDot={{
                r: 6,
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
          Lorem ipsum dolor sit amet.
        </div>
        <div className="leading-none text-muted-foreground">
          Lorem, ipsum dolor sit amet consectetur adipisicing.
        </div>
      </CardFooter>
    </Card>
  );
}

export default LineChartTest;
