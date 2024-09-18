import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

const supabase = createClient(
  'https://htwnzkiehjbpzjehiuyj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0d256a2llaGpicHpqZWhpdXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzY3ODUsImV4cCI6MjA0MjI1Mjc4NX0.EUks9ef2RCXg1u3CxNYbd5RF1ljH2AFMXRKo7BqAjVk'
);

interface Migraine {
  id: number;
  date: Date;
  symptoms: string[];
  triggers: string[];
  pain: number;
}

function App() {
  const [migraines, setMigraines] = useState<Migraine[]>([]);

  useEffect(() => {
    getMigraines();
  }, []);

  async function getMigraines() {
    const { data } = await supabase.from('migraine_logs').select();
    setMigraines(data || []);
  }

  return (
    <>
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
      <div className="flex h-screen">
        <Navbar getMigraines={getMigraines} />
        <Dashboard />
      </div>
    </>
  );
}

export default App;
