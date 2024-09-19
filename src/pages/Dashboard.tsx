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
          <h2 className="text-2xl italic">Placeholder Text</h2>
        </div>
      </div>
      <div className="flex justify-evenly gap-5 mt-5">
        <div className="bg-card-coolorsAccent shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg">
          <h2 className="text-white text-2xl p-6">Your most common symptoms</h2>
          <ul className="text-white pt-2 flex flex-col items-center justify-center h-1/2">
            {mode(migraines, 'symptoms').map((symptom) => {
              return <li className="capitalize py-1 text-2xl">{symptom}</li>;
            })}
          </ul>
        </div>
        <div className="bg-card-coolorsAccent shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg">
          <h2 className="text-white text-2xl p-6">Your most common triggers</h2>
          <ul className="text-white pt-2 flex flex-col items-center justify-center h-1/2">
            {mode(migraines, 'triggers').map((trigger) => {
              return <li className="capitalize py-1 text-2xl">{trigger}</li>;
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
        <div className="bg-card-coolorsPrimary shadow-md shadow-gray-500 w-1/2 mt-5 rounded-lg">
          <h2 className="text-white text-2xl p-7 text-left">Analytics</h2>
          <h2 className="text-2xl text-white text-center pt-20 italic">
            Placeholder for Analytics Image
          </h2>
        </div>
        <div className="bg-card-coolorsPrimary shadow-md shadow-gray-500 w-1/2 mt-5 rounded-lg">
          <h2 className="text-white text-2xl p-7 text-left">Articles</h2>
          <h2 className="text-2xl text-white text-center pt-20 italic">
            Placeholder for Article Carousel
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
