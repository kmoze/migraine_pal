import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const queryClient = new QueryClient();

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
    if (sortedData.length > 0) {
      setMostRecentMigraine(sortedData[0]);
    }
  }

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
        setMostRecentMigraine(null);
      }
    }
  }

  const location = useLocation();
  const showNavbar = location.pathname !== '/login';

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex h-screen">
          {showNavbar && (
            <Navbar
              getMigraines={getMigraines}
              deleteMostRecentMigraine={deleteMostRecentMigraine}
              mostRecentMigraine={mostRecentMigraine}
            />
          )}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard migraines={migraines} />} />
            <Route
              path="/analytics"
              element={<Analytics migraines={migraines} />}
            />
          </Routes>
          <Toaster />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
