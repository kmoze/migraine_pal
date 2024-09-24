import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import migraine from '../assets/headache_3d.webp';
import styles from './login.module.css';

function Login() {
  return (
    <div className="bg-card-darkModeSecondary w-full flex">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <h2 className="text-4xl text-white font-custom">MigrainePal</h2>
        <Link to={'/'}>
          <Button className="bg-card-coolorsSecondary hover:bg-card-coolorsAccent dark:text-card-lightMode px-20 mt-5">
            Log In
          </Button>
        </Link>
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
