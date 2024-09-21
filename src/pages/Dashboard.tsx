import { useEffect, useState } from 'react';
import { CarouselPlugin } from '@/components/ArticleCarousel';
import myImage from '../assets/analytics.png';

import { Sparkles, ThermometerSun, Gauge, TrendingUpDown } from 'lucide-react';

import myImg from '../assets/person1.svg';

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
  avgPain: number;
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

interface TempChanges {
  [date: string]: {
    [time: string]: string | number;
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

function Dashboard({ migraines, avgPain }: DashboardProps) {
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
              tempChange: tempDrop.toFixed(2), // Save the temperature drop as a string with 2 decimal places
              pressureChange: pressureDrop.toFixed(2), // Save the pressure drop as a string with 2 decimal places
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

    console.log(over5);

    if (over5.length >= 3) {
      return 'Noticeable changes incoming';
    } else if (over5.length >= 1 && over5.length < 3) {
      return 'Potential changes incoming';
    } else {
      return 'No distinct changes';
    }
  }

  console.log(pressureChange(tempAndPressureChangeAnalysis(weatherData)));

  return (
    <div className="h-full flex flex-col w-full p-4 bg-custom-gradient">
      <div className="flex items-start gap-5">
        <div className="bg-card-coolorsPrimary shadow-lg shadow-gray-500 w-3/4 h-56 rounded-xl p-4 bg-opacity-95">
          <h2 className="text-white text-3xl pt-3 pb-3">
            Welcome to MigrainePal 👋🏻
          </h2>
          <div className="flex justify-around gap-5">
            <h4 className="text-white text-xl p-8 w-1/3 bg-blue-700 bg-opacity-45 mt-2 rounded-sm text-center">
              Placeholder for analyzing when their last migraine was...
            </h4>
            <h4 className="text-white text-xl p-8 w-1/3 bg-blue-500 bg-opacity-45 mt-2 rounded-sm text-center">
              Placeholder for indicating if weather events might impact upcoming
              migraines...
              {/* I.e. If ALL forecast analysis indicates potential changes or more, tell the user this. */}
            </h4>
            <h4 className="text-white text-xl p-8 w-1/3 bg-sky-500 bg-opacity-45 mt-2 rounded-sm text-center">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit
            </h4>
          </div>
        </div>
        <div className="bg-card-coolorsSecondary shadow-lg shadow-gray-500 p-2 rounded-lg text-white h-56 w-1/4 flex items-center justify-center">
          <CarouselPlugin />
        </div>
      </div>
      <div className="flex justify-evenly gap-5 mt-5">
        <div className="bg-card-coolorsAccent shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg">
          <h2 className="text-white text-2xl p-6">Your most common symptoms</h2>
          <ul className="text-white pt-2 flex flex-col items-center justify-center h-1/2">
            {mode(migraines, 'symptoms').map((symptom, index) => {
              return (
                <li key={index} className="capitalize py-1 text-2xl">
                  {symptom}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="bg-card-coolorsAccent shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg">
          <h2 className="text-white text-2xl p-6">Your most common triggers</h2>
          <ul className="text-white pt-2 flex flex-col items-center justify-center h-1/2">
            {mode(migraines, 'triggers').map((trigger, index) => {
              return (
                <li key={index} className="capitalize py-1 text-2xl">
                  {trigger}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="bg-card-coolorsAccent shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg flex flex-col">
          <h2 className="text-white text-2xl p-7 text-left">
            Your average pain level
          </h2>
          <div className="flex-grow flex items-center justify-center">
            {avgPain ? (
              <span className="text-6xl text-white pb-10">
                {Math.round(avgPain)}
              </span>
            ) : (
              <span className="text-2xl text-white pb-10">Loading...</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-grow gap-4">
        <div className="bg-card-coolorsPrimary shadow-md shadow-gray-500 w-1/2 mt-5 rounded-lg flex flex-col">
          <h2 className="text-white text-2xl p-7 text-left">Analytics</h2>
          <div className="flex flex-grow items-center justify-center">
            <img
              className="max-w-lg max-h-96 object-contain rounded-lg mb-4"
              src={myImage}
              alt="Analytics Image"
            />
          </div>
        </div>
        <div className="bg-card-coolorsPrimary shadow-md shadow-gray-500 w-1/2 mt-5 rounded-lg relative">
          <h2 className="text-white text-2xl p-7 text-left">Weather</h2>
          <div className="flex gap-4 mx-8">
            <div className="flex flex-col w-1/3 font-medium leading-none border p-5 rounded-md">
              <h2 className="text-white text-md mb-4">Humidity Forecast:</h2>
              <div className="flex items-center gap-1 justify-center">
                {loading ? (
                  <p className="text-white text-lg">Loading...</p>
                ) : (
                  <p className="text-white text-xl">
                    {weatherData
                      ? humidityAnalysis(weatherData)
                      : 'Sorry, there seems to be an error...'}
                  </p>
                )}
                {/* <OctagonAlert className="h-5 w-5 text-red-500" /> */}
                <ThermometerSun className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="flex flex-col font-medium leading-none border p-5 rounded-md">
              <h2 className="text-white text-md mb-4">
                Temperature Change Forecast:
              </h2>
              <div className="flex items-center gap-1 justify-center">
                {loading ? (
                  <p className="text-white text-lg">Loading...</p>
                ) : (
                  <p className="text-white text-xl">
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
          <div className="flex flex-col font-medium leading-none border w-1/2 mx-8 p-5 mt-4 rounded-md">
            <h2 className="text-white text-md mb-4">
              Barometric Change Forecast:
            </h2>
            <div className="flex items-center gap-1 justify-center">
              {loading ? (
                <p className="text-white text-lg">Loading...</p>
              ) : (
                <p className="text-white text-xl">
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
          <img
            src={myImg}
            alt=""
            className="absolute bottom-0 right-0 m-4 w-72 h-48"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
