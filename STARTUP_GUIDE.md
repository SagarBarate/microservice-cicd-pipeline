# Step-by-Step Guide to Start All Services Manually

This guide will help you start all services manually (without Docker Compose).

## Prerequisites

1. **Java 17+** installed and configured
2. **Maven** installed
3. **PostgreSQL Database** running (or use Docker for database only)

### Option A: Start PostgreSQL using Docker (Recommended)
```bash
docker run -d \
  --name postgres-hsm \
  -e POSTGRES_DB=postgres_docker_db \
  -e POSTGRES_USER=sagarbarateA00335597 \
  -e POSTGRES_PASSWORD=sagar@123 \
  -p 15432:5432 \
  postgres:13
```

### Option B: Use existing PostgreSQL instance
Make sure PostgreSQL is running on `localhost:15432` with:
- Database: `postgres_docker_db`
- Username: `sagarbarateA00335597`
- Password: `sagar@123`

---

## Startup Order

Services must be started in this specific order:

### Step 1: Start PostgreSQL Database
**Port: 15432**

If using Docker:
```bash
docker start postgres-hsm
```

Verify database is running:
```bash
docker ps | grep postgres
# OR
psql -h localhost -p 15432 -U sagarbarateA00335597 -d postgres_docker_db
```

---

### Step 2: Start Cloud Config Server (Optional but Recommended)
**Port: 8888**

Open a new terminal window and navigate to the project root:
```bash
cd "/Users/sagargopalbarate/Desktop/Sagar'Projects/HealthFlowDPA-main/cloud-config-server"
```

Build and run:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

**OR** if you have Maven installed globally:
```bash
mvn clean install
mvn spring-boot:run
```

**Wait for:** "Started CloudConfigServerApplication" message

Verify: Open browser to `http://localhost:8888/actuator/health`

---

### Step 3: Start Registry Server (Eureka)
**Port: 8761**

Open a **new terminal window** and navigate to:
```bash
cd "/Users/sagargopalbarate/Desktop/Sagar'Projects/HealthFlowDPA-main/registry-server"
```

Build and run:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

**OR** with Maven:
```bash
mvn clean install
mvn spring-boot:run
```

**Wait for:** "Started RegistryServerApplication" message

Verify: Open browser to `http://localhost:8761`
- You should see the Eureka dashboard
- Initially, only the registry server itself will be visible

---

### Step 4: Start Doctor Service
**Port: 8091**

Open a **new terminal window** and navigate to:
```bash
cd "/Users/sagargopalbarate/Desktop/Sagar'Projects/HealthFlowDPA-main/doctor-service"
```

Build and run:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

**OR** with Maven:
```bash
mvn clean install
mvn spring-boot:run
```

**Wait for:** "Started DoctorServiceApplication" message

Verify: 
- Check Eureka dashboard at `http://localhost:8761` - `DOCTOR-SERVICE` should appear
- Health check: `http://localhost:8091/actuator/health` (if actuator is enabled)

---

### Step 5: Start Patient Service
**Port: 8092**

Open a **new terminal window** and navigate to:
```bash
cd "/Users/sagargopalbarate/Desktop/Sagar'Projects/HealthFlowDPA-main/patient-service"
```

Build and run:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

**OR** with Maven:
```bash
mvn clean install
mvn spring-boot:run
```

**Wait for:** "Started PatientServiceApplication" message

Verify:
- Check Eureka dashboard at `http://localhost:8761` - `PATIENT-SERVICE` should appear
- Health check: `http://localhost:8092/actuator/health` (if actuator is enabled)

---

### Step 6: Start Appointment Service
**Port: 8093**

Open a **new terminal window** and navigate to:
```bash
cd "/Users/sagargopalbarate/Desktop/Sagar'Projects/HealthFlowDPA-main/appiontment-service"
```

Build and run:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

**OR** with Maven:
```bash
mvn clean install
mvn spring-boot:run
```

**Wait for:** "Started AppiontmentServiceApplication" message

