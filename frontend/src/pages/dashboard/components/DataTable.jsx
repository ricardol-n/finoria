export default function DataTable() {
  return (
    <div className="stats-card">
      <h3>Market Snapshot</h3>
      <table style={{ width: "100%", marginTop: "15px" }}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>AAPL</td>
            <td>$189.32</td>
            <td style={{ color: "green" }}>+1.2%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}