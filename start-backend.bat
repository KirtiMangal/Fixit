@echo off
title FixIt - Spring Boot Backend (Port 8080)
echo ========================================================
echo   Starting FixIt Backend (Spring Boot 3 + H2 Local)
echo ========================================================
set "JAVA_HOME=C:\Users\HP\.jdks\openjdk-25"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "MVN_CMD=C:\Users\HP\.m2\wrapper\dists\apache-maven-3.9.11\03d7e36a140982eea48e22c1dcac01d8862b2550b2939e09a0809bbc5182a5bc\bin\mvn.cmd"

cd /d "%~dp0backend"
if exist "%MVN_CMD%" (
    call "%MVN_CMD%" spring-boot:run -Dspring-boot.run.profiles=local
) else (
    call mvn spring-boot:run -Dspring-boot.run.profiles=local
)
pause
