from random import choices, randint, randrange, random, sample
from typing import List, Optional, Callable, Tuple
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

Genome = List[int]
Population = List[Genome]
PopulateFunc = Callable[[], Population]
FitnessFunc = Callable[[Genome], int]
SelectionFunc = Callable[[Population, FitnessFunc], Tuple[Genome, Genome]]
CrossoverFunc = Callable[[Genome, Genome], Tuple[Genome, Genome]]
MutationFunc = Callable[[Genome], Genome]
PrinterFunc = Callable[[Population, int, FitnessFunc], None]


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

def getRandomComponents() -> dict:
    individual = {}
    for component, options in components.items():
        individual[component] = random.choice(options)
    return individual

def calculateFitness(individual: dict, usage: str, style: str, budget: int) -> float:
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

def crossover(parent1: dict, parent2: dict) -> dict:
    child = {}
    for component in components.keys():
        if random.random() < 0.5:
            child[component] = parent1[component]
        else:
            child[component] = parent2[component]
    return child

def mutation(individual: dict) -> dict:
    mutated_individual = individual.copy()
    component = random.choice(list(components.keys()))
    mutated_individual[component] = random.choice(components[component])
    return mutated_individual

def print_stats(population: Population, generation_id: int, fitness_func: FitnessFunc):
    print("GENERATION %02d" % generation_id)
    print("=============")
    print("Population: [%s]" % ", ".join([str(individual) for individual in population]))
    print("Avg. Fitness: %f" % (population_fitness(population, fitness_func) / len(population)))
    sorted_population = sorted(population, key=fitness_func, reverse=True)
    best_individual, best_fitness = sorted_population[0], fitness_func(sorted_population[0])
    print("Best: %s (%f)" % (best_individual, best_fitness))
    worst_individual, worst_fitness = sorted_population[-1], fitness_func(sorted_population[-1])
    print("Worst: %s (%f)" % (worst_individual, worst_fitness))
    print("")

    return best_individual

def generate_genome(length: int) -> Genome:
    return choices([0, 1], k=length)

def generate_population(size: int, genome_length: int) -> Population:
    return [generate_genome(genome_length) for _ in range(size)]

def single_point_crossover(a: Genome, b: Genome) -> Tuple[Genome, Genome]:
    if len(a) != len(b):
        raise ValueError("Genomes a and b must be of same length")

    length = len(a)
    if length < 2:
        return a, b

    p = randint(1, length - 1)
    return a[0:p] + b[p:], b[0:p] + a[p:]

def mutation(genome: Genome, num: int = 1, probability: float = 0.5) -> Genome:
    for _ in range(num):
        index = randrange(len(genome))
        genome[index] = genome[index] if random() > probability else abs(genome[index] - 1)
    return genome

def population_fitness(population: Population, fitness_func: FitnessFunc) -> int:
    return sum([fitness_func(genome) for genome in population])

def selection_pair(population: Population, fitness_func: FitnessFunc) -> Population:
    return sample(
        population=generate_weighted_distribution(population, fitness_func),
            k=2
    )


def generate_weighted_distribution(population: Population, fitness_func: FitnessFunc) -> Population:
    result = []

    for gene in population:
        result += [gene] * int(fitness_func(gene)+1)

    return result


def sort_population(population: Population, fitness_func: FitnessFunc) -> Population:
    return sorted(population, key=fitness_func, reverse=True)


def genome_to_string(genome: Genome) -> str:
    return "".join(map(str, genome))


def run_evolution(
        populate_func: PopulateFunc,
        fitness_func: FitnessFunc,
        fitness_limit: int,
        selection_func: SelectionFunc = selection_pair,
        crossover_func: CrossoverFunc = single_point_crossover,
        mutation_func: MutationFunc = mutation,
        generation_limit: int = 100,
        printer: Optional[PrinterFunc] = None) \
        -> Tuple[Population, int]:
    population = populate_func()

    i = 0
    for i in range(generation_limit):
        population = sorted(population, key=lambda genome: fitness_func(genome), reverse=True)

        if printer is not None:
            printer(population, i, fitness_func)

        if fitness_func(population[0]) >= fitness_limit:
            break

        next_generation = population[0:2]

        for j in range(int(len(population) / 2) - 1):
            parents = selection_func(population, fitness_func)
            offspring_a, offspring_b = crossover_func(parents[0], parents[1])
            offspring_a = mutation_func(offspring_a)
            offspring_b = mutation_func(offspring_b)
            next_generation += [offspring_a, offspring_b]

        population = next_generation

    return population, i


# Add your Flask routes here

@app.route('/evolve', methods=['POST'])
def evolve_population():
    data = request.get_json() 
    usage = data['usage']
    style = data['style']
    budget = data['budget']
    population_size = data['population_size']
    generations = data['generations']
    
    def fitness_func(individual: dict) -> int:
        return calculateFitness(individual, usage, style, budget)

    def populate_func() -> Population:
        return [getRandomComponents() for _ in range(population_size)]

    population, _ = run_evolution(
        populate_func=populate_func,
        fitness_func=fitness_func,
        fitness_limit=10,  # Modify as needed
        generation_limit=generations,
        printer=print_stats
    )

    best_individual = max(population, key=fitness_func)

    result = {
        "best_individual": best_individual,
        "fitness": fitness_func(best_individual)
    }

    return jsonify(result)

if __name__ == "__main__":
    app.run()
