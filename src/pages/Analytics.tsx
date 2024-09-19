import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { type ChartConfig } from '@/components/ui/chart';
import { PyramidIcon, Frown } from 'lucide-react';
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
    color: '#2563eb',
    icon: Frown,
  },
} satisfies ChartConfig;

function Analytics({ migraines }: AnalyticsProps) {
  return (
    <>
      <div className="h-full flex flex-col w-full p-4 bg-custom-gradient">
        Analytics
        <ChartContainer config={chartConfig} className="min-h-[500px] w-1/2">
          <BarChart accessibilityLayer data={migraines}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="pain" fill="var(--color-pain)" radius={12} />
          </BarChart>
        </ChartContainer>
      </div>
    </>
  );
}

export default Analytics;
