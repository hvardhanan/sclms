// app/page.js
import Dashboard from './components/Dashboard';

require('dotenv').config();

export default function HomePage() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
