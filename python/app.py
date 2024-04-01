from flask import Flask, request, jsonify
import random
from flask_cors import CORS
from LLM import textGeneration

app = Flask(__name__)

CORS(app)

# Define components and other global variables
components = {
    "CPU": [
        {"name": "CPU1", "base_clock": 3.5, "cores": 4, "multi_threaded": False, "socket": "Socket1", "price": 200, "wattage": 100},
        {"name": "CPU2", "base_clock": 3.0, "cores": 8, "multi_threaded": True, "socket": "Socket2", "price": 300, "wattage": 100}
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


system_message = """
As a text generation assistant, your role is to analyze and elucidate the specifications provided by the user
regarding their computer setup. We'll delve into the advantages and disadvantages of the components chosen.
Let's begin by dissecting the configuration."""

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

    total_price = int(total_price)
    budget = int(budget)
    
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

def calculate_score(specs, usage, style, budget):
    cpu = specs["CPU"]
    motherboard = specs["Motherboard"]
    casing = specs["Casing"]
    ram = specs["RAM"]
    gpu = specs["GPU"]
    psu = specs["PSU"]
    
    total_price = sum(component["price"] for component in specs.values())

    factor_scores = {
        "budget": 0,
        "compatibility": 0,
        "performance": 0,
        "style": 0
    }
    
    if total_price > budget:
        factor_scores["budget"] = 1
    else:
        factor_scores["budget"] = min(10, 10 * total_price / budget) 
    
    cpu_score = 10 if cpu["base_clock"] >= 3.5 else 1
    motherboard_score = 10 if motherboard["formfactor"] == casing["formfactor"] and motherboard["socket"] == cpu["socket"] and ram["capacity"] <= motherboard["max_memory"] else 1
    ram_score = 10 if ram["capacity"] >= 8 else 1
    gpu_score = 10 if gpu["core_clock"] >= 1300 else 1
    psu_score = 10 if psu["wattage"] >= cpu["wattage"] + 300 else 1

    cpu_power_score = 10 if cpu["cores"] >= 6 and cpu["multi_threaded"] else 1
    gpu_capability_score = 10 if gpu["vram"] >= 4 else 1
    ram_capacity_score = 10 if ram["capacity"] >= 16 else 1

    if (
        (usage == "Gaming" and cpu_score == 10 and ram_score == 10 and gpu_score == 10) or
        (usage == "Streaming/Editing" and cpu_power_score == 10 and gpu_capability_score == 10) or
        (usage == "Office/Browsing" and cpu["base_clock"] <= 3.0 and ram_capacity_score == 10)
    ):
        factor_scores["compatibility"] = 10

    if factor_scores["compatibility"] == 10:
        performance_factors = [cpu_power_score, gpu_capability_score, ram_capacity_score]
        if all(score == 10 for score in performance_factors):
            factor_scores["performance"] = 10
        else:
            factor_scores["performance"] = min(10, sum(performance_factors) / len(performance_factors))
    
    casing_score = 10 if (style == "Gamer" and casing["rgb"]) or (style == "Minimalist" and not casing["rgb"]) else 1
    ram_style_score = 10 if (style == "Gamer" and ram["rgb"]) or (style == "Minimalist" and not ram["rgb"]) else 1

    if casing_score == 10 and ram_style_score == 10:
        factor_scores["style"] = 10
    else:
        factor_scores["style"] = 1
    
    weights = {
        "budget": 0.3,
        "compatibility": 0.3,
        "performance": 0.2,
        "style": 0.2
    }
    weighted_scores = {factor: weights[factor] * score for factor, score in factor_scores.items()}
    overall_score = min(10, sum(weighted_scores.values()) / sum(weights.values()))
    
    report = {}
    report["budget"] = f"The total price is ${total_price} which {'exceeds' if total_price > budget else 'meets or is within'} the budget of ${budget}. with score {factor_scores['budget']}"
    report["compatibility"] = f"The components are compatible with each other. with score {factor_scores['compatibility']}"
    report["performance"] = f"The system meets the performance criteria. with score {factor_scores['performance']}"
    report["style"] = f"The chosen style {'matches' if factor_scores['style'] == 10 else 'does not match'} the desired style ({style}). with score {factor_scores['style']}"
    
    report["CPU Score"] = cpu_score
    report["Motherboard Score"] = motherboard_score
    report["RAM Score"] = ram_score
    report["GPU Score"] = gpu_score
    report["PSU Score"] = psu_score
    report["Casing Style Score"] = casing_score
    report["RAM Style Score"] = ram_style_score

    return {
        "score": overall_score,
        "report": report
    }

@app.route('/evolve', methods=['POST'])
def evolve_population():
    global result_string
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
        print(f"Generation {generation+1}: Best Fitness: {best_fitness}, Total Price: {sum(option['price'] for option in best_individual.values())}, best individual: {best_individual}")

    best_individual, best_fitness = max(fitness_values, key=lambda x: x[1])

    result = {
        "best_individual": best_individual,
        "total_price": sum(option['price'] for option in best_individual.values()),
        "fitness": best_fitness
    }

    formatted_individual = "\n".join([
        f"{component}:\n"
        f"  Name: {details['name']}\n"
        f"  Base Clock: {details.get('base_clock', 'N/A')} GHz\n"
        f"  Cores: {details.get('cores', 'N/A')}\n"
        f"  Multi-threaded: {'Yes' if details.get('multi_threaded', False) else 'No'}\n"
        f"  Socket: {details.get('socket', 'N/A')}\n"
        f"  Wattage: {details.get('wattage', 'N/A')}W\n"
        f"  Price: ${details.get('price', 'N/A')}"
        for component, details in best_individual.items()
    ])

    result_string = f"""
    Best Individual:
    {formatted_individual}

    Total Price: ${result['total_price']}
    Fitness: {result['fitness']}
    """
    print(result_string)

    return jsonify(result)

@app.route('/evaluate', methods=['POST'])
def evaluate_specs():
    data = request.json
    print(data)  # Print received data for debugging purposes
    specs = data.get('specs', {})
    usage = data.get('usage', '')
    style = data.get('style', '')
    budget = int(data.get('budget', 0))  # Convert budget to integer, defaulting to 0 if not provided

    score = calculate_score(specs, usage, style, budget)

    result = {
        "score": score
    }

    return jsonify(result)


@app.route('/textGeneration', methods=['POST'])
def text_generation():
    global result_string  # Access the global variable
    data = request.get_json()
    message = data['message']

    print(result_string)
    print(message)

    if result_string:
        result_string += message

    print(result_string)

    res = textGeneration(system_message, result_string)

    chat_completion_message = res.choices[0].message
    content = chat_completion_message.content

    return content

if __name__ == '__main__':
    app.run(debug=True)
