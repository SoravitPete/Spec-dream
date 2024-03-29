import React, { useState } from 'react';
import './EvolutionForm.css'; // Import your CSS file for styling

function EvolutionForm() {
    const [usage, setUsage] = useState('');
    const [style, setStyle] = useState('');
    const [budget, setBudget] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false); // State variable for loading

    function evolve() {
        setLoading(true); // Set loading to true when evolution starts

        const data = {
            usage,
            style,
            budget: parseInt(budget),
            population_size: 100,
            generations: 1000
        };

        fetch('http://127.0.0.1:5000/evolve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            setResult(result);
            setLoading(false); // Set loading to false when evolution finishes
        })
        .catch(error => {
            console.error('Error:', error);
            setLoading(false); // Set loading to false if there's an error
        });
    }

    return (
        <div className="evolution-form">
            <h1>PC Builder</h1>
            <div className="form-group">
                <label htmlFor="usage">Usage:</label>
                <select id="usage" value={usage} onChange={(e) => setUsage(e.target.value)}>
                    <option value="Gaming">Gaming</option>
                    <option value="Streaming/Editing">Streaming/Editing</option>
                    <option value="Office/Browsing">Office/Browsing</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="style">Style:</label>
                <select id="style" value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option value="Gamer">Gamer</option>
                    <option value="Minimalist">Minimalist</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="budget">Budget:</label>
                <input type="number" id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Enter budget" />
            </div>
            <button className="button-34" onClick={evolve} disabled={loading}>
                {loading ? 'Loading...' : 'Evolve'} {/* Change button text based on loading state */}
            </button>
            {result && (
                <div className="result">
                    <table>
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(result.best_individual).map(([component, details]) => (
                                <tr key={component}>
                                    <td>{component}</td>
                                    <td>
                                        <ul>
                                            {Object.entries(details).map(([property, value]) => (
                                                <li key={property}><strong>{property}:</strong> {value}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>Total Price:</td>
                                <td>{result.total_price}</td>
                            </tr>
                            <tr>
                                <td>Fitness:</td>
                                <td>{result.fitness}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default EvolutionForm;
