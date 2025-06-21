# Use official OpenJDK image
FROM openjdk:17-jdk-slim

# Set working directory in container
WORKDIR /app

# Copy the built jar into the container
COPY target/cloud_in_backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "app.jar"]
