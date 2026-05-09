FROM --platform=$BUILDPLATFORM maven:3.9-eclipse-temurin-11 AS builder

WORKDIR /app
COPY pom.xml .
COPY settings.xml /root/.m2/settings.xml
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B

FROM --platform=$TARGETPLATFORM tomcat:9.0-jdk11

# 删除默认应用
RUN rm -rf /usr/local/tomcat/webapps/*

# 复制 WAR 包到 Tomcat webapps 目录
COPY --from=builder /app/target/lost-found.war /usr/local/tomcat/webapps/ROOT.war

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 设置 Tomcat 编码
ENV CATALINA_OPTS="-Dfile.encoding=UTF-8 -Xms256m -Xmx512m"

EXPOSE 8080

CMD ["catalina.sh", "run"]
