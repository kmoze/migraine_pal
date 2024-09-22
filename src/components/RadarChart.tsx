import { TrendingUp } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

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

interface RadarChartProps {
  durationFreqData: { duration: string; frequency: number }[];
}

export const description = 'A radar chart with dots';

const chartConfig = {} satisfies ChartConfig;

export function RadarChartComponent({ durationFreqData }: RadarChartProps) {
  return (
    <Card className="w-1/3 bg-gray-200 border-none">
      <CardHeader className="items-center">
        <CardTitle>Migraine Duration Frequency</CardTitle>
        <CardDescription>
          Showing the duration of your migraines and how often
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full aspect-square max-h-[250px]"
        >
          <RadarChart data={durationFreqData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="duration" />
            <PolarGrid />
            <Radar
              dataKey="frequency"
              fill="#6e97c8"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Lorem ipsum dolor sit amet consectetur.
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Lorem, ipsum dolor.
        </div>
      </CardFooter>
    </Card>
  );
}

export default RadarChartComponent;
