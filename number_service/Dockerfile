# ---- Stage 1: Build with Maven (Java 17) ----
FROM maven:3.9-eclipse-temurin-17 as build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# ---- Stage 2: Run with Java 17 ----
FROM eclipse-temurin:17-jdk as runtime

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]