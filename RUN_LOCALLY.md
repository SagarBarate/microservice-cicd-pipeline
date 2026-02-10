# Run All Services Locally (No Docker for Apps)

This guide runs every HealthFlowDPA service on your machine. Only PostgreSQL can be run via Docker (one container) if you prefer; everything else runs with Maven.

---

## Prerequisites

- **Java 17+** (check: `java -version`)
- **Maven** (optional; each service has `./mvnw`)
- **PostgreSQL** – either:
  - **Option A:** Docker (only for the database), or  
  - **Option B:** Local PostgreSQL install

---

## Step 0: Start PostgreSQL

Services expect PostgreSQL at **localhost:15432** with:

- **Database:** `postgres_docker_db`
- **User:** `sagarbarateA00335597`
- **Password:** `sagar@123`

### Option A – PostgreSQL with Docker (easiest)

```bash
docker run -d \
  --name postgres-hsm \
  -e POSTGRES_DB=postgres_docker_db \
  -e POSTGRES_USER=sagarbarateA00335597 \
  -e POSTGRES_PASSWORD=sagar@123 \
  -p 15432:5432 \
  postgres:13
```

If the container already exists:

```bash
docker start postgres-hsm
```

### Option B – Local PostgreSQL

Create database and user, then ensure it listens on port **15432** (or change every service’s `spring.datasource.url` to your port).

---

## Step 1: Open 6 terminals

Use 6 terminal windows/tabs. All commands below are from the **project root**:

```text
HealthFlowDPA-main/
```

Replace `HealthFlowDPA-main` with your actual project root path if different.

---

## Step 2: Terminal 1 – Cloud Config Server (port 8888)

```bash
cd cloud-config-server
./mvnw clean install
./mvnw spring-boot:run
```

Wait until you see: **Started CloudConfigServerApplication**

Leave this terminal running.

---

## Step 3: Terminal 2 – Registry Server / Eureka (port 8761)

```bash
cd registry-server
./mvnw clean install
./mvnw spring-boot:run
```

Wait until you see: **Started RegistryServerApplication**

Check: open **http://localhost:8761** – Eureka dashboard should load.

Leave this terminal running.

---

## Step 4: Terminal 3 – Doctor Service (port 8091)

```bash
cd doctor-service
./mvnw clean install
./mvnw spring-boot:run
```

Wait until you see: **Started DoctorServiceApplication**

Leave this terminal running.

---

## Step 5: Terminal 4 – Patient Service (port 8092)

```bash
cd patient-service
./mvnw clean install
./mvnw spring-boot:run
```

Wait until you see: **Started PatientServiceApplication**

Leave this terminal running.

---

## Step 6: Terminal 5 – Appointment Service (port 8093)

```bash
cd appiontment-service
./mvnw spring-boot:run
```

Wait until you see: **Started AppiontmentServiceApplication**

Leave this terminal running.

---

## Step 7: Terminal 6 – API Gateway (port 8222)

```bash
cd api-gateway
./mvnw spring-boot:run
```

Wait until you see: **Started ApiGateway** (or similar).

Leave this terminal running.

---

## Verification

| What | URL |
|------|-----|
| Eureka dashboard | http://localhost:8761 |
| Config Server health | http://localhost:8888/actuator/health |
| API Gateway (entry point) | http://localhost:8222 |

On Eureka you should see:

- REGISTRY-SERVER  
- API-GATEWAY  
- DOCTOR-SERVICE  
- PATIENT-SERVICE  
- APPOINTMENT-SERVICE  

**Login (get JWT):**

```bash
curl -X POST "http://localhost:8222/auth/login?username=test"
```

Use the returned token in the `Authorization` header for other API calls.

**Example – list doctors (after login):**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8222/v1/doctor
```

---

## Service order summary

Start in this order and wait for each to finish starting before the next:

1. PostgreSQL  
2. Cloud Config Server  
3. Registry Server (Eureka)  
4. Doctor Service  
5. Patient Service  
6. Appointment Service  
7. API Gateway  

---

## Optional: Start-all script (background)

From the **project root**, you can start every app in the background. Ensure PostgreSQL is already running.

```bash
# From project root (HealthFlowDPA-main)
chmod +x start-all-local.sh   # only first time
./start-all-local.sh
```

Logs are written to `logs-<service>.txt` in the project root. Give services about 1–2 minutes, then check http://localhost:8761.

---

## Stopping

- In each terminal: **Ctrl+C**
- If you used Docker for Postgres: `docker stop postgres-hsm`

---

## Troubleshooting

- **Port in use:** e.g. `lsof -i :8761` then `kill -9 <PID>`
- **Service not in Eureka:** Start Registry first, wait ~30 seconds, then start the others.
- **DB connection errors:** Confirm Postgres is on `localhost:15432` and credentials match (user, password, database name).
