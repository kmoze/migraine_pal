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
    <Card className="w-1/3 bg-card-lightModeRadar dark:bg-card-darkModePrimary border-none">
      <CardHeader className="items-center">
        <CardTitle>Migraine Duration Frequency</CardTitle>
        <CardDescription className="text-card-coolorsPrimary dark:text-card-darkModeTextPrimary">
          Displaying the duration of your migraines. Hover to see frequency.
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
        <div className="flex items-center gap-2 mt-8 leading-none text-muted-foreground">
          Get a sense of how long your migraines are lasting.
        </div>
      </CardFooter>
    </Card>
  );
}

export default RadarChartComponent;
