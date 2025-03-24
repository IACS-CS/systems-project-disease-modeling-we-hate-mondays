// model code from Mr. Hinkle
// used Github Copilot to help add
// sliders for death rates for young, adult, and elderly

import React, { useEffect, useState } from "react";
import {
  createPopulation,
  updatePopulation,
  computeStatistics,
  trackedStats,
  defaultSimulationParameters,
} from "./diseaseModel";
import { renderChart } from "../../lib/renderChart";
import { renderTable } from "../../lib/renderTable";

let boxSize = 500; // World box size in pixels
let maxSize = 1000; // Max number of icons we render

// Function to create an individual with states to track infection
function createIndividual(id, infected = false) {
  return {
    id,
    infected: infected,
    dead: false,
    immune: false,
    newlyInfected: false,
    vaccinated: false,
    age: Math.floor(Math.random() * 100), // Random age between 0 and 100
    daysInfected: 0, // Tracks the number of days infected
    daysRecovered: 0, // Tracks days in recovery before immunity
    daysUntilDeath: null, // Tracks the number of days until death, if infected
  };
}

// Render the population with emojis for each individual
const renderPatients = (population) => {
  let amRenderingSubset = population.length > maxSize;
  const popSize = population.length;
  if (popSize > maxSize) {
    population = population.slice(0, maxSize);
  }

  // Function to render appropriate emoji based on individual's status
  function renderEmoji(p) {
    if (p.dead) {
      return "💀"; // Skull emoji for dead individuals
    } else if (p.infected) {
      return "🤢"; // Vomiting face for infected individuals
    } else if (p.immune) {
      return "🙂"; // Healthy emoji for immune individuals
    } else if (p.vaccinated) {
      return "💉"; // Shot emoji for vaccinated individuals
    } else {
      // Default healthy emoji logic
      if (p.age >= 65) {
        return "🧓"; // Elderly person
      } else if (p.age <= 12) {
        return "👶"; // Child
      } else {
        return "😀"; // Healthy person (smiling face)
      }
    }
  }

  function renderSubsetWarning() {
    if (amRenderingSubset) {
      return (
        <div className="subset-warning">
          Only showing {maxSize} ({((maxSize * 100) / popSize).toFixed(2)}%) of{" "}
          {popSize} patients...
        </div>
      );
    }
  }

  return (
    <>
      {renderSubsetWarning()}
      {population.map((p) => (
        <div
          key={p.id}
          data-patient-id={p.id}
          data-patient-x={p.x}
          data-patient-y={p.y}
          className="patient"
          style={{
            transform: `translate(${(p.x / 100) * boxSize}px, ${
              (p.y / 100) * boxSize
            }px)`,
          }}
        >
          {renderEmoji(p)}
        </div>
      ))}
    </>
  );
};

