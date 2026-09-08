FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /workspace

COPY gradle gradle
COPY gradlew build.gradle settings.gradle ./
RUN chmod +x gradlew

COPY src src
RUN ./gradlew bootWar --no-daemon

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

ENV SPRING_PROFILES_ACTIVE=prod \
    PORT=10000 \
    UPLOAD_DIR=/tmp/uploads

RUN groupadd --system spring \
    && useradd --system --gid spring spring \
    && mkdir -p /tmp/uploads \
    && chown spring:spring /tmp/uploads

COPY --from=build --chown=spring:spring /workspace/build/libs/*.war /app/app.war

USER spring:spring

EXPOSE 10000

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.war"]
