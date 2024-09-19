import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
// import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import { Route, Routes } from 'react-router-dom';

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

  // Calculate average pain level
  function averagePainLevel(migraineData: Migraine[]) {
    let painValsOnly = migraineData.map((migraine) => migraine.pain);
    let totalPain = painValsOnly.reduce((accum, currVal) => accum + currVal, 0);
    return totalPain / painValsOnly.length;
  }

  return (
    <>
      <div className="flex h-screen">
        <Navbar getMigraines={getMigraines} />
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                migraines={migraines}
                avgPain={averagePainLevel(migraines)}
              />
            }
          />
          <Route
            path="/analytics"
            element={<Analytics migraines={migraines} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
