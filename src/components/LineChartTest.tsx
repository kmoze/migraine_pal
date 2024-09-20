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
  daysWithoutMigraine: { date: string; daysWithout: number }[];
}

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

function LineChartTest({ daysWithoutMigraine }: LineChartTestProps) {
  return (
    <Card className="w-1/2 bg-gray-300 border-none">
      <CardHeader>
        <CardTitle>Lorem, ipsum dolor.</CardTitle>
        <CardDescription>Lorem ipsum dolor sit.</CardDescription>
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
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="daysWithout"
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
