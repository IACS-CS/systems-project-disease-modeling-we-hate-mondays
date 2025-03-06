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

// Authors: Chery and Aditya

/**
 * What we are simulating:
 * We're trying to simulate the increasing and decreasing of people who are infected.
 * 
 * What elements we have to add:
 * We're adding emojis for skull (death), sick (infected), sneezing (getting infected), baby (young), and elder (high-risk) people.
 * 
 * The skull emoji will represent death.
 * The sick emoji will represent infected people.
 * The sneezing emoji will represent people who are getting infected.
 * The baby emoji represents the young kids, who are less likely to be affected severely.
 * The elder emoji represents older individuals who are at high risk of being infected and dying.
 * 
 * In plain language, what our model does:
 * We're simulating the spread of a disease, tracking who gets sick, who dies, and who recovers.
 * We can increase the chances of infection and death to test the model's behavior.
 */

/* Simulation Parameters */
export const defaultSimulationParameters = {
  infectionChance: 50, // Chance of infection on contact
  deathRate: 10, // Chance of death after infection
  recoveryRate: 20, // Chance of recovery after a set number of days
  quarantineChance: 10, // Chance of being quarantined
  recoveryDays: 7, // Number of days until recovery
  vaccinationChance: 30, // Chance of vaccinating an individual
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
      emoji: '🙂', // Default emoji (happy)
      vaccinated: false, // Track vaccination status
      immune: false, // Track immune status
    });
  }

  // Infect patient zero
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  patientZero.emoji = '🤒'; // Set emoji for infected person
  return population;
};

/* Update Individual's Infection and Death Status */
export const updateIndividual = (person, contact, params) => {
  // If the person is dead, no further updates happen
  if (person.dead) {
    return;
  }

  // Modify infection chance and death rate based on age
  let adjustedInfectionChance = params.infectionChance;
  let adjustedDeathRate = params.deathRate;

  // Increase infection and death risk for elderly people (age 65 and older)
  if (person.age >= 65) {
    adjustedInfectionChance += 30; // Older people are more likely to get infected
    adjustedDeathRate += 30; // Older people have a higher chance of dying from the disease
    person.emoji = '🧓'; // Elder emoji
  }

  // Handle infection, death, and recovery logic
  if (person.infected) {
    person.daysInfected += 1;

    // Chance to recover after a set number of days
    if (person.daysInfected >= params.recoveryDays && Math.random() * 100 < params.recoveryRate) {
      person.recovered = true;
      person.infected = false;
      person.emoji = '😷'; // Change emoji to recovered
    }

    // Check if the person has been infected long enough to die
    if (person.daysInfected > 5 && Math.random() * 100 < adjustedDeathRate) {
      person.dead = true;
      person.infected = false;
      person.emoji = '💀'; // Set emoji for death
    }
  }

  // If the person is in contact with an infected person and isn't dead or recovered
  if (contact.infected && !person.infected && !person.dead && Math.random() * 100 < adjustedInfectionChance) {
    person.infected = true;
    person.newlyInfected = true;
    person.daysInfected = 0;
    person.emoji = '🤧'; // Set emoji for sneezing/infected
  }

  // Chance for a person to be quarantined and not interact
  if (person.infected && Math.random() * 100 < params.quarantineChance) {
    person.emoji = '🛑'; // Change emoji to represent quarantine
  }

  // Chance to vaccinate an individual
  if (Math.random() * 100 < params.vaccinationChance && !person.vaccinated && !person.dead) {
    person.vaccinated = true;
    person.immune = true;
    person.emoji = '💉'; // Set emoji for vaccinated person
  }
};

/* Update Population based on contact */
export const updatePopulation = (population, params) => {
  for (let i = 0; i < population.length; i++) {
    let p = population[i];
    // Logic to grab the next person in line for contact
    let contact = population[(i + 1) % population.length];
    updateIndividual(p, contact, params);
  }
  return population;
};

/* Stats to track (infected, dead, recovered, vaccinated, immune) */
export const trackedStats = [
  { label: "Total Infected", value: "infected" },
  { label: "Total Dead", value: "dead" },
  { label: "Total Recovered", value: "recovered" },
  { label: "Total Vaccinated", value: "vaccinated" },
  { label: "Total Immune", value: "immune" },
];

/* Compute Stats for the simulation */
export const computeStatistics = (population, round) => {
  let infected = 0;
  let dead = 0;
  let recovered = 0;
  let vaccinated = 0;
  let immune = 0;

  // Count infected, dead, recovered, vaccinated, and immune individuals
  for (let p of population) {
    if (p.infected) infected += 1;
    if (p.dead) dead += 1;
    if (p.recovered) recovered += 1;
    if (p.vaccinated) vaccinated += 1;
    if (p.immune) immune += 1;
  }

  return { round, infected, dead, recovered, vaccinated, immune }; // Return stats for the round
};
