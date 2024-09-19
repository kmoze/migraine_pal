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
    <div className="flex-grow p-4 bg-custom-gradient">
      <div className="flex items-start gap-5">
        <div className="bg-card-dashboard shadow-lg shadow-gray-500 w-3/4 h-56 rounded-xl">
          <h2 className="text-white text-3xl p-5">Welcome to MigrainePal 👋🏻</h2>
        </div>
        <div className="bg-card-dashboard shadow-lg shadow-gray-500 p-2 rounded-lg text-white h-56 w-1/4 flex items-center justify-center">
          <h2 className="text-2xl">Placeholder Text</h2>
        </div>
      </div>
      <div className="flex justify-evenly gap-5 mt-5">
        <div className="bg-card-dashboard shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg">
          <h2 className="text-white text-2xl p-6">Your most common symptoms</h2>
          <ul className="text-white pt-2 flex flex-col items-center justify-center h-1/2">
            {mode(migraines, 'symptoms').map((symptom) => {
              return <li className="capitalize py-1 text-2xl">{symptom}</li>;
            })}
          </ul>
        </div>
        <div className="bg-card-dashboard shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg">
          <h2 className="text-white text-2xl p-6">Your most common triggers</h2>
          <ul className="text-white pt-2 flex flex-col items-center justify-center h-1/2">
            {mode(migraines, 'triggers').map((trigger) => {
              return <li className="capitalize py-1 text-2xl">{trigger}</li>;
            })}
          </ul>
        </div>
        <div className="bg-card-dashboard shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg flex flex-col">
          <h2 className="text-white text-2xl p-7 text-left">
            Your average pain level
          </h2>
          <div className="flex-grow flex items-center justify-center">
            {avgPain ? (
              <span className="text-6xl text-white pb-10">{avgPain}</span>
            ) : (
              <span className="text-2xl text-white pb-10">Loading...</span>
            )}
          </div>
        </div>
      </div>
      {/* <div>
        <p>{mode(migraines)}</p>
        <ul>
          {mode(migraines).map((symptom) => {
            return <li>{symptom}</li>;
          })}
        </ul>
      </div> */}
      {/* <ul>
        {migraines.map((migraine) => (
          <li key={migraine.id} className="mb-4 p-4 border rounded">
            <div>
              <strong>Date:</strong>{' '}
              {new Date(migraine.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div>Pain Level: {migraine.pain}</div>
            <div>
              <strong>Symptoms:</strong>
              <ul>
                {migraine.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Triggers:</strong>
              <ul>
                {migraine.triggers.map((trigger, index) => (
                  <li key={index}>{trigger}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default Dashboard;
