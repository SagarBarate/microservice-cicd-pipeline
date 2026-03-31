import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/common/Alert";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import InputField from "../../components/common/InputField";
import Loader from "../../components/common/Loader";
import {
  deleteAllDoctors,
  deleteDoctor,
  getDoctors
} from "../../services/doctorService";
import { getErrorMessage } from "../../utils/helpers";

function DoctorListPage() {
  const [filters, setFilters] = useState({ name: "", specialization: "" });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await getDoctors({
        name: filters.name || undefined,
        specialization: filters.specialization || undefined
      });
      setRows(data);
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Failed to load doctors.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadDoctors();
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await deleteDoctor(id);
      setAlert({ type: "success", message: "Doctor deleted successfully." });
      loadDoctors();
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Delete failed.") });
    }
  };

  const handleDeleteAll = async () => {
    try {
      setDeletingAll(true);
      await deleteAllDoctors();
      setAlert({ type: "success", message: "All doctors removed successfully." });
      setConfirmOpen(false);
      loadDoctors();
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Delete all failed.") });
    } finally {
      setDeletingAll(false);
    }
  };

  if (loading) return <Loader text="Loading doctors..." />;

  return (
    <section>
      <div className="page-header">
        <h2>Doctors</h2>
        <div className="header-actions">
          <Link className="btn btn-primary" to="/doctors/new">
            Add Doctor
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
        <InputField
          label="Specialization"
          name="specialization"
          value={filters.specialization}
          onChange={(e) => setFilters((prev) => ({ ...prev, specialization: e.target.value }))}
          placeholder="Search by specialization"
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
          { key: "specialization", title: "Specialization" }
        ]}
        actions={(row) => (
          <div className="row-actions">
            <Link to={`/doctors/${row?.id}`}>View</Link>
            <Link to={`/doctors/${row?.id}/edit`}>Edit</Link>
            <button className="btn-link danger" type="button" onClick={() => handleDeleteSingle(row?.id)}>
              Delete
            </button>
          </div>
        )}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete all doctors?"
        message="This action cannot be undone."
        onConfirm={handleDeleteAll}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel="Delete All"
        loading={deletingAll}
      />
    </section>
  );
}

export default DoctorListPage;