Verify:
- Check Eureka dashboard at `http://localhost:8761` - `APPOINTMENT-SERVICE` should appear
- Health check: `http://localhost:8093/actuator/health` (if actuator is enabled)

---

### Step 7: Start API Gateway
**Port: 8222**

Open a **new terminal window** and navigate to:
```bash
cd "/Users/sagargopalbarate/Desktop/Sagar'Projects/HealthFlowDPA-main/api-gateway"
```

Build and run:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

**OR** with Maven:
```bash
mvn clean install
mvn spring-boot:run
```

**Wait for:** "Started ApiGateway" message

Verify:
- Check Eureka dashboard at `http://localhost:8761` - `API-GATEWAY` should appear
- Health check: `http://localhost:8222/actuator/health` (if actuator is enabled)

---

## Final Verification

### Check Eureka Dashboard
Open `http://localhost:8761` in your browser. You should see all services registered:

- **REGISTRY-SERVER** (Eureka itself)
- **API-GATEWAY**
- **DOCTOR-SERVICE**
- **PATIENT-SERVICE**
- **APPOINTMENT-SERVICE**

### Service Ports Summary
| Service | Port | URL |
|---------|------|-----|
| Registry Server (Eureka) | 8761 | http://localhost:8761 |
| Config Server | 8888 | http://localhost:8888 |
| API Gateway | 8222 | http://localhost:8222 |
| Doctor Service | 8091 | http://localhost:8091 |
| Patient Service | 8092 | http://localhost:8092 |
| Appointment Service | 8093 | http://localhost:8093 |
| PostgreSQL | 15432 | localhost:15432 |

---

## Troubleshooting

### Services not appearing in Eureka?

1. **Check if Registry Server is running:**
   ```bash
   curl http://localhost:8761
   ```

2. **Check service logs** for connection errors to Eureka:
   - Look for errors like "Cannot execute request on any known server"
   - Verify the service can reach `http://localhost:8761`

3. **Verify Eureka configuration** in each service's `application.yml`:
   - `defaultZone: http://localhost:8761/eureka/`
   - `register-with-eureka: true`

4. **Wait a few seconds** - Services may take 30-60 seconds to register

### Port already in use?

If you get "Port already in use" error:
```bash
# Find process using the port (example for port 8091)
lsof -i :8091
# Kill the process
kill -9 <PID>
```

### Database connection issues?

1. Verify PostgreSQL is running:
   ```bash
   docker ps | grep postgres
   ```

2. Check database connection string in service logs
3. Verify database credentials match:
   - Username: `sagarbarateA00335597`
   - Password: `sagar@123`
   - Database: `postgres_docker_db`
   - Port: `15432`

---

## Quick Start Script (Optional)

You can create a script to start all services. Save this as `start-all-services.sh`:

```bash
#!/bin/bash

# Start PostgreSQL (if using Docker)
docker start postgres-hsm

# Wait for PostgreSQL
sleep 5

# Start Config Server
cd cloud-config-server && ./mvnw spring-boot:run &
sleep 10

# Start Registry Server
cd ../registry-server && ./mvnw spring-boot:run &
sleep 15

# Start Doctor Service
cd ../doctor-service && ./mvnw spring-boot:run &
sleep 10

# Start Patient Service
cd ../patient-service && ./mvnw spring-boot:run &
sleep 10

# Start Appointment Service
cd ../appiontment-service && ./mvnw spring-boot:run &
sleep 10

# Start API Gateway
cd ../api-gateway && ./mvnw spring-boot:run &

echo "All services starting... Check Eureka at http://localhost:8761"
```

Make it executable:
```bash
chmod +x start-all-services.sh
```

---

## Stopping Services

To stop all services:
1. Press `Ctrl+C` in each terminal window
2. Or find and kill Java processes:
   ```bash
   # Find all Java processes
   jps -l
   # Kill specific process
   kill -9 <PID>
   ```

---

## Notes

- Each service should be started in a **separate terminal window** for better log visibility
- Services will automatically register with Eureka once they start
- The config server is optional - services will work without it, but some configurations may not be available
- Make sure to start services in the correct order (Registry Server before other services)

