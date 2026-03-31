# HealthFlow DPA – API Endpoints Summary

Use the **API Gateway** as the single entry point for the frontend.

- **Base URL:** `http://localhost:8222`
- Gateway routes to: doctor-service, patient-service, appointment-service via Eureka.

---

## 1. Auth (API Gateway – no route prefix)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login. Query param: `username`. Returns JWT token. |

**Example:** `POST http://localhost:8222/auth/login?username=admin`

---

## 2. Doctor Service (`/v1/doctor`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/doctor/test` | Health check |
| POST | `/v1/doctor` | Create doctor |
| GET | `/v1/doctor` | List all doctors. Query: `name`, `specialization` (optional) |
| GET | `/v1/doctor/{id}` | Get doctor by id |
| PUT | `/v1/doctor/{id}` | Update doctor |
| DELETE | `/v1/doctor/{id}` | Delete doctor by id |
| DELETE | `/v1/doctor` | Delete all doctors |

**Create/Update body (DoctorRecord):**
```json
{
  "id": null,
  "name": "string",
  "specialization": "FAMILY_MEDICINE",
  "phoneNumber": "+1234567890",
  "email": "doctor@example.com"
}
```
**Specialization enum values:** `ANESTHESIOLOGY`, `DERMATOLOGY`, `DIAGNOSTIC_RADIOLOGY`, `EMERGENCY_MEDICINE`, `FAMILY_MEDICINE`, `INTERNAL_MEDICINE`, `MEDICAL_GENETICS`, `NEUROLOGY`, `NUCLEAR_MEDICINE`, `OBSTETRICS_AND_GYNECOLOGY`, `OPHTHALMOLOGY`, `PATHOLOGY`, `PEDIATRICS`, `PHYSICAL_MEDICINE_AND_REHABILITATION`, `PREVENTIVE_MEDICINE`

---

## 3. Patient Service (`/v1/patient`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/patient/test` | Health check |
| POST | `/v1/patient` | Create patient |
| GET | `/v1/patient` | List all patients. Query: `name` (optional) |
| GET | `/v1/patient/{id}` | Get patient by id |
| PUT | `/v1/patient/{id}` | Update patient |
| DELETE | `/v1/patient/{id}` | Delete patient by id |
| DELETE | `/v1/patient` | Delete all patients |
| POST | `/v1/patient/bookAppointment` | Book appointment (delegates to appointment service) |

**Create/Update body (PatientRecord):**
```json
{
  "id": null,
  "name": "string",
  "age": 25,
  "gender": "string",
  "phoneNumber": "string",
  "email": "string"
}
```

---

## 4. Appointment Service (`/v1/appointment`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/appointment/test` | Health check |
| POST | `/v1/appointment/book` | Book appointment |
| GET | `/v1/appointment` | List all appointments |

**Book appointment body (AppointmentRecord):**
```json
{
  "doctorId": 1,
  "patientId": 1,
  "appointmentDate": "2026-02-15"
}
```
Date format: `yyyy-MM-dd` (e.g. `2026-02-15`).

---

## Quick reference – bare endpoints (all via gateway base `http://localhost:8222`)

```
POST   /auth/login?username=...
GET    /v1/doctor/test
POST   /v1/doctor
GET    /v1/doctor
GET    /v1/doctor?name=...&specialization=...
GET    /v1/doctor/{id}
PUT    /v1/doctor/{id}
DELETE /v1/doctor/{id}
DELETE /v1/doctor

GET    /v1/patient/test
POST   /v1/patient
GET    /v1/patient
GET    /v1/patient?name=...
GET    /v1/patient/{id}
PUT    /v1/patient/{id}
DELETE /v1/patient/{id}
DELETE /v1/patient
POST   /v1/patient/bookAppointment

GET    /v1/appointment/test
POST   /v1/appointment/book
GET    /v1/appointment
```

---

## Frontend flow summary

- **Register doctor:** `POST /v1/doctor` with DoctorRecord (omit or null `id`).
- **Create patient:** `POST /v1/patient` with PatientRecord (omit or null `id`).
- **Book appointment:**  
  - Either `POST /v1/patient/bookAppointment` with `{ doctorId, patientId, appointmentDate }`, or  
  - `POST /v1/appointment/book` with the same body.
- **List doctors:** `GET /v1/doctor` (optional `?name=...&specialization=...`).
- **List patients:** `GET /v1/patient` (optional `?name=...`).
- **List appointments:** `GET /v1/appointment`.
- **Login:** `POST /auth/login?username=...`; use returned token if the gateway expects it in headers (e.g. `Authorization: Bearer <token>`).
