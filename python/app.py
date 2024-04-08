from flask import Flask, request, jsonify
import random
from flask_cors import CORS
from LLM import textGeneration

app = Flask(__name__)

CORS(app)

def read_components(file_path):
    with open(file_path, 'r') as file:
        components_data = eval(file.read())
    return components_data

components_file_path = '/Users/felixia/Desktop/Spec-dream/data/formatted_data_python.txt'
components = read_components(components_file_path)

system_message = """
I'm here to help you to answer the question in one paragraph with the simple language amd don't repeat the computer setup of the user.
"""

def getRandomComponents(components_filtered):
    individual = {}
    for component, options in components_filtered.items():
        if options:  # Check if options list is not empty
            individual[component] = random.choice(options)
    
    for component in components.keys():
        if component not in individual:
            individual[component] = random.choice(components[component])
    
    return individual

def filter_components(components, usage, style, cpu_brand, gpu_brand, gpu_chipset_brand):
    filtered_components = {}
    cpu_components = components.get("CPU")
    motherboard_components = components.get("Motherboard")
    casing_components = components.get("Casing")
    ram_components = components.get("RAM")
    gpu_components = components.get("GPU")
    psu_components = components.get("PSU")
    
    for psu in psu_components:
        filtered_components.setdefault("PSU", []).append(psu)
    for cpu in cpu_components:
        filtered_components.setdefault("CPU", []).append(cpu)
    for ram in ram_components:
        filtered_components.setdefault("RAM", []).append(ram)
    for motherboard in motherboard_components:
        filtered_components.setdefault("Motherboard", []).append(motherboard)
    for casing in casing_components:
        filtered_components.setdefault("Casing", []).append(casing)
    for gpu in gpu_components:
        filtered_components.setdefault("GPU", []).append(gpu)

    if usage == "Gaming":
        filtered_components["CPU"] = []
        filtered_components["RAM"] = []
        for cpu in cpu_components:
            if cpu.get("base_clock", 0) >= 3.5 and cpu.get("cores", 0) >= 6:
                filtered_components.setdefault("CPU", []).append(cpu)
        for ram in ram_components:
            if ram.get("capacity", 0) >= 8:
                filtered_components.setdefault("RAM", []).append(ram)
    elif usage == "Streaming/Editing":
        filtered_components["CPU"] = []
        filtered_components["GPU"] = []
        for cpu in cpu_components:
            if cpu.get("cores", 0) >= 6:
                filtered_components.setdefault("CPU", []).append(cpu)
        for gpu in gpu_components:
            if gpu.get("vram", 0) >= 4:
                filtered_components.setdefault("GPU", []).append(gpu)
    elif usage == "Office/Browsing":
        filtered_components["CPU"] = []
        for cpu in cpu_components:
            if cpu.get("cores", 0) >= 6:
                filtered_components.setdefault("CPU", []).append(cpu)

    if style == "Gamer":
        filtered_components["Casing"] = []
        for casing in casing_components:
            if casing.get("rgb", False):
                filtered_components.setdefault("Casing", []).append(casing)
    elif style == "Minimalist":
        filtered_components["Casing"] = []
        for casing in casing_components:
            if not casing.get("rgb", False):
                filtered_components.setdefault("Casing", []).append(casing)
    else:
        filtered_components["Casing"] = casing_components
        
    if cpu_brand.lower() == "intel":
        cpu_components = filtered_components["CPU"]
        filtered_components["CPU"] = []
        for cpu in cpu_components:
            if cpu.get("brand") == "Intel" :
                filtered_components.setdefault("CPU", []).append(cpu)
                
    if cpu_brand.lower() == "amd":
        cpu_components = filtered_components["CPU"]
        filtered_components["CPU"] = []
        for cpu in cpu_components:
            if cpu.get("brand") == "AMD" :
                filtered_components.setdefault("CPU", []).append(cpu)
                
    if gpu_brand or gpu_chipset_brand:
        print('test')
        gpu_components = filtered_components["GPU"]
        filtered_components["GPU"] = []
        for gpu in gpu_components:
            print(gpu.get("chipset").lower())
            print(gpu_chipset_brand)
            if gpu.get("brand").lower() in gpu_brand and gpu.get("chipset").lower() in gpu_chipset_brand:
                filtered_components["GPU"].append(gpu)
    
    print(filtered_components['GPU'],'test')

    return filtered_components


def calculateFitness(individual, budget):
    total_price = sum(component["price"] for component in individual.values())
    price_difference = abs(budget - total_price)
    

    if price_difference <=  0:  # If total price is within 10% of budget
        fitness = 1.0  # Highest fitness
    else:
        fitness = 1 / (1 + price_difference)  # Otherwise, inverse proportion to price difference
    
    return fitness

