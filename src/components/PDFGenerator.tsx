import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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
});

interface MyDocumentProps {
  title: string;
  data: string[];
  daysWithout: { date: string; days_without: number }[];
  durationFreq: { duration: string; frequency: number }[];
}

// Create a Document component
function MyDocument({
  title,
  data,
  daysWithout,
  durationFreq,
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

  const averageDuration = calculateAverageDuration(durationFreq);

  // console.log(averageDuration);

  const highestDaysWithout = getHighestDaysWithout(daysWithout);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{title}</Text>

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
          <Text style={styles.summary}>
            {`Average Duration: ${averageDuration.toFixed()} hours`}
          </Text>
          <Text style={styles.summary}>
            {`Longest stretch of days without a migraine: ${highestDaysWithout}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default MyDocument;
