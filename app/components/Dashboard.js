'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eaeaea',
    boxSizing: 'border-box',
  },
  createButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: '1.25rem',
    color: '#333',
  },
  logOutButton: {
    padding: '0.4rem 1rem',
    backgroundColor: '#FF999C',
    color: 'white',
    border: '0.5px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  contentWrapper: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #000',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  th: {
    border: '1px solid #000',
    padding: '8px',
    paddingLeft: '10px',
    backgroundColor: '#334',
    color: '#fff',
    textAlign: 'center',
  },
  td: {
    border: '1px solid #000',
    padding: '8px',
    textAlign: 'center',
    backgroundColor: '#FAF9F6',
    color: '#000',
  },
  footer: {
    padding: '0.5rem',
    borderTop: '2px solid #eaeaea',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    color: 'black',
    boxSizing: 'border-box',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '600px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    color: 'black',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  addButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#E97451',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  deleteButton: {
    padding: '0.1rem 1rem',
    backgroundColor: '#E97451',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  '@media (max-width: 1024px)': {
    container: {
      padding: '0.5rem',
    },
    headerText: {
      fontSize: '1rem',
    },
    createButton: {
      padding: '0.3rem 0.6rem',
      fontSize: '0.875rem',
    },
    table: {
      width: '100%',
    },
    modalContent: {
      width: '80%',
    },
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '0.5rem',
    },
    headerText: {
      fontSize: '1rem',
    },
    createButton: {
      padding: '0.3rem 0.6rem',
      fontSize: '0.875rem',
    },
    table: {
      width: '100%',
    },
    modalContent: {
      width: '90%',
    },
  },
  '@media (max-width: 480px)': {
    container: {
      padding: '0.25rem',
    },
    header: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    createButton: {
      padding: '0.3rem 0.5rem',
      fontSize: '0.75rem',
    },
    headerText: {
      fontSize: '0.875rem',
    },
    table: {
      fontSize: '0.875rem',
    },
    modalContent: {
      width: '95%',
    },
  },
};

const Dashboard = () => {
  const [streetLights, setStreetLights] = useState([]);
  const [editingLight, setEditingLight] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLight, setNewLight] = useState({
    id: '',
    dateOfFixing: '',
    intensity: 0,
    workingCondition: 'Working',
  });

  useEffect(() => {
    const fetchStreetLights = async () => {
      const res = await fetch('/api/streetlights');
      const data = await res.json();
      setStreetLights(data);
    };

    fetchStreetLights();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Make sure the port matches server2.js
  
    socket.on('streetlights', (data) => {
      console.log('Received data:', data); // Debugging line
      setStreetLights(data);
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  

  const handleDelete = async (id) => {
    const res = await fetch(`/api/streetlights/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setStreetLights((prev) => prev.filter((light) => light.id !== id));
    } else {
      console.error('Failed to delete street light');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLight((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/streetlights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLight),
    });

    if (res.ok) {
      const newLight = await res.json();
      setStreetLights((prev) => [...prev, newLight]);
      setNewLight({
        id: '',
        dateOfFixing: '',
        intensity: '',
        workingCondition: true,
      });
    }
  };

  const startEditing = (light) => {
    setEditingLight(light);
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingLight((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.createButton} onClick={handleOpenModal}>
          Create Light
        </button>
        <div style={styles.headerText}>Street Lights Dashboard</div>
        <button style={styles.logOutButton} onClick={handleLogout}>
          Log out
        </button>
      </header>
      <div style={styles.contentWrapper}>
        <main style={styles.main}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Date of Fixing</th>
                <th style={styles.th}>Intensity</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {streetLights.map((light) => (

                <tr key={light.id}>
                  <td style={styles.td}>{light.id}</td>
                  <td style={styles.td}>{light.dateOfFixing}</td>
                  <td style={styles.td}>{light.intensity}</td>
                  <td style={styles.td}>{light.workingCondition}</td>
                  <td style={styles.td}>
                    <button style={styles.deleteButton} onClick={() => handleDelete(light.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      <footer style={styles.footer}>
        <p>Street Light Management System</p>
      </footer>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>{editingLight ? 'Edit Light' : 'Add Light'}</h2>
            <form onSubmit={editingLight ? handleEdit : handleSubmit}>
              <input
                type="text"
                name="id"
                value={newLight.id}
                onChange={handleChange}
                placeholder="ID"
                style={styles.input}
                required
              />
              <input
                type="date"
                name="dateOfFixing"
                value={newLight.dateOfFixing}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="number"
                name="intensity"
                value={newLight.intensity}
                onChange={handleChange}
                placeholder="Intensity"
                style={styles.input}
                required
              />
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.addButton}>
                  {editingLight ? 'Save' : 'Add'}
                </button>
                <button type="button" onClick={handleCloseModal} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;