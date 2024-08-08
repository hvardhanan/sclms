'use client'
import { useState, useEffect } from 'react';
import { fetchStreetLights } from '../lib/fetchStreetLights';


const Dashboard = () => {
  const [streetLights, setStreetLights] = useState([]);
  const [newLight, setNewLight] = useState({
    id: '',
    dateOfFixing: '',
    intensity: '',
    workingCondition: true
  });

  useEffect(() => {
    const fetchStreetLights = async () => {
      const res = await fetch('/api/streetlights');
      const data = await res.json();
      setStreetLights(data);
    };

    fetchStreetLights();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLight((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/streetlights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newLight)
    });

    if (res.ok) {
      const newLightData = await res.json();
      setStreetLights((prev) => [...prev, newLightData]);
      setNewLight({
        id: '',
        dateOfFixing: '',
        intensity: '',
        workingCondition: true
      });
    }
  };

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

      <h2>Create New Light</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            name="id"
            value={newLight.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date of Fixing:</label>
          <input
            type="date"
            name="dateOfFixing"
            value={newLight.dateOfFixing}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Intensity:</label>
          <input
            type="number"
            name="intensity"
            value={newLight.intensity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Working Condition:</label>
          <select
            name="workingCondition"
            value={newLight.workingCondition}
            onChange={(e) => setNewLight({ ...newLight, workingCondition: e.target.value === 'true' })}
          >
            <option value="true">Working</option>
            <option value="false">Not Working</option>
          </select>
        </div>
        <button type="submit">Create Light</button>
      </form>
    </div>
  );
};

export default Dashboard;
