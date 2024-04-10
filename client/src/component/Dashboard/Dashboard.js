import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // Import the CSS file

function Dashboard() {
    const [accountName, setUsername] = useState('');
    const [userSpec, setUserSpec] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedValue, setSelectedValue] = useState(null); // Track the selected value for modal

    useEffect(() => {
        const storedUsername = localStorage.getItem('accountName');

        if (storedUsername) {
            setUsername(storedUsername);
        }

    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchDataResponse = await fetch(`http://localhost:3000/user?accountName=${accountName}`);
                if (!fetchDataResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                const userData = await fetchDataResponse.json();
                setUserSpec(userData); // Set userSpec to the array of specifications
                setIsLoading(false); // Set loading to false after data is fetched

            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Set loading to false in case of error
            }
        };

        if (accountName) { // Check if accountName is available before fetching data
            fetchData();
        }
    }, [accountName]); // Include accountName in the dependency array

    const handleValueClick = (value) => {
        setSelectedValue(value); // Set the selected value when clicked
    };

    const closeModal = () => {
        setSelectedValue(null); // Reset selected value when modal is closed
    };

    return (
        <div>
            <div className="dashboard-container">
                <h2>User Dashboard</h2>
                {userSpec.map((component, index) => (
                    <div key={index} className="user-table">
                        <h3>{Object.keys(component)[0]}</h3>
                        <table>
                            <tbody>
                                {Object.entries(component[Object.keys(component)[0]]).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className="user-spec-item">{key}</td>
                                        <td className="user-spec-item" onClick={() => handleValueClick(value)}>{JSON.stringify(value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* Modal to display tabular data */}
            {selectedValue && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Detail</h2>
                        <table>
                            <tbody>
                                {Object.entries(selectedValue).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{JSON.stringify(value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
