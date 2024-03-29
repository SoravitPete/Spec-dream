import React, { useState } from 'react';
import './EvolutionForm.css'; // Import your CSS file for styling

function EvolutionForm() {
    const [usage, setUsage] = useState('');
    const [style, setStyle] = useState('');
    const [budget, setBudget] = useState('');
    const [result, setResult] = useState(null);

    function evolve() {
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
            displayResult(result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function displayResult(result) {
        setResult(result);
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
            <button className="button-34" onClick={evolve}>Evolve</button> {/* Add className */}
            {result && (
                <div className="result">
                    <p>Best Individual: {JSON.stringify(result.best_individual)}</p>
                    <p>Total Price: {result.total_price}</p>
                    <p>Fitness: {result.fitness}</p>
                </div>
            )}
        </div>
    );
}

export default EvolutionForm;
