interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
}

interface DashboardProps {
  migraines: Migraine[];
  avgPain: number; // Define the type for avgPain
}

function Dashboard({ migraines, avgPain }: DashboardProps) {
  return (
    <div className="flex-grow p-4 bg-custom-gradient">
      <div className="bg-card-dashboard shadow-lg shadow-gray-500 w-full h-56 rounded-xl">
        <h2 className="text-white text-3xl p-5">Welcome to MigrainePal 👋🏻</h2>
      </div>
      <div className="flex justify-evenly gap-5 mt-5">
        <div className="bg-card-dashboard shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg">
          <h2 className="text-white text-2xl p-7">Your most common symptom</h2>
        </div>
        <div className="bg-card-dashboard shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg">
          <h2 className="text-white text-2xl p-7">Your most common trigger</h2>
        </div>
        <div className="bg-card-dashboard shadow-md shadow-gray-500 w-1/3 h-60 rounded-lg">
          <h2 className="text-white text-2xl p-7">Your average pain level</h2>
          {avgPain ? (
            <span className="text-2xl text-white">{avgPain}</span>
          ) : (
            <span className="text-2xl text-white">Loading...</span>
          )}
        </div>
      </div>
      <ul>
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
      </ul>
    </div>
  );
}

export default Dashboard;
