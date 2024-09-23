import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';

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
  duration: number;
}

function App() {
  const [migraines, setMigraines] = useState<Migraine[]>([]);
  const [mostRecentMigraine, setMostRecentMigraine] = useState<Migraine | null>(
    null
  );

  useEffect(() => {
    getMigraines();
  }, []);

  async function getMigraines() {
    const { data } = await supabase.from('migraine_logs').select();
    const sortedData =
      data?.sort(
        (a: Migraine, b: Migraine) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      ) || [];
    setMigraines(sortedData);
    // setMigraines(data || []);
    if (sortedData.length > 0) {
      setMostRecentMigraine(sortedData[0]); // Set the most recent log
    }
  }

  // Experimenting with deletion function
  async function deleteMostRecentMigraine() {
    if (mostRecentMigraine) {
      const { error } = await supabase
        .from('migraine_logs')
        .delete()
        .eq('id', mostRecentMigraine.id);

      if (!error) {
        setMigraines((prev) =>
          prev.filter((migraine) => migraine.id !== mostRecentMigraine.id)
        );
        setMostRecentMigraine(null); // Clear the most recent migraine after deletion
      }
    }
  }

  console.log(migraines);

  return (
    <>
      <button onClick={deleteMostRecentMigraine} className="w-1/3">
        Delete Most Recent Migraine
      </button>
      <div className="flex h-screen">
        <Navbar getMigraines={getMigraines} />
        <Routes>
          <Route path="/" element={<Dashboard migraines={migraines} />} />
          <Route
            path="/analytics"
            element={<Analytics migraines={migraines} />}
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
