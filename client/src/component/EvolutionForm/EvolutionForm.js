import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
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
    const [cpuBrand, setCpuBrand] = useState('');
    const [selectedGPUBrands, setSelectedGPUBrands] = useState([]);
    const [selectedGPUChipsetBrands, setSelectedGPUChipsetBrands] = useState([]);

    useEffect(() => {
        let totalPriceChartInstance = null
        let fitnessChartInstance = null
        let cpuChartInstance = null
        let gpuChartInstance = null
        let casingChartInstance = null
        let motherboardChartInstance = null
        let psuChartInstance = null
        let ramChartInstance = null

        if (result && result.generation_data && result.generation_data.length > 0) {
            const labels = result.generation_data.map(data => data.generation);
            const fitnessValues = result.generation_data.map(data => data.best_fitness);
            const totalPriceValues = result.generation_data.map(data => data.total_price);

            console.log(result.generation_data)

            const totalPriceCtx = document.getElementById('totalPriceChart');
            const fitnessCtx = document.getElementById('fitnessChart');
            const cpuCtx = document.getElementById('cpuChart');
            const gpuCtx = document.getElementById('gpuChart');
            const casingCtx = document.getElementById('casingChart');
            const motherboardCtx = document.getElementById('motherboardChart');
            const psuCtx = document.getElementById('psuChart');
            const ramCtx = document.getElementById('ramChart');

            const cpuData = {};
            const gpuData = {};
            const casingData = {}
            const motherboardData = {}
            const psuData = {}
            const ramData = {}

            result.generation_data.forEach(data => {
                const cpuName = data.best_individual.CPU.name;
                if (cpuData[cpuName]) {
                    cpuData[cpuName].push(data.best_individual.CPU.amount);
                } else {
                    cpuData[cpuName] = [data.best_individual.CPU.amount];
                }
            });

            result.generation_data.forEach(data => {
                const gpuName = data.best_individual.GPU.name
                if (gpuData[gpuName]) {
                    gpuData[gpuName].push(data.best_individual.GPU.amount);
                } else {
                    gpuData[gpuName] = [data.best_individual.GPU.amount]
                }
            })

            result.generation_data.forEach(data => {
                const casingName = data.best_individual.Casing.name;
                if (casingData[casingName]) {
                    casingData[casingName].push(data.best_individual.Casing.amount);
                } else {
                    casingData[casingName] = [data.best_individual.Casing.amount];
                }
            });

            console.log(casingData)

            result.generation_data.forEach(data => {
                const motherboardName = data.best_individual.Motherboard.name;
                if (motherboardData[motherboardName]) {
                    motherboardData[motherboardName].push(data.best_individual.Motherboard.amount);
                } else {
                    motherboardData[motherboardName] = [data.best_individual.Motherboard.amount];
                }
            });

            result.generation_data.forEach(data => {
                const psuName = data.best_individual.PSU.name;
                if (psuData[psuName]) {
                    psuData[psuName].push(data.best_individual.PSU.amount);
                } else {
                    psuData[psuName] = [data.best_individual.PSU.amount];
                }
            });

            result.generation_data.forEach(data => {
                const ramName = data.best_individual.RAM.name;
                if (ramData[ramName]) {
                    ramData[ramName].push(data.best_individual.RAM.amount);
                } else {
                    ramData[ramName] = [data.best_individual.RAM.amount];
                }
            });


            if (totalPriceChartInstance) {
                totalPriceChartInstance.destroy();
            }

            if (fitnessChartInstance) {
                fitnessChartInstance.destroy();
            }

            if (cpuChartInstance) {
                cpuChartInstance.destroy();
            }

            if (gpuChartInstance) {
                gpuChartInstance.destroy();
            }

            if (casingChartInstance) {
                casingChartInstance.destroy()
            }

            if (motherboardChartInstance) {
                motherboardChartInstance.destroy()
            }

            if (psuChartInstance) {
                psuChartInstance.destroy()
            }

            if (ramChartInstance) {
                ramChartInstance.destroy()
            }

            if (cpuCtx) {
                cpuChartInstance = new Chart(cpuCtx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(cpuData),
                        datasets: [{
                            label: 'CPU Result',
                            data: Object.values(cpuData).map(cpuAmounts => cpuAmounts.length),
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            if (totalPriceCtx) {
                totalPriceChartInstance = new Chart(totalPriceCtx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total Price',
                            data: totalPriceValues,
                            backgroundColor: 'rgba(255, 99, 132, 0.8)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            console.log(totalPriceCtx)

            if (fitnessCtx) {
                fitnessChartInstance = new Chart(fitnessCtx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Best Fitness',
                            data: fitnessValues,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            console.log(fitnessCtx)

            if (gpuCtx) {
                gpuChartInstance = new Chart(gpuCtx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(gpuData),
                        datasets: [{
                            label: 'GPU Result',
                            data: Object.values(gpuData).map(gpuAmounts => gpuAmounts.length),
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            console.log(gpuCtx)

            if (casingCtx) {
                casingChartInstance = new Chart(casingCtx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(casingData),
                        datasets: [{
                            label: 'Casing Result',
                            data: Object.values(casingData).map(casingAmount => casingAmount.length),
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            console.log(casingCtx)

            if (motherboardCtx) {
                motherboardChartInstance = new Chart(motherboardCtx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(motherboardData),
                        datasets: [{
                            label: 'Motherbaord Result',
                            data: Object.values(motherboardData).map(motherboardAmount => motherboardAmount.length),
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            console.log(motherboardCtx)

            if (psuCtx) {
                psuChartInstance = new Chart(psuCtx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(psuData),
                        datasets: [{
                            label: 'PSU Result',
                            data: Object.values(psuData).map(psuAmount => psuAmount.length),
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            console.log(psuCtx)

            if (ramCtx) {
                ramChartInstance = new Chart(ramCtx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(ramData),
                        datasets: [{
                            label: 'RAM Result',
                            data: Object.values(ramData).map(ramAmount => ramAmount.length),
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            console.log(ramCtx)

        } else {
            const totalPriceCtx = document.getElementById('totalPriceChart');
            const fitnessCtx = document.getElementById('fitnessChart');
            const cpuCtx = document.getElementById('cpuChart');
            const gpuCtx = document.getElementById('gpuChart')
            const casingCtx = document.getElementById('casingChart');
            const motherboardCtx = document.getElementById('motherboardChart');
            const psuCtx = document.getElementById('psuChart');
            const ramCtx = document.getElementById('ramChart');


            if (totalPriceCtx) {
                const ctxParent = totalPriceCtx.parentNode;
                ctxParent.removeChild(totalPriceCtx);
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'totalPriceChart';
                ctxParent.appendChild(newCanvas);
            }

            if (fitnessCtx) {
                const ctxParent = fitnessCtx.parentNode;
                ctxParent.removeChild(fitnessCtx);
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'fitnessChart';
                ctxParent.appendChild(newCanvas);
            }

            if (cpuCtx) {
                const ctxParent = cpuCtx.parentNode;
                ctxParent.removeChild(cpuCtx);
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'cpuChart';
                ctxParent.appendChild(newCanvas);
            }

            if (gpuCtx) {
                const ctxParent = gpuCtx.parentNode;
                ctxParent.removeChild(gpuCtx);
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'gpuChart';
                ctxParent.appendChild(newCanvas);
            }

            if (casingCtx) {
                const ctxParent = casingCtx.parentNode;
                ctxParent.removeChild(casingCtx);
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'casingChart';
                ctxParent.appendChild(newCanvas);
            }

            if (motherboardCtx) {
                const ctxParent = motherboardCtx.parentNode;
                ctxParent.removeChild(motherboardCtx);
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'motherboardChart';
                ctxParent.appendChild(newCanvas);
            }

            if (psuCtx) {
                const ctxParent = psuCtx.parentNode;
                ctxParent.removeChild(psuCtx);
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'psuChart';
                ctxParent.appendChild(newCanvas);
            }

            if (ramCtx) {
                const ctxParent = ramCtx.parentNode;
                ctxParent.removeChild(ramCtx);
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'ramChart';
                ctxParent.appendChild(newCanvas);
            }

        }

        return () => {
            if (totalPriceChartInstance) {
                totalPriceChartInstance.destroy();
            }

            if (fitnessChartInstance) {
                fitnessChartInstance.destroy();
            }

            if (cpuChartInstance) {
                cpuChartInstance.destroy();
            }

            if (gpuChartInstance) {
                gpuChartInstance.destroy();
            }

            if (casingChartInstance) {
                casingChartInstance.destroy()
            }

            if (motherboardChartInstance) {
                motherboardChartInstance.destroy()
            }

            if (psuChartInstance) {
                psuChartInstance.destroy()
            }

            if (ramChartInstance) {
                ramChartInstance.destroy()
            }
        };
    }, [result]);

    function evolve() {
        setLoading(true);

        const data = {
            usage,
            style,
            budget: parseInt(budget),
            cpuBrand,
            selectedGPUBrands,
            selectedGPUChipsetBrands,
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

    function handleCPUCheckboxChange(event) {
        const { id, checked } = event.target;
        console.log('Checkbox ID:', id); // Log the checkbox ID
        console.log('Checked:', checked); // Log whether the checkbox is checked or not

        const brand = event.target.value;

        setCpuBrand(checked ? brand : '');

        const otherCheckboxId = id === 'intel' ? 'amd' : 'intel';
        document.getElementById(otherCheckboxId).checked = false;
    }

    function handleGPUCheckboxChange(event) {
        const brand = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectedGPUBrands(prevBrands => [...prevBrands, brand]);
        } else {
            setSelectedGPUBrands(prevBrands => prevBrands.filter(selectedBrand => selectedBrand !== brand));
        }
    }

    function handleGPUChipsetCheckboxChange(event) {
        const brand = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectedGPUChipsetBrands(prevBrands => [...prevBrands, brand]);
        } else {
            setSelectedGPUChipsetBrands(prevBrands => prevBrands.filter(selectedBrand => selectedBrand !== brand));
        }
    }

    return (
        <div className="evolution-form">
            <h1>PC Builder</h1>
            <div className="form-group">
                <label htmlFor="usage">Usage:</label>
                <select id="usage" value={usage} onChange={(e) => setUsage(e.target.value)}>
                    <option value="">Select Usage</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Streaming/Editing">Streaming/Editing</option>
                    <option value="Office/Browsing">Office/Browsing</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="style">Style:</label>
                <select id="style" value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option value="">Select style</option>
                    <option value="Gamer">Gamer</option>
                    <option value="Minimalist">Minimalist</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="budget">Budget:</label>
                <input type="number" id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Enter budget" />
            </div>
            <label htmlFor="cpuBrand" class="cpu-brand-label">CPU Brand:</label>
            <div>
                <div className="checkbox-bar">
                    <div className="checkbox-group">
                        <label htmlFor="intel">Intel</label>
                        <input type="checkbox" id="intel" value="Intel" onChange={handleCPUCheckboxChange} />
                    </div>
                    <div className="checkbox-group">
                        <label htmlFor="amd">AMD</label>
                        <input type="checkbox" id="amd" value="AMD" onChange={handleCPUCheckboxChange} />
                    </div>
                </div>
            </div>

            <label htmlFor="gpuBrand" class="gpu-brand-label">GPU Brand:</label>
            <div className="checkbox-bar">
                {[
                    "AMD", "Power color", "Asrock", "Sapphire", "Galax",
                    "GIGABYTE", "ZOTAC", "MSI", "COLORFUL", "INNO3D",
                    "PNY", "NVIDIA"
                ].map((brand) => (
                    <div className="checkbox-group" key={brand}>
                        <label htmlFor={brand}>{brand}</label>
                        <input
                            type="checkbox"
                            id={brand.toLowerCase()}
                            value={brand}
                            onChange={handleGPUCheckboxChange}
                        />
                    </div>
                ))}
            </div>

            <label htmlFor="gpuChipsetBrand" class="chipset-brand-label">GPU Chipset Brand:</label>
            <div className="checkbox-bar">
                {[
                    "AMD", "NVIDIA", "Intel"
                ].map((brand) => (
                    <div className="checkbox-group" key={brand}>
                        <label htmlFor={brand}>{brand}</label>
                        <input
                            type="checkbox"
                            id={brand.toLowerCase()}
                            value={brand}
                            onChange={handleGPUChipsetCheckboxChange}
                        />
                    </div>
                ))}
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
            <div className="chart-container">
                <canvas id="totalPriceChart"></canvas>
                <canvas id="fitnessChart"></canvas>
                <canvas id="cpuChart"></canvas>
                <canvas id="gpuChart"></canvas>
                <canvas id="casingChart"></canvas>
                <canvas id="motherboardChart"></canvas>
                <canvas id="ramChart"></canvas>
                <canvas id="psuChart"></canvas>
            </div>
        </div>
    );
}

export default EvolutionForm;
