import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { format } from 'date-fns';

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

function TestChart() {
  return (
    <LineChart width={500} height={300} data={daysWithoutMigraine}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="daysWithout"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
}

export default TestChart;
