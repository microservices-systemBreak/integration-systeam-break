# Usa una imagen base de OpenJDK para Java 21
FROM openjdk:21-jdk-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo JAR de tu aplicación al contenedor
# Asegúrate de que el nombre del JAR coincida con el que genera 'mvn package'
COPY target/sb-api-gateway-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto en el que corre tu aplicación Spring Boot (8080 por defecto)
EXPOSE 8080

# Define el comando para ejecutar la aplicación cuando el contenedor se inicie
ENTRYPOINT ["java", "-jar", "app.jar"]
