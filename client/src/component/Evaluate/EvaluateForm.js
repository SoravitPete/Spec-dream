import React, { useState } from 'react';
import './EvaluateForm.css';

function EvaluateForm({ components }) {
    const [specs, setSpecs] = useState({
        CPU: components.CPU[0],
        RAM: components.RAM[0],
        GPU: components.GPU[0],
        Motherboard: components.Motherboard[0],
        Casing: components.Casing[0],
        PSU: components.PSU[0]
    });
    const [usage, setUsage] = useState('Gaming');
    const [style, setStyle] = useState('Gamer');
    const [budget, setBudget] = useState(1000);
    const [score, setScore] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    specs,
                    usage,
                    style,
                    budget,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to get response from server');
            }
            const data = await response.json();
            setScore(data.score);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to evaluate specs. Please try again.');
        }
    };

    return (
        <div className="evaluate-form">
            <h1>Evaluate System Specs</h1>
            <form onSubmit={handleSubmit}>
                {/* Render dropdowns for each component type */}
                {Object.entries(specs).map(([componentType, selectedComponent]) => (
                    <div className="form-group" key={componentType}>
                        <label htmlFor={componentType}>{componentType}:</label>
                        <select
                            id={componentType}
                            value={selectedComponent.name}
                            onChange={(e) => setSpecs(prevSpecs => ({
                                ...prevSpecs,
                                [componentType]: components[componentType].find(component => component.name === e.target.value)
                            }))}
                        >
                            {components[componentType].map(component => (
                                <option key={component.name} value={component.name}>{component.name}</option>
                            ))}
                        </select>
                    </div>
                ))}
                {/* Input field for usage, style, and budget */}
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
                    <input type="number" id="budget" value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} placeholder="Budget" />
                </div>
                <button type="submit">Evaluate</button>
            </form>
            <div className="report-container">
                <h2 className="report-header">Evaluation Report</h2>
                {score !== null ? (
                    <div>
                        <div className={`report-item ${score.report.budget > 0 ? 'success' : 'failure'}`}>
                            <label>Budget:</label>
                            <p>{score.report.budget}</p>
                        </div>
                        <div className={`report-item ${score.report.compatibility > 0 ? 'success' : 'failure'}`}>
                            <label>Compatibility:</label>
                            <p>{score.report.compatibility}</p>
                        </div>
                        {/* Add more report items as needed */}
                    </div>
                ) : (
                    <p>No evaluation report available</p>
                )}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default EvaluateForm;
