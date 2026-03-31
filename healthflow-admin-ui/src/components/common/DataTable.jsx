import EmptyState from "./EmptyState";

function DataTable({ columns = [], rows = [], keyField = "id", actions }) {
  if (!rows.length) {
    return <EmptyState title="No records found" subtitle="No data available right now." />;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
            {actions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row?.[keyField] ?? index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row?.[column.key] ?? "-"}</td>
              ))}
              {actions ? <td>{actions(row)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
