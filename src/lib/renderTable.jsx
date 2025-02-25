export const renderTable = (diseaseData, trackedStats) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Round</th>
          {trackedStats.map((stat) => (
            <th key={stat.value}>{stat.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {diseaseData.map((dataPoint) => (
          <tr key={dataPoint.round}>
            <td>{dataPoint.round}</td>
            {trackedStats.map((stat) => (
              <td key={stat.value}>{dataPoint[stat.value]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
