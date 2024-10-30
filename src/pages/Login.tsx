import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import migraine from '../assets/headache_3d.webp';
import styles from './login.module.css';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { authService } from '@/utils/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.signIn(email, password);
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card-darkModeSecondary w-full flex">
      {/* <div className="w-1/2 flex flex-col justify-center items-center">
        <h2 className="text-4xl text-white font-custom">MigrainePal</h2>
        <Link to={'/'}>
          <Button className="relative text-lg bg-card-coolorsSecondary hover:bg-card-coolorsAccent dark:text-card-lightMode px-20 py-5 mt-5 group">
            Login
            <span className="absolute right-5 top-1/2 transform -translate-y-1/2 transition-transform duration-500 ease-in-out group-hover:translate-x-2">
              <ArrowRight w-6 h-6 />
            </span>
          </Button>
        </Link>
      </div> */}
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="relative text-lg flex w-full bg-card-coolorsSecondary hover:bg-card-coolorsAccent dark:text-card-lightMode px-20 py-5 mt-5 group"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              <span className="absolute right-5 top-1/2 transform -translate-y-1/2 transition-transform duration-500 ease-in-out group-hover:translate-x-2">
                <ArrowRight w-6 h-6 />
              </span>
            </Button>
            {/* <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button> */}
          </div>
        </form>

        <div className="text-sm text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <div className="flex w-1/2 flex-col justify-center items-center">
        <img
          className={styles.migraineImg}
          src={migraine}
          alt="migraine graphic"
        />
      </div>
    </div>
  );
}

export default Login;
