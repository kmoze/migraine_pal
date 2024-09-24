import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
  duration: number;
}

interface TermFrequency {
  term: string;
  frequency: number;
  fill: string;
}

interface MyDocumentProps {
  title: string;
  data: string[];
  daysWithout: { date: string; days_without: number }[];
  durationFreq: { duration: string; frequency: number }[];
  dateRanges: { startDate: Date | null; endDate: Date | null };
  migraines: Migraine[];
  freqSymptoms: TermFrequency[];
  freqTriggers: TermFrequency[];
}

// Create a Document component
function MyDocument({
  title,
  daysWithout,
  durationFreq,
  dateRanges,
  migraines,
  freqSymptoms,
  freqTriggers,
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

  function top3Symptoms(freqSymptoms: TermFrequency[]) {
    const sortedSymptoms = freqSymptoms.sort(
      (a, b) => b.frequency - a.frequency
    );

    const top3Symptoms = sortedSymptoms.slice(0, 3);

    return top3Symptoms;
  }

  function top3Triggers(freqTriggers: TermFrequency[]) {
    const sortedTriggers = freqTriggers.sort(
      (a, b) => b.frequency - a.frequency
    );

    const top3Triggers = sortedTriggers.slice(0, 3);

    return top3Triggers;
  }

  function capitalizeFirstLetter(term: string): string {
    if (!term) return term;
    return term.charAt(0).toUpperCase() + term.slice(1);
  }

  const dateConverted = dateRangeConverter(dateRanges);

  const averageDuration = calculateAverageDuration(durationFreq);

  const highestDaysWithout = getHighestDaysWithout(daysWithout);

  const averagePainLevel = averagePain(migraines);

  const topSymptoms = top3Symptoms(freqSymptoms);

  const topTriggers = top3Triggers(freqTriggers);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{title} - MigrainePal</Text>
          <Text style={styles.dateRange}>{dateConverted}</Text>
          <Text style={styles.summary}>
            Average duration:{' '}
            <Text style={styles.highlightedText}>
              {`${averageDuration.toFixed()}`} hours
            </Text>
          </Text>
          <Text style={styles.summary}>
            Most days without a migraine:{' '}
            <Text style={styles.highlightedText}>
              {`${highestDaysWithout}`}
            </Text>
          </Text>
          <Text style={styles.summary}>
            Average pain level:{' '}
            <Text style={styles.highlightedText}>
              {`${averagePainLevel}/10`}
            </Text>
          </Text>
          <Text style={styles.title}>Top 3 symptoms:</Text>
          {topSymptoms.map((symptom, index) => (
            <Text key={index} style={styles.listItem}>
              {`${index + 1}. ${capitalizeFirstLetter(symptom.term)}`}
            </Text>
          ))}
          <Text style={styles.title}>Top 3 triggers:</Text>
          {topTriggers.map((symptom, index) => (
            <Text key={index} style={styles.listItem}>
              {`${index + 1}. ${capitalizeFirstLetter(symptom.term)}`}
            </Text>
          ))}
          <Text style={styles.callToAction}>
            Bring this report to your next Doctor's appointment to discuss it
            with a health professional.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#f4f4f4',
  },
  section: {
    marginBottom: 25,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#004c8b',
    textAlign: 'center',
  },
  dateRange: {
    fontSize: 12,
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Helvetica-Oblique',
  },
  summary: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
    backgroundColor: '#e6f7ff', // Light blue background for each item
    padding: 5, // Padding around text
    width: 250,
    borderRadius: 5, // Rounded corners
  },
  listItem: {
    fontSize: 14,
    marginBottom: 10,
    paddingLeft: 10,
    borderLeft: '2px solid #0077b6',
    color: '#333',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#0077b6',
  },
  callToAction: {
    fontSize: 11,
    fontWeight: 'light',
    marginTop: 30,
  },
  highlightedText: {
    fontSize: 22,
    fontWeight: 'hairline',
  },
});

export default MyDocument;
