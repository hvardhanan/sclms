// components/Dashboard.js
import { useState, useEffect } from 'react';
import { fetchStreetLights } from '../lib/fetchStreetLights';

const Dashboard = () => {
  const [streetLights, setStreetLights] = useState([]);

  useEffect(() => {
    const getStreetLights = async () => {
      const data = await fetchStreetLights();
      setStreetLights(data);
    };

    getStreetLights();
  }, []);

  return (
    <div>
      <h1>Street Light Management Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date of Fixing</th>
            <th>Intensity</th>
            <th>Working Condition</th>
          </tr>
        </thead>
        <tbody>
          {streetLights.map((light) => (
            <tr key={light.id}>
              <td>{light.id}</td>
              <td>{new Date(light.dateOfFixing).toLocaleDateString()}</td>
              <td>{light.intensity}</td>
              <td>{light.workingCondition ? 'Working' : 'Not Working'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
