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
 * we're trying to simulate the increasing and decreasing of people who are infected
 *
 * What elements we have to add:
 * we're adding emojis skull, sick, sneezing, baby emoji, and happy emoji altogether
 *
 * The skull emoji will represent death
 * The sick emoji will represent the people who are infected already
 * The sneezing emoji will represent the people who are getting infected
 * The baby emoji represents the young kids in the pandemic
 * The old lady emoji represents the elders who are at high risk for getting COVID
 *
 * In plain language, what our model does:
 * We're going to create a simulation of people that are going through the pandemic
 * We will observe who gets sick, who dies, and who is immune to COVID
 * We can increase the chances of death and infection to test the limits and see the results we're aiming for.
 *
 * Credits:
 * Chery and Aditya
 * Used Github Copilot to help with the code throughout.
 * Worked with Mr. Hinkle to understand how to add variable
 * death rates for different ages.
 */

/* Simulation Parameters */
export const defaultSimulationParameters = {
  infectionChance: 50, // Chance of infection on contact
  recoveryRate: 20, // Chance of recovering after a certain number of days
  quarantineChance: 10, // Chance of being quarantined
  recoveryDays: 7, // Number of days until recovery
  deathRates: {
    young: 5, // Death rate for ages 0-12
    adult: 10, // Death rate for ages 13-64
    elderly: 20, // Death rate for ages 65+
  },
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
      recovered: false,
      newlyInfected: false,
      daysInfected: 0, // Track the number of days infected
      daysToRecovery: 0, // Track days until recovery
      age: age, // Add age property to individuals
      emoji: "🙂", // Default emoji (happy)
    });
  }

  // Infect patient zero
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  patientZero.emoji = "🤒"; // Set emoji for infected person
  return population;
};

// Define age-specific death rates
const ageSpecificDeathRates = {
  young: 5, // Death rate for ages 0-12
  adult: 10, // Death rate for ages 13-64
  elderly: 20, // Death rate for ages 65+
};

// Function to get death rate based on age
const getDeathRateByAge = (age) => {
  if (age <= 12) {
    return ageSpecificDeathRates.young;
  } else if (age >= 65) {
    return ageSpecificDeathRates.elderly;
  } else {
    return ageSpecificDeathRates.adult;
  }
};

// Update Individual's Infection and Death Status
export const updateIndividual = (person, contact, params) => {
  // If the person is dead, no further updates happen
  if (person.dead) {
    return;
  }

  // Handle infection, death, and recovery logic
  if (person.infected) {
    person.daysInfected += 1;

    // Chance to recover after a set number of days
    if (
      person.daysInfected >= params.recoveryDays &&
      Math.random() * 100 < params.recoveryRate
    ) {
      person.recovered = true;
      person.infected = false;
      person.emoji = "😷"; // Change emoji to recovered
    }

    // Check if the person has been infected long enough to die (only one chance)
    if (person.daysInfected > 5 && !person.deathEvaluated) {
      person.deathEvaluated = true; // Mark that death chance has been evaluated

      // Get death rate based on age
      const deathRate = getDeathRateByAge(person.age);

      if (Math.random() * 100 < deathRate) {
        person.dead = true;
        person.infected = false;
        person.emoji = "💀"; // Set emoji for death
      }
    }
  }

  // If the person is in contact with an infected person and isn't dead or recovered
  if (
    contact.infected &&
    !person.infected &&
    !person.dead &&
    Math.random() * 100 < params.infectionChance
  ) {
    person.infected = true;
    person.newlyInfected = true;
    person.daysInfected = 0;
    person.emoji = "🤧"; // Set emoji for sneezing/infected
  }

  // Chance for a person to be quarantined and not interact
  if (person.infected && Math.random() * 100 < params.quarantineChance) {
    person.emoji = "🛑"; // Change emoji to represent quarantine
  }
};

/* Update Population based on contact */
export const updatePopulation = (population, params) => {
  // Shuffle population if needed
  population = shufflePopulation(population);

  for (let i = 0; i < population.length; i++) {
    let p = population[i];
    // Logic to grab the next person in line for contact
    let contact = population[(i + 1) % population.length];
    updateIndividual(p, contact, params);
  }
  return population;
};

/* Stats to track (infected, dead, recovered) */
export const trackedStats = [
  { label: "Total Infected", value: "infected" },
  { label: "Total Dead", value: "dead" },
  { label: "Total Recovered", value: "recovered" },
];

/* Compute Stats for the simulation */
export const computeStatistics = (population, round) => {
  let infected = 0;
  let dead = 0;
  let recovered = 0;

  // Count infected, dead, and recovered individuals
  for (let p of population) {
    if (p.infected) infected += 1;
    if (p.dead) dead += 1;
    if (p.recovered) recovered += 1;
  }

  return { round, infected, dead, recovered }; // Return stats for the round
};
