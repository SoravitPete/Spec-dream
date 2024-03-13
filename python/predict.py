import random

hardware_options = {
    'CPU': {'i5': 200, 'i7': 300, 'i9': 500},
    'RAM': {'8GB': 80, '16GB': 120, '32GB': 240},
    'GPU': {'GTX1060': 250, 'RTX2060': 400, 'RTX3070': 600},
    'Storage': {'256GB SSD': 100, '512GB SSD': 150, '1TB SSD': 250}
}

def generate_population(population_size):
    population = []
    for _ in range(population_size):
        config = {
            'CPU': random.choice(list(hardware_options['CPU'].keys())),
            'RAM': random.choice(list(hardware_options['RAM'].keys())),
            'GPU': random.choice(list(hardware_options['GPU'].keys())),
            'Storage': random.choice(list(hardware_options['Storage'].keys()))
        }
        population.append(config)
    return population

def evaluate_fitness(configuration, budget):
    total_cost = sum(hardware_options[component][configuration[component]] for component in configuration)
    return 1 / (1 + abs(total_cost - budget))

def crossover(parent1, parent2):
    crossover_point = random.choice(list(parent1.keys()))
    child = {}
    for component in parent1:
        if component == crossover_point:
            child[component] = parent2[component]
        else:
            child[component] = parent1[component]
    return child

def mutate(configuration):
    mutated_component = random.choice(list(configuration.keys()))
    new_value = random.choice(list(hardware_options[mutated_component].keys()))
    configuration[mutated_component] = new_value
    return configuration

def select_parents(population, budget):
    tournament_size = 5
    tournament = random.sample(population, tournament_size)
    tournament.sort(key=lambda x: evaluate_fitness(x, budget), reverse=True)
    return tournament[0], tournament[1]

def genetic_algorithm(budget, generations, population_size):
    population = generate_population(population_size)

    for generation in range(generations):
        population.sort(key=lambda x: evaluate_fitness(x, budget), reverse=True)
        new_population = []

        elite_size = int(0.1 * population_size)
        new_population.extend(population[:elite_size])

        for _ in range(population_size - elite_size):
            parent1, parent2 = select_parents(population, budget)
            child = crossover(parent1, parent2)
            if random.random() < 0.1: 
                child = mutate(child)
            new_population.append(child)

        population = new_population

    population.sort(key=lambda x: evaluate_fitness(x, budget), reverse=True)
    return population[0]

budget = 1000
generations = 50
population_size = 100

best_configuration = genetic_algorithm(budget, generations, population_size)
print("Best Configuration:", best_configuration)
