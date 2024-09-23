import { useEffect, useState } from 'react';
import { CarouselPlugin } from '@/components/ArticleCarousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RadialChart } from '@/components/RadialChart';
import { PainRadialChart } from '@/components/PainRadialChart';

import {
  ThermometerSun,
  Gauge,
  TrendingUpDown,
  Lightbulb,
  PartyPopper,
  Sparkles,
  ZapOff,
  MoveRight,
  CloudLightning,
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const BASE_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=51.5072&lon=-0.1276&appid=${API_KEY}&units=metric&cnt=40`;

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
}

interface DashboardProps {
  migraines: Migraine[];
}

interface Forecast {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
}

interface WeatherData {
  list: Forecast[];
}

interface TempChangeEntry {
  tempChange: string;
  pressureChange: string;
}

interface TempChanges {
  [date: string]: {
    [time: string]: TempChangeEntry;
  };
}

function mode(
  objectsArray: Migraine[],
  type: 'symptoms' | 'triggers'
): string[] {
  const combineTerms = (
    objectsArray: Migraine[],
    type: 'symptoms' | 'triggers'
  ): string[] => {
    return objectsArray.reduce<string[]>((acc, obj) => {
      if (Array.isArray(obj[type])) {
        acc = acc.concat(
          obj[type].flatMap((item: string) =>
            item.split(', ').map((str: string) => str.trim())
          )
        );
      }
      return acc;
    }, []);
  };

  let combinedTerms = combineTerms(objectsArray, type);
  const frequencyCount = (terms: string[]): Record<string, number> => {
    return terms.reduce<Record<string, number>>((acc, term) => {
      acc[term] = (acc[term] || 0) + 1;
      return acc;
    }, {});
  };

  let freqCounted = frequencyCount(combinedTerms);

  let termFrequencies = [];

  for (let term in freqCounted) {
    termFrequencies.push({ term, frequency: freqCounted[term] });
  }

  let top3Terms = termFrequencies
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 3)
    .map((item) => item.term);

  return top3Terms;
}

function averagePainLevel(migraineData: Migraine[]) {
  let painValsOnly = migraineData.map((migraine) => migraine.pain);
  let totalPain = painValsOnly.reduce((accum, currVal) => accum + currVal, 0);
  return totalPain / painValsOnly.length;
}

function Dashboard({ migraines }: DashboardProps) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchWeatherData() {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }
      const data = await response.json();

      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeatherData();
  }, []);

  function humidityAnalysis(array: WeatherData): string {
    let list = array.list;
    let over70 = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].main.humidity > 70) {
        over70.push(list[i]);
      }
    }

    if (over70.length >= 30) {
      return 'High';
    } else if (over70.length >= 20 && over70.length <= 29) {
      return 'Moderate';
    } else {
      return 'Mild';
    }
  }

  function tempAndPressureChangeAnalysis(array: WeatherData) {
    if (array && array.list.length > 0) {
      const forecastData = array.list;
      const organizedData: {
        [date: string]: { [time: string]: { temp: number; pressure: number } };
      } = {};

      // Organize the forecast data by date and time
      forecastData.forEach((forecast) => {
        const dt = new Date(forecast.dt_txt); // Use dt_txt for date and time
        const dateStr = dt.toISOString().split('T')[0]; // Extract YYYY-MM-DD
        const timeStr = dt.toTimeString().split(' ')[0].substring(0, 5); // Extract HH:MM

        if (!organizedData[dateStr]) {
          organizedData[dateStr] = {};
        }

        // Store both temperature and pressure in the organizedData object
        organizedData[dateStr][timeStr] = {
          temp: forecast.main.temp,
          pressure: forecast.main.pressure,
        };
      });

      const comparisonTimes = ['06:00', '12:00', '18:00'];
      const changes: {
        [date: string]: {
          [time: string]: { tempChange: string; pressureChange: string };
        };
      } = {};

      const dates = Object.keys(organizedData).sort();

      // Compare temperature and pressure between consecutive days
      dates.forEach((date, index) => {
        if (index === 0) return; // Skip the first date since there's no previous day to compare

        const prevDate = dates[index - 1]; // Previous day's date
        changes[date] = {};

        comparisonTimes.forEach((time) => {
          if (organizedData[date][time] && organizedData[prevDate][time]) {
            const tempToday = organizedData[date][time].temp;
            const tempYesterday = organizedData[prevDate][time].temp;
            const tempDrop = tempYesterday - tempToday;

            const pressureToday = organizedData[date][time].pressure;
            const pressureYesterday = organizedData[prevDate][time].pressure;
            const pressureDrop = pressureYesterday - pressureToday;

            changes[date][time] = {
              tempChange: tempDrop.toFixed(2),
              pressureChange: pressureDrop.toFixed(2),
            };
          }
        });
      });

      return changes;
    }
  }

  function tempChange(tempChanges: TempChanges) {
    let over5 = [];

    for (let date in tempChanges) {
      let dayTimes = tempChanges[date];
      for (let time in dayTimes) {
        if (Math.abs(Number(dayTimes[time]['tempChange'])) >= 5) {
          over5.push(Number(dayTimes[time]['tempChange']));
        }
      }
    }

    if (over5.length >= 3) {
      return 'Noticeable changes incoming';
    } else if (over5.length >= 1 && over5.length < 3) {
      return 'Potential changes incoming';
    } else {
      return 'No distinct changes';
    }
  }

  function pressureChange(pressureChanges: TempChanges) {
    let over5 = [];

    for (let date in pressureChanges) {
      let dayTimes = pressureChanges[date];
      for (let time in dayTimes) {
        if (Math.abs(Number(dayTimes[time]['pressureChange'])) >= 5) {
          over5.push(Number(dayTimes[time]['pressureChange']));
        }
      }
    }

    if (over5.length >= 3) {
      return 'Noticeable changes incoming';
    } else if (over5.length >= 1 && over5.length < 3) {
      return 'Potential changes incoming';
    } else {
      return 'No distinct changes';
    }
  }

  function migraineProbability() {
    let score = 0;

    if (
      pressureChange(tempAndPressureChangeAnalysis(weatherData)) ===
      'No distinct changes'
    ) {
      score += 10;
    } else if (
      pressureChange(tempAndPressureChangeAnalysis(weatherData)) ===
      'Potential changes incoming'
    ) {
      score += 30;
    } else if (
      pressureChange(tempAndPressureChangeAnalysis(weatherData)) ===
      'Noticeable changes incoming'
    ) {
      score += 50;
    }

    if (
      tempChange(tempAndPressureChangeAnalysis(weatherData)) ===
      'No distinct changes'
    ) {
      score += 10;
    } else if (
      tempChange(tempAndPressureChangeAnalysis(weatherData)) ===
      'Potential changes incoming'
    ) {
      score += 30;
    } else if (
      tempChange(tempAndPressureChangeAnalysis(weatherData)) ===
      'Noticeable changes incoming'
    ) {
      score += 50;
    }

    if (humidityAnalysis(weatherData) === 'Mild') {
      score += 10;
    } else if (humidityAnalysis(weatherData) === 'Moderate') {
      score += 30;
    } else if (humidityAnalysis(weatherData) === 'High') {
      score += 50;
    }

    return score;
  }

  function mostRecentMonth(migraineData: Migraine[]) {
    const months = new Set<string>();

    migraineData.forEach((log) => {
      const logDate = new Date(log.date); // Convert the string date to a Date object
      const month = String(logDate.getMonth() + 1).padStart(2, '0'); // Extract the month (0-indexed, so +1)
      months.add(month);
    });

    const uniqueMonths = Array.from(months);
    const sortedMonths = uniqueMonths.sort((a, b) => Number(a) - Number(b));

    return sortedMonths[sortedMonths.length - 1]; // Most recent month
  }

  function mostRecentDay(logs: Migraine[], month: string) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds

    // Filter logs to only include those from the specified month
    const daysInMonth = logs
      .filter((log) => {
        const logDate = new Date(log.date); // Convert to Date object
        const logMonth = String(logDate.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
        return logMonth === month;
      })
      .map((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds
        return logDate;
      });

    if (daysInMonth.length === 0) {
      return null; // No logs in the specified month
    }

    // Sort the days within the month in ascending order
    const sortedDays = daysInMonth
      .slice()
      .sort((a, b) => a.getDate() - b.getDate());

    // Get the most recent day in the month (the last one in the sorted list)
    const mostRecentDay = sortedDays[sortedDays.length - 1];

    // Calculate the difference in time (milliseconds) between current date and most recent migraine date
    const differenceInTime = currentDate.getTime() - mostRecentDay.getTime();

    // Convert milliseconds to days
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
  }

  return (
    <div className="h-full flex flex-col w-full p-4 bg-card-darkModeTextPrimary dark:bg-card-darkModeOther">
      <div className="flex items-start gap-5">
        <div className="bg-card-lightMode shadow-md shadow-gray-500 dark:shadow-md dark:shadow-slate-950 w-3/4 h-56 rounded-xl p-2 bg-opacity-55 dark:bg-card-darkModePrimary">
          <h2 className="text-card-coolorsPrimary text-3xl pt-3 pl-3 pb-3 font-custom dark:text-card-darkModeTextPrimary">
            Welcome to MigrainePal 👋🏻
          </h2>
          <div className="flex justify-around gap-2">
            <h4 className="text-card-coolorsPrimary text-2xl py-8 px-4 w-1/4 bg-card-lightMode mt-2 rounded-lg text-left font-customText dark:bg-card-darkModeSecondary dark:text-card-darkModeTextPrimary">
              {mostRecentDay(migraines, mostRecentMonth(migraines)) === 0 ? (
                <>Your last migraine was today.</>
              ) : mostRecentDay(migraines, mostRecentMonth(migraines)) === 1 ? (
                <>
                  Your last migraine was yesterday{' '}
                  <Sparkles className="inline-block mb-2 text-yellow-500 h-7 w-7" />
                </>
              ) : (
                <>
                  Your last migraine was{' '}
                  {mostRecentDay(migraines, mostRecentMonth(migraines))} days
                  ago{' '}
                  <PartyPopper className="inline-block mb-2 text-green-500 h-7 w-7" />
                </>
              )}
            </h4>
            <h4 className="text-card-coolorsPrimary bg-card-lightModeSecondary dark:bg-card-darkModeTertiary dark:text-card-darkModeTextPrimary text-xl py-6 px-4 w-1/3 mt-2 rounded-lg font-customText">
              There are some new weather updates that might be of use. Check
              them out below.
            </h4>
            <h4 className="text-card-coolorsPrimary text-xl py-5 px-4 w-1/3 bg-card-lightModeTertiary dark:bg-card-darkModeOther dark:text-card-darkModeTextPrimary mt-2 rounded-lg font-customText">
              <Lightbulb className="inline-block mb-2 h-7 w-7 text-yellow-500" />{' '}
              <span className="text-card-coolorsPrimary font-customText dark:text-card-darkModeTextPrimary">
                {' '}
                Daily tip from us:{' '}
              </span>{' '}
              <br />
              Hydrate well to reduce headaches during high humidity.
            </h4>
          </div>
        </div>
        <div className="bg-card-lightModeSecondary text-white dark:bg-card-darkModePrimary shadow-lg shadow-gray-500 dark:shadow-md dark:shadow-slate-950 p-2 rounded-lg  h-56 w-1/4 flex items-center justify-center">
          <CarouselPlugin />
        </div>
      </div>
      <div className="flex justify-evenly gap-5 mt-5">
        <div className="bg-card-lightModeOther dark:bg-card-coolorsPrimary shadow-md shadow-gray-500 dark:shadow-md dark:shadow-slate-950 w-1/3 h-60 rounded-lg flex flex-col">
          <h2 className="text-card-coolorsPrimary dark:text-card-darkModeTextPrimary text-xl text-left mt-3 ml-4 font-custom">
            Your average pain level
          </h2>
          <div className="flex items-center justify-center">
            <PainRadialChart score={Math.round(averagePainLevel(migraines))} />
          </div>
        </div>
        <div className="bg-card-lightModeOther dark:bg-card-coolorsPrimary shadow-md shadow-gray-500 dark:shadow-md dark:shadow-slate-950 w-1/3 h-60 rounded-lg p-4 flex flex-col">
          <h2 className="text-card-coolorsPrimary dark:text-card-darkModeTextPrimary text-xl mb-4 font-custom">
            Your most common symptoms
          </h2>
          <ul className="flex flex-col space-y-2 h-full justify-evenly">
            {mode(migraines, 'symptoms').map((symptom, index) => {
              const widths = ['w-3/4', 'w-1/2', 'w-1/3']; // Dynamically change width based on index
              const isTop = index === 0;
              const isThird = index === 2;
              return (
                <li
                  key={index}
                  className={`capitalize py-2 px-4 rounded-3xl text-card-coolorsPrimary dark:text-card-darkModeTextPrimary font-customText ${
                    widths[index]
                  }
                  ${
                    isTop
                      ? 'text-xl bg-card-lightModeTertiary dark:bg-card-darkModePrimary dark:shadow-none'
                      : isThird
                      ? 'text-sm bg-blue-300 dark:bg-card-darkModeSecondary dark:shadow-none'
                      : 'text-lg bg-card-lightMode dark:bg-card-darkModeOther dark:shadow-none'
                  }
                  drop-shadow-md`}
                >
                  {symptom}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="bg-card-lightModeOther dark:bg-card-coolorsPrimary shadow-md shadow-gray-500 dark:shadow-md dark:shadow-slate-950 w-1/3 h-60 rounded-lg p-4 flex flex-col">
          <h2 className="text-card-coolorsPrimary dark:text-card-darkModeTextPrimary text-xl mb-4 font-custom">
            Your most common triggers
          </h2>
          <ul className="flex flex-col space-y-2 h-full justify-evenly">
            {mode(migraines, 'triggers').map((trigger, index) => {
              const widths = ['w-3/4', 'w-1/2', 'w-1/3']; // Dynamically change width based on index
              const isTop = index === 0;
              const isThird = index === 2;
              return (
                <li
                  key={index}
                  className={`capitalize py-2 px-4 rounded-3xl text-card-coolorsPrimary dark:text-card-darkModeTextPrimary font-customText ${
                    widths[index]
                  }
                  ${
                    isTop
                      ? 'text-xl bg-card-lightModeTertiary dark:bg-card-darkModePrimary dark:shadow-none'
                      : isThird
                      ? 'text-sm bg-blue-300 dark:bg-card-darkModeSecondary dark:shadow-none'
                      : 'text-lg bg-card-lightMode dark:bg-card-darkModeOther dark:shadow-none'
                  }
                  drop-shadow-md`}
                >
                  {trigger}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="flex flex-grow gap-4">
        <div className="bg-card-lightModeSecondary dark:bg-card-dashboard shadow-md shadow-gray-500 dark:shadow-md dark:shadow-slate-950 w-1/4 mt-3 rounded-lg flex flex-col">
          <h2 className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-2xl p-7 text-left font-custom">
            Analytics
          </h2>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary mx-16 mt-10 mb-7 text-xl font-customText">
              See the impact your migraines have on your life in easily
              digestible charts and graphs.
            </h2>
            <Link to="/analytics">
              <Button className="text-md p-5 rounded-md bg-card-coolorsSecondary hover:bg-card-coolorsAccent dark:bg-card-lightMode dark:hover:bg-card-lightModeSecondary flex items-center">
                Go to Analytics
                <MoveRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-card-lightMode dark:bg-card-coolorsPrimary shadow-md shadow-gray-500 dark:shadow-md dark:shadow-slate-950 w-3/4 mt-3 rounded-lg relative">
          <h2 className="text-card-darkModePrimary dark:text-card-lightMode text-2xl absolute top-0 left-0 p-7 font-custom">
            Weather
          </h2>
          <div className="flex items-center h-full">
            <div className="flex flex-col flex-grow">
              <div className="flex gap-2 mx-8">
                <div className="flex flex-col w-1/2 font-medium leading-none border border-card-coolorsPrimary dark:border-gray-400 p-5 rounded-md">
                  <h2 className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-md mb-4">
                    Humidity Forecast:
                  </h2>
                  <div className="flex items-center gap-1 justify-center">
                    {loading ? (
                      <p className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-lg">
                        Loading...
                      </p>
                    ) : (
                      <p className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-xl font-customText">
                        {weatherData
                          ? humidityAnalysis(weatherData)
                          : 'Sorry, there seems to be an error...'}
                      </p>
                    )}
                    <ThermometerSun className="h-6 w-6 text-red-500" />
                  </div>
                </div>
                <div className="flex flex-col w-1/2 font-medium leading-none border border-card-coolorsPrimary dark:border-gray-400 p-5 rounded-md">
                  <h2 className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-md mb-4">
                    Temperature Change Forecast:
                  </h2>
                  <div className="flex items-center gap-1 justify-center">
                    {loading ? (
                      <p className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-lg">
                        Loading...
                      </p>
                    ) : (
                      <p className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-xl font-customText">
                        {weatherData
                          ? tempChange(
                              tempAndPressureChangeAnalysis(weatherData) || {}
                            )
                          : 'Sorry, there seems to be an error...'}
                      </p>
                    )}
                    <TrendingUpDown className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mx-8 mt-4">
                <div className="flex flex-col w-1/2 font-medium leading-none border border-card-coolorsPrimary dark:border-gray-400 p-5 rounded-md">
                  <h2 className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-md mb-4">
                    Barometric Change Forecast:
                  </h2>
                  <div className="flex items-center gap-1 justify-center">
                    {loading ? (
                      <p className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-lg">
                        Loading...
                      </p>
                    ) : (
                      <p className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-xl font-customText">
                        {weatherData
                          ? pressureChange(
                              tempAndPressureChangeAnalysis(weatherData) || {}
                            )
                          : 'Sorry, there seems to be an error...'}
                      </p>
                    )}
                    <Gauge className="h-7 w-7 text-yellow-400" />
                  </div>
                </div>
                <div className="flex flex-col w-1/2 font-medium leading-none border border-card-coolorsPrimary dark:border-gray-400 p-5 rounded-md">
                  <h2 className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-md mb-4">
                    Storm Forecast:
                  </h2>
                  <div className="flex items-center gap-1 justify-center">
                    {loading ? (
                      <p className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-lg">
                        Loading...
                      </p>
                    ) : (
                      <p className="text-card-darkModePrimary dark:text-card-darkModeTextPrimary text-xl font-customText">
                        None detected
                      </p>
                    )}
                    <CloudLightning className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-10">
              {weatherData !== null ? (
                <RadialChart score={migraineProbability()} />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
