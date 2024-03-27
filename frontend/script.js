function evolve() {
    const usage = document.getElementById('usage').value;
    const style = document.getElementById('style').value;
    const budget = document.getElementById('budget').value;
    
    const data = {
        usage: usage,
        style: style,
        budget: parseInt(budget),
        population_size: 100,
        generations: 1000
    };

    console.log(data)
    console.log(JSON.stringify(data), 'kuy')

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
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p>Best Individual: ${JSON.stringify(result.best_individual)}</p>
        <p>Total Price: ${result.total_price}</p>
        <p>Fitness: ${result.fitness}</p>
    `;
}
