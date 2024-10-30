// src/pages/SignUp.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/authService';
import migraine from '../assets/headache_3d.webp';
import { ArrowRight } from 'lucide-react';
import styles from './login.module.css';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.signUp(email, password);
      // Supabase sends a confirmation email by default
      // You might want to show a success message telling users to check their email
      navigate('/login');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during sign up'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card-darkModeSecondary w-full flex">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
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
              {loading ? 'Creating account...' : 'Sign up'}
              <span className="absolute right-5 top-1/2 transform -translate-y-1/2 transition-transform duration-500 ease-in-out group-hover:translate-x-2">
                <ArrowRight w-6 h-6 />
              </span>
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log in
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
