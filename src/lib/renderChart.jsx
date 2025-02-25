import React from "react";
import { LineChart, YAxis, XAxis, Line } from "recharts";

export const renderChart = (
  diseaseData,
  lineToGraph,
  setLineToGraph,
  options = [
    { label: "Total Infected", value: "infected" },
    { label: "New Infections", value: "newInfections" },
  ]
) => {
  let buttons = options.map((o) => ({ ...o, active: lineToGraph === o.value }));

  return (
    <div className="chart-container">
      <div className="tabs">
        {buttons.map((b) => (
          <button
            key={b.value}
            onClick={() => setLineToGraph(b.value)}
            className={b.active ? "active" : ""}
          >
            {b.label}
          </button>
        ))}
      </div>
      <LineChart data={diseaseData} width={400} height={400}>
        <YAxis />
        <XAxis />
        <Line type="monotone" dataKey={lineToGraph} stroke="#f00" />
      </LineChart>
    </div>
  );
};