def mutation(individual, budget):
    mutated_individual = individual.copy()
    component = random.choice(list(components.keys()))
    new_component = random.choice(components[component])
    
    current_price = sum(comp['price'] for comp in mutated_individual.values())
    price_difference = budget - current_price
    
    mutation_rate = min(0.1, abs(price_difference) / budget)
    
    if random.random() < mutation_rate:
        if new_component['price'] <= abs(price_difference):
            mutated_individual[component] = new_component
        else:
            mutated_individual[component] = random.choice(components[component])
    
    return mutated_individual

def crossover(parent1, parent2, budget):
    child = {}
    for component in components.keys():
        weight = abs(budget - sum(comp['price'] for comp in parent1.values())) / budget
        if random.random() < 0.5:
            child[component] = parent1[component] if random.random() < weight else parent2[component]
        else:
            child[component] = parent2[component] if random.random() < weight else parent1[component]
    return child

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
    # gpu_score = 10 if gpu["core_clock"] >= 1300 else 1
    # psu_score = 10 if psu["wattage"] >= cpu["wattage"] + 300 else 1

    cpu_power_score = 10 if cpu["cores"] >= 6 and cpu["multi_threaded"] else 1
    gpu_capability_score = 10 if gpu["vram"] >= 4 else 1
    ram_capacity_score = 10 if ram["capacity"] >= 16 else 1

    if (
        (usage == "Gaming" and cpu_score == 10 and ram_score == 10 ) or
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
    # report["GPU Score"] = gpu_score
    # report["PSU Score"] = psu_score
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
    print(data)
    usage = data['usage']
    style = data['style']
    budget = data['budget']
    cpuBrand = data.get('cpuBrand', '').lower()  # Convert to lowercase
    gpuBrand = [brand.lower() for brand in data.get('selectedGPUBrands', [])]  # Convert to lowercase
    gpuChipsetBrand = [brand.lower() for brand in data.get('selectedGPUChipsetBrands', [])]  # Convert to lowercase
    population_size = data['population_size']
    generations = data['generations']

    components_filtered = filter_components(components, usage=usage, style=style, cpu_brand=cpuBrand, gpu_brand=gpuBrand, gpu_chipset_brand=gpuChipsetBrand)

    generation_data = []
    best_individual_so_far = None
    best_fitness_so_far = 0.0

    print(data)

    for generation in range(generations):
        if best_individual_so_far is not None:
            population = [best_individual_so_far] + [getRandomComponents(components_filtered) for _ in range(population_size - 1)]
        else:
            population = [getRandomComponents(components_filtered) for _ in range(population_size)]
        
        fitness_values = [(individual, calculateFitness(individual, budget=budget)) for individual in population]
        population = [individual for individual, _ in sorted(fitness_values, key=lambda x: x[1], reverse=True)] 
        selected_parents = population[:population_size // 2]
        next_generation = []
        for i in range(population_size // 2):
            parent1 = random.choice(selected_parents)
            parent2 = random.choice(selected_parents)
            child = crossover(parent1, parent2, budget=budget)
            if random.random() < 0.1: 
                child = mutation(child, budget=budget)
            next_generation.append(child)
    
        population = next_generation
    
        best_individual, best_fitness = max(fitness_values, key=lambda x: x[1])

        generation_data.append({
            "generation": generation+1,
            "best_fitness": best_fitness,
            "total_price": sum(option['price'] for option in best_individual.values()),
            "best_individual": best_individual
        })

        if best_fitness >= best_fitness_so_far:
            best_fitness_so_far = best_fitness
            best_individual_so_far = best_individual
        else:
            best_individual = best_individual_so_far
            best_fitness = best_fitness_so_far

        if best_fitness == 1.0:
            break

    result = {
        "best_individual": best_individual,
        "total_price": sum(option['price'] for option in best_individual.values()),
        "fitness": best_fitness,
        "generation_data": generation_data  # Include generation-wise data in the result
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
    specs = data.get('specs', {})
    usage = data.get('usage', '')
    style = data.get('style', '')
    budget = int(data.get('budget', 0))

    score = calculate_score(specs, usage, style, budget)

    result = {
        "score": score
    }

    return jsonify(result)


@app.route('/textGeneration', methods=['POST'])
def text_generation():
    global result_string 
    data = request.get_json()
    message = data['message']

    print(result_string)
    print(message)
    
    res = textGeneration(system_message, message, result_string)
    
    try:
        chat_completion_message = res.choices[0].message
        content = chat_completion_message.content
    except Exception as e: 
        content = "This question is not about the computer. Please fix your sentence by adding a keyword like 'computer' or 'spec'."

    return content

if __name__ == '__main__':
    app.run(debug=True)
