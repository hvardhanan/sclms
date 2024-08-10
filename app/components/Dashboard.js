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
	const [filter, setFilter] = useState({ location: '' });
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Fetch street lights when the filter changes
	useEffect(() => {
		const fetchStreetLights = async () => {
			const query = new URLSearchParams(filter).toString();  // Convert filter to query string
			const res = await fetch(`/api/streetlights?${query}`); // Append query string to the API endpoint
			const data = await res.json();
			setStreetLights(data); // Update state with filtered data
		};

		fetchStreetLights();
	}, [filter]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchStreetLights = async () => {
        const query = new URLSearchParams(filter).toString();
        const res = await fetch(`/api/streetlights?${query}`);
        const data = await res.json();
        setStreetLights(data);
      };

      fetchStreetLights();
    }, 100);

    return () => clearInterval(interval);
  }, [filter]);


	// Socket connection for real-time updates
	useEffect(() => {
		const socket = io('http://localhost:3001');

		socket.on('streetLightsData', (data) => {
			setStreetLights(data);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleFilterChange = (e) => {
		setFilter({ ...filter, [e.target.name]: e.target.value });  // Update the filter state
	};

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

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleLogout = () => {
		window.location.href = '/api/auth/logout';
	};

	// Filter the streetLights array based on the selected location
	const filteredStreetLights = streetLights.filter(light => {
		if (filter.location) {
			return light.location === filter.location;
		}
		return true; // if no filter is selected, return all
	});

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
			<header style={styles.header}>
				<div>
					<select
						name="location"
						value={filter.location}
						onChange={handleFilterChange}
						style={styles.input}
					>
						<option value="">All Locations</option>
						<option value="Sriperumbudur">Sriperumbudur</option>
						<option value="Location2">Location 2</option>
						<option value="Location3">Location 3</option>
					</select>
				</div>
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
								<th style={styles.th}>Location</th>
								<th style={styles.th}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredStreetLights.length > 0 ? (
								filteredStreetLights.map((light) => (
									<tr key={light.id}>
										<td style={styles.td}>{light.id}</td>
										<td style={styles.td}>{light.dateOfFixing}</td>
										<td style={styles.td}>{light.intensity}</td>
										<td style={styles.td}>{light.workingCondition}</td>
										<td style={styles.td}>{light.location}</td>
										<td style={styles.td}>
											<button style={styles.deleteButton} onClick={() => handleDelete(light.id)}>
												Delete
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td style={styles.td} colSpan="6">No street lights found for this location.</td>
								</tr>
							)}
						</tbody>
					</table>
				</main>
			</div>
			<footer style={styles.footer}>
				<p>Street Light Management System</p>
			</footer>
		</div>
	);
};


export default Dashboard;