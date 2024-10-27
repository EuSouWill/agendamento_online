FROM ubuntu:lastest AS build

RUN apt-get update
RUN apt-get install openjdk-17-jdk -y
COPY . .

Run apt-get install maven -y
RUN mvn clean install

From openjdk:17-jdk-slim

EXPOSE 8080

COPY --from=build /target/agendamento-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT [ "java", "-jar", "app.jar"]