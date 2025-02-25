export const shufflePopulation = (population) => {
  population = population.slice(); // make a copy
  for (let i = population.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    // Swap places
    [population[i], population[j]] = [population[j], population[i]];
  }
  return population;
};
