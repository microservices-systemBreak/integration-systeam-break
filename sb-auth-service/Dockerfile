# Stage 1: Build the application using a Maven base image (Java 21)
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the dependency files first (pom.xml)
COPY pom.xml .

# Download dependencies (uses layers efficiently to cache dependencies)
# Skip offline dependency go-offline which can be flaky
# RUN mvn dependency:go-offline

# Copy the rest of the application source code
COPY src ./src

# Build the application jar, skipping tests and ignoring SSL errors
RUN mvn package -DskipTests -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true -Dmaven.wagon.http.ssl.ignore.validity.dates=true

# Stage 2: Create the final minimal runtime image (Java 21 JRE)
FROM eclipse-temurin:21-jre

# Set the working directory
WORKDIR /app

# Copy the built jar from the build stage
# NOTE: Ensure the jar name matches the artifact name defined in your pom.xml
COPY --from=build /app/target/sb-auth-service-*.jar sb-auth-service.jar

# Expose the application port (8080 default for Spring Boot)
EXPOSE 8282

# Run the application
ENTRYPOINT ["java", "-jar", "sb-auth-service.jar"]