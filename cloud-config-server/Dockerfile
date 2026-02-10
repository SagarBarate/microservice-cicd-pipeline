# Use Eclipse Temurin for building (openjdk image is deprecated on Docker Hub)
FROM eclipse-temurin:21-jdk AS build

# Set the working directory
WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Create the final image
FROM eclipse-temurin:21-jre

# Set the working directory
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/cloud-config-server-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8888
	
# Run the application
ENTRYPOINT ["java","-jar","app.jar"]
