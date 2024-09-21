import { useEffect, useState } from 'react';
import myImage from '../assets/analytics.png';

import { OctagonAlert } from 'lucide-react';

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
  dt: number; // Unix timestamp
  dt_txt: string; // Formatted date string
  main: {
    temp: number; // Temperature
  };
}

interface WeatherData {
  list: Forecast[]; // List of forecast data
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
  // const [humidityStatus, setHumidityStatus] = useState('');

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

  console.log(weatherData);

  function humidityAnalysis(array: WeatherData): string {
    let list = array.list;
    let over70 = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].main.humidity > 70) {
        over70.push(list[i]);
      }
    }

    if (over70.length >= 30) {
      return 'HIGH';
    } else if (over70.length >= 20 && over70.length <= 29) {
      return 'MODERATE';
    } else {
      return 'MILD';
    }
  }

  function tempChangeAnalysis(array: WeatherData) {
    if (array && array.list.length > 0) {
      const forecastData = array.list;
      const organizedData: { [date: string]: { [time: string]: number } } = {};

      // Organize the forecast data by date and time
      forecastData.forEach((forecast) => {
        const dt = new Date(forecast.dt_txt); // Use dt_txt for date and time
        const dateStr = dt.toISOString().split('T')[0]; // Extract YYYY-MM-DD
        const timeStr = dt.toTimeString().split(' ')[0].substring(0, 5); // Extract HH:MM

        if (!organizedData[dateStr]) {
          organizedData[dateStr] = {};
        }

        // Store the temperature in the organizedData object
        organizedData[dateStr][timeStr] = forecast.main.temp;
      });

      const comparisonTimes = ['06:00', '12:00', '18:00'];
      const tempDrops: { [date: string]: { [time: string]: string } } = {};

      const dates = Object.keys(organizedData).sort();

      // Compare temperatures between consecutive days
      dates.forEach((date, index) => {
        if (index === 0) return; // Skip the first date since there's no previous day to compare

        const prevDate = dates[index - 1]; // Previous day's date
        tempDrops[date] = {};

        comparisonTimes.forEach((time) => {
          if (organizedData[date][time] && organizedData[prevDate][time]) {
            const tempToday = organizedData[date][time];
            const tempYesterday = organizedData[prevDate][time];
            const drop = tempYesterday - tempToday;
            tempDrops[date][time] = drop.toFixed(2); // Save the temperature drop as a string with 2 decimal places
          }
        });
      });

      // Log or return the results
      return tempDrops;
    }
  }

  function tempChange(tempChanges) {
    let over5 = [];

    for (let date in tempChanges) {
      let dayTimes = tempChanges[date];
      for (let time in dayTimes) {
        if (Math.abs(Number(dayTimes[time])) >= 5) {
          over5.push(Number(dayTimes[time]));
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

  return (
    <div className="h-full flex flex-col w-full p-4 bg-custom-gradient">
      <div className="flex items-start gap-5">
        <div className="bg-card-coolorsPrimary shadow-lg shadow-gray-500 w-3/4 h-56 rounded-xl p-4 bg-opacity-95">
          <h2 className="text-white text-3xl pt-3 pb-3">
            Welcome to MigrainePal 👋🏻
          </h2>
          <div className="flex justify-around gap-5">
            <h4 className="text-white text-xl p-8 w-1/3 bg-blue-700 bg-opacity-45 mt-2 rounded-sm text-center">
              Lorem, ipsum dolor sit amet consectetur adipisicing.
            </h4>
            <h4 className="text-white text-xl p-8 w-1/3 bg-blue-500 bg-opacity-45 mt-2 rounded-sm text-center">
              Lorem ipsum dolor sit, amet consectetur adipisicing.
            </h4>
            <h4 className="text-white text-xl p-8 w-1/3 bg-sky-500 bg-opacity-45 mt-2 rounded-sm text-center">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit
            </h4>
          </div>
        </div>
        <div className="bg-card-coolorsSecondary shadow-lg shadow-gray-500 p-2 rounded-lg text-white h-56 w-1/4 flex items-center justify-center">
          <h2 className="text-2xl italic">Placeholder for Article Carousel</h2>
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
        <div className="bg-card-coolorsPrimary shadow-md shadow-gray-500 w-1/2 mt-5 rounded-lg">
          <h2 className="text-white text-2xl p-7 text-left">Weather</h2>
          <div className="flex gap-2 mx-8">
            <div className="flex flex-col font-medium leading-none">
              <h2 className="text-white text-xl mb-2">Humidity Forecast:</h2>
              <div className="flex items-center gap-2">
                {loading ? (
                  <p className="text-white text-lg">Loading...</p>
                ) : (
                  <p className="text-white text-lg">
                    {weatherData
                      ? humidityAnalysis(weatherData)
                      : 'Sorry, there seems to be an error...'}
                  </p>
                )}
                <OctagonAlert className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="flex flex-col font-medium leading-none">
              <h2 className="text-white text-xl mb-2">
                Temperate Change Forecast:
              </h2>
              <div className="flex items-center gap-2">
                {loading ? (
                  <p className="text-white text-lg">Loading...</p>
                ) : (
                  <p className="text-white text-lg">
                    {weatherData
                      ? tempChange(tempChangeAnalysis(weatherData))
                      : 'Sorry, there seems to be an error...'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
