# --- STAGE 1: Build the application ---
FROM eclipse-temurin:21-jdk-jammy AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper files to make sure we use the project's Maven version
COPY mvnw .
COPY .mvn .mvn

# Copy the pom.xml file first to download dependencies
# This leverages Docker's layer caching for faster builds if pom.xml doesn't change
COPY pom.xml .

# Download dependencies (this step will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the source code
COPY src src

# Build the Spring Boot application
RUN ./mvnw clean install -DskipTests

# --- STAGE 2: Create the final runtime image ---
FROM eclipse-temurin:21-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8081

# Define the entrypoint to run the application
# The DB_PASSWORD will be passed as an environment variable when running the container
ENTRYPOINT ["java", "-jar", "app.jar"]
