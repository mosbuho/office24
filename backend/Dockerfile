# 1단계: 빌드 환경 (JDK 및 Maven 포함)
FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests
RUN ls -al /app/target


# 2단계: 실행 환경 (JRE만 포함)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.war app.jar
ENV SPRING_CONFIG_NAME=application
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