const Simulation = () => {
  const [popSize, setPopSize] = useState(20);
  const [healthyPopulation, setHealthyPopulation] = useState(
    createPopulation(popSize * popSize, false)
  );
  const [infectedPopulation, setInfectedPopulation] = useState(
    createPopulation(popSize * popSize, true)
  ); // Initial infected group
  const [vaccinationRate, setVaccinationRate] = useState(0); // New state for vaccine rate
  const [diseaseData, setDiseaseData] = useState([]);
  const [lineToGraph, setLineToGraph] = useState("infected");
  const [autoMode, setAutoMode] = useState(false);
  const [simulationParameters, setSimulationParameters] = useState(
    defaultSimulationParameters
  );

  // Runs a single simulation step
  const runTurn = () => {
    // Update both populations separately
    let newHealthyPopulation = updatePopulation(
      [...healthyPopulation],
      simulationParameters
    );
    let newInfectedPopulation = updatePopulation(
      [...infectedPopulation],
      simulationParameters
    );
    setHealthyPopulation(newHealthyPopulation);
    setInfectedPopulation(newInfectedPopulation);

    // Combine populations and compute statistics
    let combinedPopulation = [
      ...newHealthyPopulation,
      ...newInfectedPopulation,
    ];
    let newStats = computeStatistics(combinedPopulation, diseaseData.length);
    setDiseaseData([...diseaseData, newStats]);
  };

  // Resets the simulation
  const resetSimulation = () => {
    setHealthyPopulation(createPopulation(popSize * popSize, false)); // Reset healthy population
    setInfectedPopulation(createPopulation(popSize * popSize, true)); // Reset infected population
    setDiseaseData([]);
  };

  // Update the population's vaccination status based on vaccinationRate
  const updateVaccinationStatus = (rate) => {
    setVaccinationRate(rate);

    // Calculate the number of vaccinated individuals
    const totalPopulation = popSize * popSize;
    const vaccinatedCount = Math.round((rate / 100) * totalPopulation);

    // Create new populations with vaccinated individuals
    const newHealthyPopulation = createPopulation(totalPopulation, false).map(
      (person, index) => {
        if (index < vaccinatedCount) {
          person.vaccinated = true; // Mark as vaccinated
          person.emoji = "💉"; // Set emoji for vaccinated individuals
        }
        return person;
      }
    );

    const newInfectedPopulation = createPopulation(totalPopulation, true).map(
      (person) => {
        person.vaccinated = false; // Ensure infected individuals are not vaccinated
        return person;
      }
    );

    setHealthyPopulation(newHealthyPopulation);
    setInfectedPopulation(newInfectedPopulation);
  };

  // Auto-run simulation effect
  useEffect(() => {
    if (autoMode) {
      setTimeout(runTurn, 500);
    }
  }, [autoMode, healthyPopulation, infectedPopulation]);

  return (
    <div>
      <section className="top">
        <h1>My Custom Simulation</h1>
        <p>
          Healthy Population: {healthyPopulation.length}. Infected:{" "}
          {infectedPopulation.filter((p) => p.infected).length}. Dead:{" "}
          {healthyPopulation.filter((p) => p.dead).length +
            infectedPopulation.filter((p) => p.dead).length}
        </p>

        <button onClick={runTurn}>Next Turn</button>
        <button onClick={() => setAutoMode(true)}>AutoRun</button>
        <button onClick={() => setAutoMode(false)}>Stop</button>
        <button onClick={resetSimulation}>Reset Simulation</button>

        <div>
          <label>
            Infection Chance:
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={simulationParameters.infectionChance}
              onChange={(e) =>
                setSimulationParameters({
                  ...simulationParameters,
                  infectionChance: parseFloat(e.target.value),
                })
              }
            />
            {simulationParameters.infectionChance}%
          </label>

          <label>
            Death Rate:
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={simulationParameters.deathRate}
              onChange={(e) =>
                setSimulationParameters({
                  ...simulationParameters,
                  deathRate: parseFloat(e.target.value),
                })
              }
            />
            {simulationParameters.deathRate}%
          </label>

          <label>
            Population:
            <div className="vertical-stack">
              <input
                type="range"
                min="3"
                max="1000"
                value={popSize}
                onChange={(e) => setPopSize(parseInt(e.target.value))}
              />
              <input
                type="number"
                value={Math.round(popSize * popSize)}
                step="10"
                onChange={(e) =>
                  setPopSize(Math.sqrt(parseInt(e.target.value)))
                }
              />
            </div>
          </label>

          {/* Vaccine Percentage Control */}
          <label>
            Vaccination Rate:
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={vaccinationRate}
              onChange={(e) => updateVaccinationStatus(e.target.value)}
            />
            {vaccinationRate}%
          </label>

          <div>
            <label>
              Death Rate (Young):
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={simulationParameters.deathRates.young}
                onChange={(e) =>
                  setSimulationParameters({
                    ...simulationParameters,
                    deathRates: {
                      ...simulationParameters.deathRates,
                      young: parseFloat(e.target.value),
                    },
                  })
                }
              />
              {simulationParameters.deathRates.young}%
            </label>

            <label>
              Death Rate (Adult):
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={simulationParameters.deathRates.adult}
                onChange={(e) =>
                  setSimulationParameters({
                    ...simulationParameters,
                    deathRates: {
                      ...simulationParameters.deathRates,
                      adult: parseFloat(e.target.value),
                    },
                  })
                }
              />
              {simulationParameters.deathRates.adult}%
            </label>

            <label>
              Death Rate (Elderly):
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={simulationParameters.deathRates.elderly}
                onChange={(e) =>
                  setSimulationParameters({
                    ...simulationParameters,
                    deathRates: {
                      ...simulationParameters.deathRates,
                      elderly: parseFloat(e.target.value),
                    },
                  })
                }
              />
              {simulationParameters.deathRates.elderly}%
            </label>
          </div>
        </div>
      </section>

      <section className="side-by-side">
        {renderChart(diseaseData, lineToGraph, setLineToGraph, trackedStats)}

        <div className="world">
          <div
            className="population-box"
            style={{ width: boxSize, height: boxSize }}
          >
            {renderPatients([...healthyPopulation, ...infectedPopulation])}
          </div>
        </div>

        {renderTable(diseaseData, trackedStats)}
      </section>
    </div>
  );
};

// If the person is in contact with an infected person and isn't dead, recovered, or vaccinated
if (
  contact.infected &&
  !person.infected &&
  !person.dead &&
  !person.vaccinated && // Vaccinated individuals are immune
  Math.random() * 100 < params.infectionChance
) {
  person.infected = true;
  person.newlyInfected = true;
  person.daysInfected = 0;
  person.emoji = "🤧"; // Set emoji for sneezing/infected
}

export default Simulation;
