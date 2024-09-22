import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

export const description = 'A radial chart with text';

const chartConfig = {} satisfies ChartConfig;

export function PainRadialChart({ score }: { score: number }) {
  const getBarLength = (score: number) => {
    // Adjust the length range as needed
    if (score <= 4) return 4;
    if (score <= 8) return 8;
    return 10; // Maximum length
  };

  const getEndAngle = (score: number) => {
    if (score <= 1) return 30; // 25% of the circle
    if (score <= 2) return 60; // 25% of the circle
    if (score <= 3) return 90; // 25% of the circle
    if (score <= 4) return 110; // 25% of the circle
    if (score <= 5) return 175;
    if (score <= 6) return 200;
    if (score <= 7) return 230;
    if (score <= 8) return 250;
    if (score <= 9) return 290;
    return 320; // nearly a full circle
  };

  const getBarColor = (score: number) => {
    if (score <= 4) return '#28a428'; // Low score color
    if (score <= 7) return '#ffbf00'; // Medium score color
    return '#e20027'; // High score color
  };

  const chartData = [
    {
      browser: 'safari',
      visitors: getBarLength(score),
      fill: getBarColor(score),
    },
  ];

  return (
    <Card className="flex w-1/2 flex-col bg-transparent border-none shadow-none">
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={getEndAngle(score)}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-7xl font-bold"
                        >
                          {Math.round(score)}
                        </tspan>
                        <tspan
                          x={135}
                          y={(viewBox.cy || 0) + 10}
                          className="fill-muted-foreground text-lg "
                        >
                          /10
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
