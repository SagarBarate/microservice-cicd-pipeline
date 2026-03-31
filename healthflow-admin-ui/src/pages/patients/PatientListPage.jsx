import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/common/Alert";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import InputField from "../../components/common/InputField";
import Loader from "../../components/common/Loader";
import {
  deleteAllPatients,
  deletePatient,
  getPatients
} from "../../services/patientService";
import { getErrorMessage } from "../../utils/helpers";

function PatientListPage() {
  const [filters, setFilters] = useState({ name: "" });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients({
        name: filters.name || undefined
      });
      setRows(data);
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Failed to load patients.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadPatients();
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await deletePatient(id);
      setAlert({ type: "success", message: "Patient deleted successfully." });
      loadPatients();
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Delete failed.") });
    }
  };

  const handleDeleteAll = async () => {
    try {
      setDeletingAll(true);
      await deleteAllPatients();
      setAlert({ type: "success", message: "All patients removed successfully." });
      setConfirmOpen(false);
      loadPatients();
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Delete all failed.") });
    } finally {
      setDeletingAll(false);
    }
  };

  if (loading) return <Loader text="Loading patients..." />;

  return (
    <section>
      <div className="page-header">
        <h2>Patients</h2>
        <div className="header-actions">
          <Link className="btn btn-primary" to="/patients/new">
            Add Patient
          </Link>
          <button className="btn btn-danger" type="button" onClick={() => setConfirmOpen(true)}>
            Delete All
          </button>
        </div>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      <form className="filter-form" onSubmit={handleSearch}>
        <InputField
          label="Name"
          name="name"
          value={filters.name}
          onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Search by name"
        />
        <button className="btn btn-secondary" type="submit">
          Search
        </button>
      </form>

      <DataTable
        rows={rows}
        columns={[
          { key: "id", title: "ID" },
          { key: "name", title: "Name" },
          { key: "email", title: "Email" }
        ]}
        actions={(row) => (
          <div className="row-actions">
            <Link to={`/patients/${row?.id}`}>View</Link>
            <Link to={`/patients/${row?.id}/edit`}>Edit</Link>
            <button className="btn-link danger" type="button" onClick={() => handleDeleteSingle(row?.id)}>
              Delete
            </button>
          </div>
        )}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete all patients?"
        message="This action cannot be undone."
        onConfirm={handleDeleteAll}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel="Delete All"
        loading={deletingAll}
      />
    </section>
  );
}

export default PatientListPage;
