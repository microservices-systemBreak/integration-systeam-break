# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY sb-api-gateway/pom.xml .
RUN mvn dependency:go-offline
COPY sb-api-gateway/src ./src
RUN mvn package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/sb-api-gateway-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
