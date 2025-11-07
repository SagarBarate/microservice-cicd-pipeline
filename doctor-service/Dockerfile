# Use an official Maven image with OpenJDK 17 for building
FROM eclipse-temurin:17-jdk AS build

# Set the working directory
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Create the final image with OpenJDK 17
FROM eclipse-temurin:17-jre

# Set the working directory
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/doctor-service-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8091
	
# Run the application
ENTRYPOINT ["java","-jar","app.jar"]
