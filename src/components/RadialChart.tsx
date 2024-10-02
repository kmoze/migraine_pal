import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

export const description = 'A radial chart with text';

const chartConfig = {} satisfies ChartConfig;

export function RadialChart({ score }: { score: number }) {
  const getBarLength = (score: number) => {
    // Adjust the length range as needed
    if (score <= 50) return 20;
    if (score <= 120) return 60;
    return 130; // Maximum length
  };

  const getEndAngle = (score: number) => {
    if (score <= 50) return 90; // 25% of the circle
    if (score <= 120) return 200; // 50% of the circle
    return 320; // Full circle
  };

  const getBarColor = (score: number) => {
    if (score <= 50) return '#28a428'; // Low score color
    if (score <= 120) return '#ffbf00'; // Medium score color
    return '#e20027'; // High score color
  };

  const chartData = [
    {
      browser: 'safari',
      visitors: getBarLength(score),
      fill: getBarColor(score),
    },
  ];

  const getScoreText = (score: number) => {
    if (score <= 50) return 'Low';
    if (score <= 120) return 'Medium';
    return 'High';
  };

  return (
    <Card className="flex w-full flex-col bg-card-lightMode border-card-darkModePrimary dark:border-card-lightMode border dark:bg-card-coolorsPrimary p-4">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary font-customText text-xl">
          Based on forecasted weather
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
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
                    const text = getScoreText(score);
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {text}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Migraine possibility
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
