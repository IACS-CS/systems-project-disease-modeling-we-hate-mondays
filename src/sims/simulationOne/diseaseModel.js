import { shufflePopulation } from "../../lib/shufflePopulation";
/* Update this code to simulate a simple disease model! */

/* For this simulation, let's consider a simple disease that spreads through contact.
You can implement a simple model which does one of the following:

1. Model the different effects of different numbers of contacts: in my Handshake Model, two people are in 
   contact each round. What happens if you put three people in contact? Four? Five? Consider different options
   such as always putting people in contact with the people "next" to them (i.e. the people before or after them
   in line) or randomly selecting people to be in contact (just do one of these for your model).

2. Take the "handshake" simulation code as your model, but make it so you can recover from the disease. How does the
spread of the disease change when you set people to recover after a set number of days.

3. Add a "quarantine" percentage to the handshake model: if a person is infected, they have a chance of being quarantined
and not interacting with others in each round.

*/

/**
 * Authors: Chery and Aditya
 * 
 * What we are simulating:
 * we're trying to simutling the increasing and decreasing of people who infected 
 * 
 * What elements we have to add:
 * we're adding emojis skull,sick,snezzing,baby emoji, and happy emoji altogether
 * 
 * The skull emoji will represent death 
 * The sick emoji will represent the people who are infected already 
 * The sneezing emoji will represent the people who are getting infected 
 * the baby emoji represent the young kids in the pandemic 
 * The old lady emoji is the represetion of the elders people being at high risk for getting covid 
 * 
 * In plain language, what our model does:
 * we're going to create an Simulation of people that are going through the pandemic 
 * we're going to oberser who gets sick,who dieds, and who is immune from covid
 * We can increase the chances of the amount people that will die,infected to test the limit and see the results we're trying to see 
 */



/* Simulation Parameters */
export const defaultSimulationParameters = {
  infectionChance: 50,
  deathRate: 10, // Probability of death after infection (percentage)
};

/* Creates your initial population */
export const createPopulation = (size = 1600) => {
  const population = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    const age = Math.floor(Math.random() * 100); // Random age between 0-100
    population.push({
      id: i,
      x: (100 * (i % sideSize)) / sideSize, // X-coordinate within 100 units
      y: (100 * Math.floor(i / sideSize)) / sideSize, // Y-coordinate scaled similarly
      infected: false,
      dead: false,
      newlyInfected: false,
      daysInfected: 0, // Track the number of days infected
      age: age, // Add age property to individuals
    });
  }

  // Infect patient zero
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  return population;
};

/* Update Individual's Infection and Death Status */
export const updateIndividual = (person, contact, params) => {
  // If the person is dead, no further updates happen
  if (person.dead) {
    return;
  }

  // Handle if person is infected
  if (person.infected) {
    person.daysInfected += 1;

    // Check if the person has been infected long enough to die
    if (person.daysInfected > 5 && Math.random() * 100 < params.deathRate) {
      person.dead = true; // Mark as dead
      person.infected = false; // They are no longer contagious
    }
  }

  // Infect the other person if they are in contact and not already infected
  if (contact.infected && !person.infected && !person.dead) {
    if (Math.random() * 100 < params.infectionChance) {
      person.infected = true;
      person.newlyInfected = true;
      person.daysInfected = 0; // Reset infection timer for new infected person
    }
  }
};

/* Update Population based on contact */
export const updatePopulation = (population, params) => {
  for (let i = 0; i < population.length; i++) {
    let p = population[i];
    // This logic grabs the next person in line to be in contact
    let contact = population[(i + 1) % population.length];
    updateIndividual(p, contact, params);
  }
  return population;
};

/* Stats to track (infected and dead) */
export const trackedStats = [
  { label: "Total Infected", value: "infected" },
  { label: "Total Dead", value: "dead" },
];

/* Compute Stats for the simulation */
export const computeStatistics = (population, round) => {
  let infected = 0;
  let dead = 0;

  // Iterate through population and count infected and dead individuals
  for (let p of population) {
    if (p.infected) infected += 1;
    if (p.dead) dead += 1;
  }

  return { round, infected, dead }; // Return infected and dead count
};
