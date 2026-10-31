# PeerLearn – Spring Boot Backend & DevOps Engine

> **Tagline:** *Learn Together. Grow Together.*  
> **Java Version:** 21 LTS  
> **Spring Boot:** 3.3.4  
> **Database:** MySQL 8.0  
> **Build Tool:** Apache Maven with Maven Wrapper (`mvnw`, `mvnw.cmd`)

---

## Quick Start on Windows 11

### 1. Database Setup
```sql
CREATE DATABASE peerlearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Build & Test with Maven Wrapper
From the `spring-boot-backend` directory in Windows Terminal / PowerShell:
```powershell
# Run unit tests
.\mvnw.cmd clean test

# Package JAR
.\mvnw.cmd clean package
```

### 3. Run the Backend Application
```powershell
.\mvnw.cmd spring-boot:run
```

Or run the compiled JAR:
```powershell
java -jar target/peerlearn-platform-1.0.0.jar
```

---

## DevOps Files Included
- **`Dockerfile`**: Multi-stage Docker containerization using Alpine Temurin 21.
- **`Jenkinsfile`**: Declarative CI/CD pipeline covering build, test, Docker packaging, and K8s deployment.
- **`k8s/`**: Kubernetes manifests for Spring Boot app and MySQL database (`deployment.yaml`, `service.yaml`, `mysql-deployment.yaml`).
- **`mvnw` & `mvnw.cmd`**: Portable Maven wrapper for Linux/macOS and Windows 11.

For complete project documentation, system architecture diagrams, and credentials guide, see the root [`README.md`](../README.md).
