import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <div className="flex h-screen">
        <Navbar />
        <Dashboard />
      </div>
    </>
  );
}

export default App;
