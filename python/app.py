from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# Define components and other global variables
components = {
    "CPU": [
        {"name": "CPU1", "base_clock": 3.5, "cores": 4, "multi_threaded": False, "socket": "Socket1", "price": 200},
        {"name": "CPU2", "base_clock": 3.0, "cores": 8, "multi_threaded": True, "socket": "Socket2", "price": 300}
    ],
    "RAM": [
        {"name": "RAM1", "capacity": 8, "rgb": True, "price": 100},
        {"name": "RAM2", "capacity": 16, "rgb": False, "price": 150}
    ],
    "GPU": [
        {"name": "GPU1", "core_clock": 1400, "vram": 6, "price": 400},
        {"name": "GPU2", "core_clock": 1200, "vram": 8, "price": 500}
    ],
    "Motherboard": [
        {"name": "Motherboard1", "formfactor": "ATX", "socket": "Socket1", "max_memory": 16, "price": 150},
        {"name": "Motherboard2", "formfactor": "Mini-ITX", "socket": "Socket2", "max_memory": 32, "price": 200}
    ],
    "Casing": [
        {"name": "Casing1", "formfactor": "ATX", "rgb": True, "price": 80},
        {"name": "Casing2", "formfactor": "Mini-ITX", "rgb": False, "price": 60}
    ],
    "PSU": [
        {"name": "PSU1", "wattage": 500, "price": 80},
        {"name": "PSU2", "wattage": 600, "price": 100}
    ]
}

# budget = 1000
population_size = 100
generations = 1000


def getRandomComponents():
    individual = {}
    for component, options in components.items():
        individual[component] = random.choice(options)
    return individual


def calculateFitness(individual, usage, style, budget):
    total_price = sum(component["price"] for component in individual.values())
    fitness = 1 / (1 + abs(budget - total_price))
    
    cpu = individual["CPU"]
    motherboard = individual["Motherboard"]
    casing = individual["Casing"]
    ram = individual["RAM"]
    gpu = individual["GPU"]
    psu = individual["PSU"]
    
    if (
        (motherboard["formfactor"] == casing["formfactor"]) and 
        (motherboard["socket"] == cpu["socket"]) and 
        (ram["capacity"] <= motherboard["max_memory"]) and 
        # (psu["wattage"] >= cpu["wattage"] + 300) and 
        
        ((usage == "Gaming" and cpu["base_clock"] >= 3.5 and ram["capacity"] >= 8 and gpu["core_clock"] >= 1300) or
         (usage == "Streaming/Editing" and cpu["cores"] >= 6 and cpu["multi_threaded"] and gpu["vram"] >= 4) or
         (usage == "Office/Browsing" and cpu["base_clock"] <= 3.0 and gpu["core_clock"] <= 1300)) and
        
        ((style == "Gamer" and casing["rgb"] and ram["rgb"]) or
         (style == "Minimalist" and not casing["rgb"] and not ram["rgb"]))
    ):
        fitness += 1
    else:
        fitness -= 1
    
    return fitness

def crossover(parent1, parent2):
    child = {}
    for component in components.keys():
        if random.random() < 0.5:
            child[component] = parent1[component]
        else:
            child[component] = parent2[component]
    return child

def mutation(individual):
    mutated_individual = individual.copy()
    component = random.choice(list(components.keys()))
    mutated_individual[component] = random.choice(components[component])
    return mutated_individual


@app.route('/evolve', methods=['POST'])
def evolve_population():
    data = request.get_json() 
    usage = data['usage']
    style = data['style']
    budget = data['budget'] #1000
    population_size = data['population_size'] #100
    generations = data['generations'] #1000
    print(usage)
    population = [getRandomComponents() for _ in range(population_size)]

    for generation in range(generations):
        fitness_values = [(individual, calculateFitness(individual, usage=usage, style=style, budget=budget)) for individual in population]
        population = [individual for individual, _ in sorted(fitness_values, key=lambda x: x[1], reverse=True)] 
        selected_parents = population[:population_size // 2]
        next_generation = []
        for i in range(population_size // 2):
            parent1 = random.choice(selected_parents)
            parent2 = random.choice(selected_parents)
            child = crossover(parent1, parent2)
            if random.random() < 0.1: 
                child = mutation(child)
            next_generation.append(child)
        
        population = next_generation
        
        best_individual, best_fitness = max(fitness_values, key=lambda x: x[1])
        print(f"Generation {generation+1}: Best Fitness: {best_fitness}, Total Price: {sum(option['price'] for option in best_individual.values())}")

    best_individual, best_fitness = max(fitness_values, key=lambda x: x[1])

    result = {
        "best_individual": best_individual,
        "total_price": sum(option['price'] for option in best_individual.values()),
        "fitness": best_fitness
    }

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
