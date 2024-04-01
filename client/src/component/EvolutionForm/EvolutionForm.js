import React, { useState, useEffect } from 'react';
import './EvolutionForm.css';

function EvolutionForm() {
    const [usage, setUsage] = useState('');
    const [style, setStyle] = useState('');
    const [budget, setBudget] = useState('');
    const [result, setResult] = useState(() => {
        const savedResult = getCookie('latestResult');
        return savedResult ? JSON.parse(savedResult) : null;
    });
    const [loading, setLoading] = useState(false); 
    useEffect(() => {
        if (result) {
            setCookie('latestResult', JSON.stringify(result));
        } else {
            setCookie('latestResult', '', -1); 
        }
    }, [result]);

    function evolve() {
        setLoading(true); 

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
            setLoading(false); 
        })
        .catch(error => {
            console.error('Error:', error);
            setLoading(false); 
        });
    }

    function clearResult() {
        setResult(null);
    }

    function setCookie(name, value, days = 7) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }

    function getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
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
                {loading ? 'Loading...' : 'Evolve'}
            </button>
            <span style={{ margin: '0 10px' }}></span>
            <button className="button-34" onClick={clearResult} disabled={!result}>
                Clear
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
