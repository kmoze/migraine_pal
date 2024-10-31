import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from './lib/supabaseClient';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

interface Migraine {
  user_id: string;
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
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    // console.log(user);

    if (!user) return;

    const { data, error } = await supabase
      .from('migraine_logs')
      .select()
      .eq('user_id', user.id); // Filter by user_id

    if (error) {
      console.error('Error fetching migraines:', error);
      return;
    }

    console.log(data);

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

  // useEffect for setting up auth state listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          console.log(event);
          getMigraines();
        } else if (event === 'SIGNED_OUT') {
          console.log(event);
          setMigraines([]);
          setMostRecentMigraine(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
  const showNavbar =
    location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <>
      <AuthProvider>
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
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/dashboard"
                  element={<Dashboard migraines={migraines} />}
                />
                <Route
                  path="/analytics"
                  element={<Analytics migraines={migraines} />}
                />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
