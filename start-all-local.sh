#!/bin/bash
# Run all HealthFlowDPA services locally (no Docker for apps).
# Run this from the project root: ./start-all-local.sh
# Prerequisite: PostgreSQL running on localhost:15432

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "=== HealthFlowDPA – starting all services locally ==="
echo "Project root: $ROOT"
echo ""

start_service() {
  local name="$1"
  local dir="$2"
  echo "[$name] Starting in $dir ..."
  (cd "$dir" && ./mvnw spring-boot:run > "../logs-${name}.txt" 2>&1 &)
}

mkdir -p logs 2>/dev/null || true

echo "1/6 Cloud Config Server (8888)"
start_service "config-server" "cloud-config-server"
sleep 15

echo "2/6 Registry Server / Eureka (8761)"
start_service "registry-server" "registry-server"
sleep 20

echo "3/6 Doctor Service (8091)"
start_service "doctor-service" "doctor-service"

echo "4/6 Patient Service (8092)"
start_service "patient-service" "patient-service"

echo "5/6 Appointment Service (8093)"
start_service "appointment-service" "appiontment-service"

sleep 15

echo "6/6 API Gateway (8222)"
start_service "api-gateway" "api-gateway"

echo ""
echo "All processes started in background."
echo "  Eureka:    http://localhost:8761"
echo "  Gateway:   http://localhost:8222"
echo "  Login:     curl -X POST 'http://localhost:8222/auth/login?username=test'"
echo ""
echo "Logs: logs-registry-server.txt, logs-doctor-service.txt, etc. (in project root)"
echo "To stop: kill Java processes (e.g. jps -l then kill -9 <pid>)"
