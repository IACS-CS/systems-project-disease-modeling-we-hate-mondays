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
    } else if (p.newlyInfected) {
      return "🤧"; // Sneezing face for newly infected individuals
    } else if (p.infected) {
      return "🤢"; // Vomiting face for infected individuals
    } else {
      // Check age to assign elder or kid emoji
      if (p.age >= 65) {
        return "🧓"; // Elderly emoji for elderly people
      } else if (p.age <= 12) {
        return "👶"; // Baby emoji for young kids
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
  const [population, setPopulation] = useState(createPopulation(popSize * popSize));
  const [diseaseData, setDiseaseData] = useState([]);
  const [lineToGraph, setLineToGraph] = useState("infected");
  const [autoMode, setAutoMode] = useState(false);
  const [simulationParameters, setSimulationParameters] = useState(defaultSimulationParameters);

  // Runs a single simulation step
  const runTurn = () => {
    let newPopulation = updatePopulation([...population], simulationParameters);
    setPopulation(newPopulation);
    let newStats = computeStatistics(newPopulation, diseaseData.length);
    setDiseaseData([...diseaseData, newStats]);
  };

  // Resets the simulation
  const resetSimulation = () => {
    setPopulation(createPopulation(popSize * popSize));
    setDiseaseData([]);
  };

  // Auto-run simulation effect
  useEffect(() => {
    if (autoMode) {
      setTimeout(runTurn, 500);
    }
  }, [autoMode, population]);

  return (
    <div>
      <section className="top">
        <h1>My Custom Simulation</h1>
        <p>
          Population: {population.length}. Infected:{" "}
          {population.filter((p) => p.infected).length}. Dead:{" "}
          {population.filter((p) => p.dead).length}
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
        </div>
      </section>

      <section className="side-by-side">
        {renderChart(diseaseData, lineToGraph, setLineToGraph, trackedStats)}

        <div className="world">
          <div
            className="population-box"
            style={{ width: boxSize, height: boxSize }}
          >
            {renderPatients(population)}
          </div>
        </div>

        {renderTable(diseaseData, trackedStats)}
      </section>
    </div>
  );
};

export default Simulation;
