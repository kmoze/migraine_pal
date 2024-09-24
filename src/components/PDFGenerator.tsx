import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Define styles for the document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: 12,
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    marginTop: 20,
    fontWeight: 'bold',
  },
  dateRange: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
});

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
  duration: number;
}

interface MyDocumentProps {
  title: string;
  data: string[];
  daysWithout: { date: string; days_without: number }[];
  durationFreq: { duration: string; frequency: number }[];
  dateRanges: { startDate: Date | null; endDate: Date | null };
  migraines: Migraine[];
}

// Create a Document component
function MyDocument({
  title,
  daysWithout,
  durationFreq,
  dateRanges,
  migraines,
}: MyDocumentProps) {
  const getHighestDaysWithout = (
    days: { date: string; days_without: number }[]
  ) => {
    return days.reduce(
      (max, current) =>
        current.days_without > max ? current.days_without : max,
      0
    );
  };

  const parseDuration = (duration: string) => {
    if (duration.endsWith('h')) {
      const number = parseFloat(duration);
      return isNaN(number) ? 0 : number;
    }
    return 0;
  };

  // Function to calculate the total duration and total frequency
  const calculateAverageDuration = (
    data: { duration: string; frequency: number }[]
  ) => {
    let totalDuration = 0;
    let totalFrequency = 0;

    data.forEach((item) => {
      const duration =
        item.duration === '12h+' ? 12 : parseDuration(item.duration);
      totalDuration += duration * item.frequency;
      totalFrequency += item.frequency;
    });

    return totalFrequency > 0 ? totalDuration / totalFrequency : 0;
  };

  function dateRangeConverter(dateRanges: any) {
    if (!dateRanges.startDate && !dateRanges.endDate) {
      return 'All time';
    }

    let start = dateRanges.startDate;
    let startDate = new Date(start);
    let formatStartDate = format(startDate, 'MMMM do, yyyy');

    let end = dateRanges.endDate;
    let endDate = new Date(end);
    let formatEndDate = format(endDate, 'MMMM do, yyyy');

    return `${formatStartDate} - ${formatEndDate}`;
  }

  function averagePain(migraines: Migraine[]) {
    if (migraines.length === 0) return 0;

    const totalPain = migraines.reduce(
      (sum, migraine) => sum + migraine.pain,
      0
    );
    const averagePain = totalPain / migraines.length;

    return parseFloat(averagePain.toFixed());
  }

  const dateConverted = dateRangeConverter(dateRanges);

  const averageDuration = calculateAverageDuration(durationFreq);

  const highestDaysWithout = getHighestDaysWithout(daysWithout);

  const averagePainLevel = averagePain(migraines);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{title} - MigrainePal</Text>
          {/* Display data */}
          {/* {data.map((item, index) => (
            <Text key={index} style={styles.content}>
              {`Duration: ${item}, Frequency: ${item}`}
            </Text>
          ))}
          {daysWithout.map((item, index) => (
            <Text key={index} style={styles.content}>
              {`Date: ${item.date}, Days Without: ${item.days_without}`}
            </Text>
          ))} */}

          {/* Display calculated metrics */}
          <Text style={styles.dateRange}>{`Date Range: ${dateConverted}`}</Text>
          <Text style={styles.summary}>
            {`Average Duration: ${averageDuration.toFixed()} hours`}
          </Text>
          <Text style={styles.summary}>
            {`Longest stretch of days without a migraine: ${highestDaysWithout}`}
          </Text>
          <Text style={styles.summary}>
            {`Average pain level: ${averagePainLevel}/10`}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default MyDocument;
