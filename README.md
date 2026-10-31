# PeerLearn – Student Skill Exchange Platform

> **Tagline:** *Learn Together. Grow Together.*  
> **Type:** Full-Stack Web Application & DevOps Academic Case Study  
> **Backend Framework:** Java 21, Spring Boot 3.3.4 (MVC, Data JPA, Security)  
> **Database:** MySQL 8.0 with Hibernate ORM  
> **DevOps Stack:** Git, GitHub, Maven, Docker, Jenkins CI/CD, Kubernetes (K8s)  

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Proposed Solution](#proposed-solution)
4. [Key Features & Modules](#key-features--modules)
   - [Student Module](#student-module)
   - [Admin Module](#admin-module)
   - [Smart Mutual Matching Engine](#smart-mutual-matching-engine)
5. [Technology Stack](#technology-stack)
6. [System Architecture](#system-architecture)
7. [Database Schema & Entities](#database-schema--entities)
8. [Project Folder Structure](#project-folder-structure)
9. [Windows 11 Setup & Execution Guide](#windows-11-setup--execution-guide)
10. [Application URLs & Pre-configured Test Accounts](#application-urls--pre-configured-test-accounts)
11. [Git & Branching Strategy](#git--branching-strategy)
12. [DevOps Roadmap & Jenkins CI Pipeline](#devops-roadmap--jenkins-ci-pipeline)
13. [Docker Containerization & Multi-Container Setup](#13-docker-containerization--multi-container-setup)
14. [Kubernetes Deployment & Orchestration Guide (k8s)](#14-kubernetes-deployment--orchestration-guide-k8s)
15. [Contributors & Authors](#15-contributors--authors)
16. [License](#16-license)

---

## 1. Project Overview

**PeerLearn** is a student-to-student skill exchange platform engineered to democratize collegiate knowledge sharing. Students can teach technical or creative skills they have mastered, learn new skills from peers, find reciprocal matches automatically, and schedule collaborative 1-on-1 learning sessions—all without any financial exchange.

Designed specifically as an **academic DevOps and Enterprise Software Engineering case study**, PeerLearn pairs a modern, intuitive SaaS user experience with a scalable Java 21 enterprise backend.

---

## 2. Problem Statement

1. **High Commercial Learning Costs:** Commercial bootcamps, tutoring platforms, and micro-credential certifications often charge fees that college students cannot afford.
2. **Untapped Campus Talent:** Universities host thousands of students who possess strong domain knowledge (e.g., Python, Spring Boot, Figma, DSA, React, Cloud Computing) but have no structured platform to teach or mentor peers.
3. **One-Way Asymmetric Learning:** Most existing student forums are query-based (like Q&A boards) rather than continuous, reciprocal skill trades where both students benefit mutually.
4. **Lack of Accountable Progress:** Informal student tutoring often breaks down due to the absence of scheduled sessions, skill tracking, and verification.

---

## 3. Proposed Solution

PeerLearn resolves these challenges through a **zero-money, reciprocal skill-swapping ecosystem**:

- **Mutual Skill Matching Algorithm:** Automatically detects symmetric pairings (e.g., Student A teaches Python & wants Java; Student B teaches Java & wants Python).
- **Session Scheduling:** Real-time scheduling with calendar coordination, meeting link support, and learning milestone tracking.
- **Academic Trust & Safety:** College email verification, separate administrative oversight, and role-based access control (`ROLE_STUDENT`, `ROLE_ADMIN`).
- **Comprehensive DevOps Pipeline:** Git version control, multi-stage Docker containerization, Jenkins automated testing, and Kubernetes orchestration.

---

## 4. Key Features & Modules

### Student Module
- **Registration & Authentication:** Secure email registration, BCrypt password encryption, session management, and profile protection.
- **Profile & Skill Management:** Edit bio, college name, branch, graduation year, and manage teach/learn skill matrices with 3 proficiency tiers (*Beginner*, *Intermediate*, *Advanced*).
- **Match Explorer:** View 100% mutual matches, one-way matches, and category filters (Software Development, AI/ML, Design, Cloud, Data Science).
- **Exchange Requests:** Send, accept, decline, and track skill exchange invitations.
- **Session Management:** Book learning sessions with date, time, and topic agendas; mark sessions completed and log progress.
- **Activity & Notifications:** Real-time updates on incoming exchange requests and session schedule confirmations.

### Admin Module
- **Isolated Admin Portal:** Dedicated administrative dashboard at `/admin/login`.
- **System Metrics:** Live counts for total registered students, verified skills, active exchange requests, and conducted learning sessions.
- **User Moderation:** View, filter, activate, or deactivate student accounts.
- **Skill Taxonomy Management:** Add, approve, or deprecate skill categories and standard skill tags.

### Smart Mutual Matching Engine
The matching engine (`MatchingService.java`) queries the database using bidirectional set intersections:
```text
Match Condition:
  Student_A.teachingSkills ∩ Student_B.learningSkills ≠ ∅
                    AND
  Student_B.teachingSkills ∩ Student_A.learningSkills ≠ ∅
```
- **100% Mutual Match:** Both students have reciprocal teach/learn pairings.
- **One-Way Recommendations:** Suggested mentors who teach what a student wants to learn.

---

## 5. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Framework** | Java 21 LTS, Spring Boot 3.3.4 (Spring MVC, Spring Data JPA, Spring Security, Validation) |
| **Frontend UI** | HTML5, CSS3, Tailwind CSS / Bootstrap 5, Thymeleaf, Lucide Icons, Plus Jakarta Sans typography |
| **Database** | MySQL 8.0, Hibernate ORM 6.x |
| **Build & Dependency Tool** | Apache Maven 3.9+ with Maven Wrapper (`mvnw`, `mvnw.cmd`) |
| **Security** | BCrypt password hashing, Spring Security Filter Chain, Session-based auth |
| **Testing** | JUnit 5, Mockito, Spring Security Test, AssertJ |
| **Containerization & CI/CD**| Docker (Multi-stage Temurin 21), Jenkinsfile, Kubernetes (K8s manifests) |
| **Version Control** | Git, GitHub |

---

## 6. System Architecture

```
[ Client Browser (Windows 11 / Mac / Mobile) ]
                      │
                      ▼ HTTP :80 / :8080
         [ Spring Security Filter Chain ]
       (BCrypt Hashing / Role Authorization)
                      │
       ┌──────────────┴──────────────┐
       ▼                             ▼
[ /api/students /auth ]      [ /admin/* Portal ]
       │                             │
       ▼                             ▼
[ Service Layer: StudentService / MatchingService / SessionService ]
                      │
                      ▼
[ Spring Data JPA Repositories (10 Domain Repositories) ]
                      │
                      ▼ JDBC / Hibernate
             [ MySQL 8.0 Database ]
             (peerlearn_db Schema)
```

---

## 7. Database Schema & Entities

The database schema (`peerlearn_db`) consists of 10 normalized relational entities:

1. **`students`**: ID, full name, email (unique), password (BCrypt), college, branch, year, avatar, active flag, role (`ROLE_STUDENT`, `ROLE_ADMIN`).
2. **`skill_categories`**: ID, category name, icon, description.
3. **`skills`**: ID, category ID (FK), skill name, description.
4. **`student_skills`**: ID, student ID (FK), skill ID (FK), skill type (`TEACHING` or `LEARNING`), proficiency level (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`).
5. **`exchange_requests`**: ID, sender ID (FK), receiver ID (FK), offered skill ID (FK), requested skill ID (FK), status (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`), note, timestamps.
6. **`learning_sessions`**: ID, exchange request ID (FK), teacher ID (FK), learner ID (FK), scheduled start time, duration minutes, meeting link, status (`SCHEDULED`, `COMPLETED`, `CANCELLED`).
7. **`notifications`**: ID, student ID (FK), message, link, read status, created timestamp.
8. **`activities`**: ID, student ID (FK), action, details, timestamp.
9. **`reviews`**: ID, session ID (FK), reviewer ID (FK), reviewee ID (FK), rating (1-5), comments.
10. **`achievements`**: ID, student ID (FK), badge name, badge icon, earned timestamp.

---

## 8. Project Folder Structure

```
PeerLearn/
├── .gitignore                          # Global Git ignore rules (logs, target, secrets, .env)
├── README.md                           # Master project documentation
├── metadata.json                       # Applet configuration & metadata
├── package.json                        # UI runtime tooling
├── index.html                          # Web client entrypoint
├── src/                                # Interactive client application
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── types/
│   └── components/
└── spring-boot-backend/                # Java 21 / Spring Boot Maven Project
    ├── .gitignore                      # Backend-specific ignore rules
    ├── pom.xml                         # Maven dependencies & build plugins
    ├── mvnw                            # Maven wrapper script for Linux/macOS
    ├── mvnw.cmd                        # Maven wrapper script for Windows 11
    ├── .mvn/wrapper/                   # Maven wrapper configuration & properties
    ├── Dockerfile                      # Multi-stage production container build
    ├── Jenkinsfile                     # Declarative CI/CD pipeline definition
    ├── k8s/                            # Kubernetes deployment manifests
    │   ├── deployment.yaml             # Spring Boot app Deployment
    │   ├── service.yaml                # Spring Boot LoadBalancer Service
    │   └── mysql-deployment.yaml       # MySQL stateful Deployment & Service
    └── src/
        ├── main/
        │   ├── java/com/peerlearn/
        │   │   ├── PeerLearnApplication.java
        │   │   ├── config/             # SecurityConfig.java, DataInitializer.java
        │   │   ├── model/              # 10 JPA Entities (Student, Skill, Session, etc.)
        │   │   ├── repository/         # 10 Spring Data JPA Repositories
        │   │   ├── service/            # MatchingService, StudentService, AdminService
        │   │   └── controller/         # AuthController, MatchController, AdminController
        │   └── resources/
        │       ├── application.properties
        │       ├── schema.sql
        │       └── data.sql
        └── test/
            └── java/com/peerlearn/     # 15 Comprehensive JUnit 5 Test Cases
```

---

## 9. Windows 11 Setup & Execution Guide

Follow these step-by-step instructions in Windows 11 (PowerShell or Windows Terminal):

### Step 1: Verify Prerequisites
```powershell
# 1. Verify Java 21 LTS
java -version
# Expected: openjdk version "21.x.x"

# 2. Verify Maven (or use included mvnw.cmd)
mvn -version

# 3. Verify MySQL Server
mysql --version
```

### Step 2: Initialize MySQL Database
```sql
-- Connect to your local MySQL instance
mysql -u root -p

-- Create the PeerLearn database
CREATE DATABASE peerlearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify database creation
SHOW DATABASES;
EXIT;
```

> **Note:** If your MySQL password differs from default, set environment variables in Windows PowerShell:
> ```powershell
> $env:SPRING_DATASOURCE_USERNAME="root"
> $env:SPRING_DATASOURCE_PASSWORD="YourSecurePasswordHere"
> ```

### Step 3: Compile and Test with Maven
Navigate to the `spring-boot-backend` directory:
```powershell
cd spring-boot-backend

# Clean build and run automated unit tests
.\mvnw.cmd clean test
```

### Step 4: Package and Launch the Server
```powershell
# Build production executable JAR
.\mvnw.cmd clean package

# Run using Spring Boot plugin:
.\mvnw.cmd spring-boot:run

# Or run the compiled JAR directly:
java -jar target/peerlearn-platform-1.0.0.jar
```

---

## 10. Application URLs & Pre-configured Test Accounts

### Web URLs
- **Web Platform:** `http://localhost:8080` (or `http://localhost:3000` for client preview)
- **Student Dashboard:** `http://localhost:8080/dashboard`
- **Skill Match Explorer:** `http://localhost:8080/matches`
- **Admin Portal:** `http://localhost:8080/admin/login`

### Pre-configured Seed Accounts

| Role | Name | Email | Password Placeholder | Skill Pairing |
| :--- | :--- | :--- | :--- | :--- |
| **Student (A)** | Srija Chinta | `chintaassrija@gmail.com` | `[STUDENT_PASSWORD_A]` *(default: student123)* | Teaches: **Python** \| Learns: **Java** |
| **Student (B)** | Rahul Verma | `rahul.verma@cbit.ac.in` | `[STUDENT_PASSWORD_B]` *(default: student123)* | Teaches: **Java** \| Learns: **Python** |
| **Student (C)** | Ananya Sharma | `ananya.s@cbit.ac.in` | `[STUDENT_PASSWORD_C]` *(default: student123)* | Teaches: **UI/UX Figma** \| Learns: **React** |
| **Administrator**| System Admin | `admin@peerlearn.edu` | `[ADMIN_PASSWORD]` *(default: Admin@123)* | Full platform administration |

> **Security Note:** In production, replace default credentials and configure hashed passwords using BCrypt.

---

## 11. Git & Branching Strategy

PeerLearn utilizes a **3-tier Git branching workflow**:

```
[main]          ───●──────────────────────────●────── (Production-ready releases)
                    \                        /
[develop]            ───●──────────●────────●──────── (Active integration branch)
                         \        /
[feature/matching]        ───●──●                     (Isolated feature work)
```

1. **`main`**: Protected branch containing stable, release-ready code tested in staging.
2. **`develop`**: Central integration branch for ongoing sprint development and test builds.
3. **`feature/*`**: Feature-specific branches branched from `develop` and merged via Pull Requests.
   - Example: `feature/smart-matching`, `feature/session-calendar`, `feature/admin-analytics`.

### Essential Git Commands for Windows 11
```powershell
# Initialize Git repository
git init

# Check current branch and untracked files
git status

# Stage all files excluding those in .gitignore
git add .

# Create initial commit
git commit -m "Initial PeerLearn application"

# Create develop integration branch
git branch develop

# Create a feature branch
git checkout -b feature/smart-matching
```

---

## 12. Jenkins CI/CD Pipeline (Maven + Jenkins Automation)

PeerLearn features an automated 8-stage Declarative Pipeline defined in the root `Jenkinsfile` for continuous integration on Windows 11 and server environments.

### 12.1 Pipeline Stages Overview

```
[ Stage 1: Checkout ] ──► [ Stage 2: Env Check ] ──► [ Stage 3: Clean ] ──► [ Stage 4: Compile ]
         │
         ▼
[ Stage 5: Test (JUnit 5) ] ──► [ Stage 6: Package JAR ] ──► [ Stage 7: Archive ] ──► [ Stage 8: Build Summary ]
```

| Stage | Name | Action Performed | Failure Rule |
| :--- | :--- | :--- | :--- |
| **1** | **Checkout** | Clones code from GitHub repository | Fails if Git repository / branch is unreachable |
| **2** | **Environment Check** | Verifies Java 21 LTS and Maven wrapper permissions | Fails if Java 21 is missing |
| **3** | **Clean** | Removes stale `/target` directories and prior build artifacts | Fails on I/O lock |
| **4** | **Compile** | Compiles all Java 21 classes using Maven compiler plugin | Fails on syntax/compilation error |
| **5** | **Test** | Runs 15 automated JUnit 5 test suites; publishes Surefire reports | **Fails immediately if any test fails** (No skipped tests) |
| **6** | **Package** | Packages production Spring Boot executable JAR (`target/peerlearn-platform-1.0.0.jar`) | Fails on packaging error |
| **7** | **Archive** | Fingerprints and stores the `.jar` artifact in Jenkins build history | Fails if JAR is missing |
| **8** | **Build Summary** | Logs build execution summary, commit hash, and artifact paths | Always logs build outcome |

---

### 12.2 Windows 11 Jenkins Setup & Port Conflict Resolution

#### The Port 8080 Conflict:
By default, both **Jenkins** and **Spring Boot** attempt to listen on HTTP port `8080`.
To avoid `BindException: Address already in use`:

1. **Option A (Recommended): Run Jenkins on Port 8088 or 9090**
   - If running Jenkins via Windows installer or WAR file:
     ```powershell
     # Launch Jenkins on dedicated port 8088
     java -jar jenkins.war --httpPort=8088
     ```
   - If Jenkins was installed as a Windows Service, open `C:\Program Files\Jenkins\jenkins.xml` and change:
     ```xml
     <arguments>... --httpPort=8088</arguments>
     ```
     Restart the service: `Restart-Service jenkins`
   - Access Jenkins at: `http://localhost:8088`
   - Spring Boot runs uninterrupted on: `http://localhost:8080`

2. **Option B: Run Spring Boot on Port 8082**
   - Add to `spring-boot-backend/src/main/resources/application.properties`:
     ```properties
     server.port=8082
     ```

#### Required Jenkins Plugins:
Ensure these plugins are installed under **Manage Jenkins > Plugins > Available Plugins**:
- **Pipeline** (Workflow Aggregator)
- **Git Plugin**
- **Credentials Binding Plugin**
- **JUnit Plugin** (for publishing test result charts)

#### Tools Configuration in Jenkins:
1. Navigate to **Manage Jenkins > Tools**.
2. Under **JDK installations**:
   - Name: `Java21`
   - JAVA_HOME: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot` (or your JDK 21 installation path).
   - Uncheck "Install automatically" if using your local JDK.

---

### 12.3 Connect GitHub to Jenkins (Pipeline Job Setup)

1. Open Jenkins Dashboard (`http://localhost:8088`).
2. Click **New Item** > Enter `PeerLearn-CI` > Select **Pipeline** > Click **OK**.
3. Under **General**, check "GitHub project" and paste: `https://github.com/YOUR_GITHUB_USERNAME/PeerLearn/`
4. Under **Build Triggers**:
   - For automatic local testing without public IP: Check **Poll SCM** and set Schedule to `H/5 * * * *` (polls every 5 minutes).
   - For webhooks: Check **GitHub hook trigger for GITScm polling**.
5. Under **Pipeline**:
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: `https://github.com/YOUR_GITHUB_USERNAME/PeerLearn.git`
   - **Credentials**:
     - *Public Repository:* None needed.
     - *Private Repository:* Click **Add > Jenkins** > Kind: `Username with password` or `Secret text` > Enter your GitHub Personal Access Token (PAT).
   - **Branch Specifier**: `*/main`
   - **Script Path**: `Jenkinsfile`
6. Click **Save**.

---

### 12.4 Webhook vs. Localhost Polling Configuration

- **The Localhost Limitation:** When Jenkins runs on `localhost` (behind a home router or NAT), GitHub's servers on the public Internet cannot deliver HTTP POST requests directly to `http://localhost:8088/github-webhook/`.
- **Solution 1 (Recommended for Local Dev):** Use **Poll SCM** (`H/5 * * * *`). Jenkins checks GitHub every 5 minutes for new commits on `main` and triggers builds automatically.
- **Solution 2 (Real Webhooks via Secure Tunnel):** Use `ngrok` to expose port 8088:
  ```powershell
  ngrok http 8088
  ```
  In GitHub Repository > **Settings > Webhooks > Add webhook**:
  - Payload URL: `https://your-ngrok-subdomain.ngrok-free.app/github-webhook/`
  - Content type: `application/json`
  - Events: `Just the push event`

---

### 12.5 Triggering & Verifying the Pipeline

Click **Build Now** in the `PeerLearn-CI` job dashboard.

#### Jenkins Dashboard Pipeline View:
```
+---------------------------------------------------------------------------------------------------------+
|                                  PeerLearn-CI [Pipeline Stages]                                         |
+---------------+-------------------+---------------+---------------+---------------+---------------------+
|   Checkout    |  Environment Check|     Clean     |    Compile    |     Test      |   Package & Archive |
|    (8s)       |       (3s)        |     (5s)      |     (12s)     |     (18s)     |        (15s)        |
|    SUCCESS    |     SUCCESS       |    SUCCESS    |    SUCCESS    | 15/15 Passed  |  JAR Created (42MB) |
+---------------+-------------------+---------------+---------------+---------------+---------------------+
```

> **Jenkins Dashboard Screenshot Placeholder:**  
> `![Jenkins Pipeline Execution Dashboard](./docs/screenshots/jenkins-pipeline-dashboard.png)`

#### Artifacts Generated:
Upon successful build, the packaged JAR is fingerprinted and downloadable directly from the Jenkins build page:
`target/peerlearn-platform-1.0.0.jar`

---

---

## 13. Docker Containerization & Multi-Container Setup

PeerLearn utilizes modern containerization for seamless reproducibility, environment parity, and production scalability.

```
+-------------------------------------------------------------------------------------------------------+
|                                    Docker Compose Architecture                                        |
|                                                                                                       |
|  [ Client Browser ] ---> http://localhost:8080                                                        |
|                                |                                                                      |
|             +------------------v--------------------+                                                 |
|             |        peerlearn-app:1.0              |                                                 |
|             |  (Spring Boot 3.3.4 + Java 21)        |                                                 |
|             |  User: non-root 'spring:spring'       |                                                 |
|             |  Port: 8080 exposed                   |                                                 |
|             |  Healthcheck: /actuator/health        |                                                 |
|             +------------------+--------------------+                                                 |
|                                |                                                                      |
|                     [ peerlearn-network (Bridge) ]                                                    |
|                                |                                                                      |
|             +------------------v--------------------+        +-------------------------------------+  |
|             |        peerlearn-mysql                |        |        Named Persistent Volume      |  |
|             |  (MySQL 8.0 Community Server)         |<======>|        'peerlearn_mysql_data'       |  |
|             |  Port: 3306 exposed                   |        |        (/var/lib/mysql)             |  |
|             |  Auto-init: schema.sql & data.sql     |        +-------------------------------------+  |
|             |  Healthcheck: mysqladmin ping         |                                                 |
|             +---------------------------------------+                                                 |
+-------------------------------------------------------------------------------------------------------+
```

### 13.1 Dockerfile Architecture (Multi-Stage Build)

The project includes a production-grade multi-stage `Dockerfile` adhering to enterprise security best practices:

- **Stage 1: Maven Builder (`maven:3.9.6-eclipse-temurin-21-alpine`)**
  - Compiles the application with Java 21.
  - Executes automated unit tests (`-DskipTests=false`).
  - Packages the Spring Boot executable JAR: `peerlearn-platform-1.0.0.jar`.
  - Excludes source code, tests, and Maven dependencies from the final image, minimizing image surface area.

- **Stage 2: Runtime Environment (`eclipse-temurin:21-jre-alpine`)**
  - Lightweight Alpine Linux base (~180MB total size).
  - Dedicated non-root user `spring` (UID/GID) for enhanced container security.
  - Built-in container `HEALTHCHECK` probing `http://localhost:8080/actuator/health`.
  - Configurable dynamic environment variables for database credentials.

### 13.2 Environment Variables

All database connection parameters are passed via environment variables (no hardcoded passwords):

| Environment Variable | Default Value | Description |
|---|---|---|
| `DB_HOST` | `mysql` | MySQL hostname (service name in docker-compose) |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `peerlearn_db` | Target database name |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | `root` | Database password |
| `SPRING_PROFILES_ACTIVE` | `prod` | Spring Boot active profile |

### 13.3 Building the Docker Image

To build the standalone Docker image from the project root:

```powershell
# Build image tagged peerlearn-app:1.0
docker build -t peerlearn-app:1.0 .

# Verify image in local Docker engine
docker images | findstr peerlearn-app
```

### 13.4 Running the Full Stack with Docker Compose

Run both the Spring Boot application and MySQL 8.0 together with a single command:

```powershell
# Start all services in the background and build the image
docker compose up -d --build

# Verify running container status and health
docker compose ps

# Inspect logs
docker compose logs -f peerlearn-app
docker compose logs -f mysql
```

Once both containers report healthy:
- **Application URL:** `http://localhost:8080`
- **Health Endpoint:** `http://localhost:8080/actuator/health`

### 13.5 Container Lifecycle & Management Commands

```powershell
# List running containers
docker ps

# Stop the application container
docker stop peerlearn-app

# Restart the application container
docker start peerlearn-app

# Inspect application container logs
docker logs -f peerlearn-app

# Stop all services gracefully (preserves database data)
docker compose down
```

> ⚠️ **CRITICAL DATA SAFETY WARNING:**  
> Never run `docker compose down -v`. The `-v` flag deletes all named volumes (`peerlearn_mysql_data`), which permanently removes all student accounts, session history, and skill records. Plain `docker compose down` safely stops containers while preserving the volume.

### 13.6 Database Persistence Verification

1. Start containers with `docker compose up -d`.
2. Register a new student or create an exchange request on `http://localhost:8080`.
3. Stop containers: `docker compose down`.
4. Restart containers: `docker compose up -d`.
5. Re-open `http://localhost:8080` — verify that all created students, skills, and session records remain intact because MySQL data is preserved inside the `peerlearn_mysql_data` Docker volume.

### 13.7 Jenkins + Docker Pipeline Integration

The root `Jenkinsfile` includes 6 automated declarative stages:
1. **Checkout:** Clones latest commit from GitHub repository.
2. **Maven Build:** Compiles Java 21 classes using Maven wrapper.
3. **Test:** Executes JUnit 5 unit tests with Surefire report archiving.
4. **Package:** Produces `peerlearn-platform-1.0.0.jar` executable artifact.
5. **Docker Build:** Builds `peerlearn-app:1.0` using Docker Engine.
6. **Docker Image Verification:** Inspects image ID, size, and entrypoint.

#### Troubleshooting Docker in Jenkins on Windows 11:
- **Issue:** Jenkins fails with `docker: command not found` or `permission denied`.
- **Root Cause:** When Jenkins runs as a Windows Service (`NT AUTHORITY\SYSTEM`), it may not have permission to communicate with the Docker Desktop named pipe (`\\.\pipe\docker_engine`).
- **Resolution:**
  1. Open PowerShell as Administrator.
  2. Add the SYSTEM account to the `docker-users` group:
     ```powershell
     net localgroup docker-users "NT AUTHORITY\SYSTEM" /add
     ```
  3. In Docker Desktop > Settings > Advanced: Enable *"Expose daemon on tcp://localhost:2375 without TLS"* (if needed for localhost pipelines).
  4. Restart Jenkins Windows service:
     ```powershell
     Restart-Service jenkins
     ```

---

## 14. Kubernetes Deployment & Orchestration Guide (k8s)

PeerLearn provides complete, modular Kubernetes manifests configured in the `k8s/` directory. The deployment implements enterprise microservices best practices, including namespace isolation, PersistentVolume storage for MySQL data durability, Kubernetes Secrets for non-plaintext credentials, resource constraints (requests/limits), Spring Boot Actuator probes, and internal DNS service discovery.

```
+-----------------------------------------------------------------------------------------------------------------------+
|                                             Kubernetes Cluster (Namespace: peerlearn)                                  |
|                                                                                                                       |
|  [ Web Browser / Client ] ---> http://localhost:30080                                                                 |
|                                       |                                                                               |
|                   +-------------------v-------------------+                                                           |
|                   |  Service: peerlearn-app-service       |                                                           |
|                   |  Type: NodePort (Port 30080 -> 8080)  |                                                           |
|                   +-------------------+-------------------+                                                           |
|                                       |                                                                               |
|                   +-------------------v-------------------+                                                           |
|                   |  Deployment: peerlearn-app-deployment |                                                           |
|                   |  Pod: peerlearn-app-xxxx-yyyy         |                                                           |
|                   |  Image: peerlearn-app:1.0             |                                                           |
|                   |  Liveness Probe: /actuator/health     |                                                           |
|                   |  Readiness Probe: /actuator/health    |                                                           |
|                   |  Env: DB_HOST = mysql-service         |                                                           |
|                   |  Resources: 512Mi-1024Mi, 250m-1000m  |                                                           |
|                   +-------------------+-------------------+                                                           |
|                                       | (Internal ClusterIP DNS: mysql-service:3306)                                  |
|                   +-------------------v-------------------+                                                           |
|                   |  Service: mysql-service               |                                                           |
|                   |  Type: ClusterIP (Port 3306)          |                                                           |
|                   +-------------------+-------------------+                                                           |
|                                       |                                                                               |
|                   +-------------------v-------------------+          +--------------------------------------------+   |
|                   |  Deployment: mysql-deployment         |          |  PersistentVolumeClaim: mysql-pvc          |   |
|                   |  Pod: mysql-xxxx-yyyy (MySQL 8.4)     |<========>|  Access: ReadWriteOnce                     |   |
|                   |  Probe: mysqladmin ping               |          |  Storage: 2Gi (retained across restarts)   |   |
|                   |  Resources: 256Mi-1024Mi, 250m-1000m  |          +--------------------------------------------+   |
|                   +---------------------------------------+                                                           |
|                                       ^                                                                               |
|                                       |                                                                               |
|                   +-------------------+-------------------+                                                           |
|                   |  Secret: peerlearn-db-secret          |                                                           |
|                   |  (Root password, DB credentials)      |                                                           |
|                   +---------------------------------------+                                                           |
+-----------------------------------------------------------------------------------------------------------------------+
```

### 14.1 Manifest Catalog & Architecture

All manifests are organized under `/k8s/`:

| Manifest File | Kind | Description & Architectural Purpose |
|---|---|---|
| `k8s/00-namespace.yaml` | `Namespace` | Creates isolated `peerlearn` namespace for strict multitenancy and RBAC boundaries. |
| `k8s/01-secret.yaml` | `Secret` | Stores database credentials and root password securely without committing plaintext values. |
| `k8s/02-mysql-pvc.yaml` | `PersistentVolumeClaim` | Requests `2Gi` persistent disk storage so student data, sessions, and skills survive pod failures. |
| `k8s/03-mysql-deployment.yaml` | `Deployment` | Runs single-instance MySQL 8.4 engine mounted to the PVC with liveness/readiness probes. |
| `k8s/04-mysql-service.yaml` | `Service` | Exposes MySQL inside the cluster on port `3306` via internal DNS (`mysql-service`). |
| `k8s/05-app-deployment.yaml` | `Deployment` | Runs Spring Boot app (`peerlearn-app:1.0`), connects via `DB_HOST=mysql-service`, with probes & resources. |
| `k8s/06-app-service.yaml` | `Service` | Exposes application externally via `NodePort` on port `30080` (mapped to container port `8080`). |
| `k8s/kustomization.yaml` | `Kustomization` | Bundles all resources for one-line declarative deployment and deletion. |

---

### 14.2 Step-by-Step Windows CMD Deployment Guide

Follow these exact steps from a **Command Prompt (CMD)** on Windows 11:

#### Step 1: Verify Kubernetes & Docker Desktop

1. Open **Docker Desktop**.
2. Click **Settings** (gear icon) -> **Kubernetes**.
3. Check **Enable Kubernetes** and click **Apply & restart**.
4. In Windows CMD, verify both Docker and `kubectl`:

```cmd
:: Check kubectl client and cluster version
kubectl version --client

:: Verify Kubernetes cluster connection
kubectl cluster-info

:: Verify Docker image exists locally
docker images | findstr peerlearn-app
```

> **Note:** If `peerlearn-app:1.0` does not exist, build it first:
> ```cmd
> docker build -t peerlearn-app:1.0 .
> ```

---

#### Step 2: Deploy All Kubernetes Resources

Navigate to your PeerLearn project root in CMD:

```cmd
cd /d "C:\Users\YOUR_USERNAME\PeerLearn"
```

Apply all resources using either `kustomization` or the folder directly:

```cmd
:: Option A: Apply all manifests in the k8s folder (Recommended)
kubectl apply -f k8s/

:: Option B: Apply using Kustomize
kubectl apply -k k8s
```

**Expected Command Output:**
```text
namespace/peerlearn created
secret/peerlearn-db-secret created
persistentvolumeclaim/mysql-pvc created
deployment.apps/mysql-deployment created
service/mysql-service created
deployment.apps/peerlearn-app-deployment created
service/peerlearn-app-service created
```

---

#### Step 3: Monitor Pod Startup and Verification

Watch the deployment status until both pods report `STATUS: Running` and `READY: 1/1`:

```cmd
:: Watch pods in real-time (Press Ctrl+C to stop watching)
kubectl get pods -n peerlearn -w
```

Check the status of all created Kubernetes objects:

```cmd
:: Inspect all resources in peerlearn namespace
kubectl get all -n peerlearn

:: Verify Persistent Volume Claim is Bound
kubectl get pvc -n peerlearn
```

**Sample Output:**
```text
NAME                                            READY   STATUS    RESTARTS   AGE
pod/mysql-deployment-7bb5df579d-q8k92           1/1     Running   0          45s
pod/peerlearn-app-deployment-6df9cf5bc9-x8j21   1/1     Running   0          40s

NAME                            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/mysql-service           ClusterIP   10.96.142.33     <none>        3306/TCP         45s
service/peerlearn-app-service   NodePort    10.104.225.109   <none>        8080:30080/TCP   45s

NAME                       STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/mysql-pvc   Bound    pvc-87d46c82-df76-4c7b-b5ee-507ffcc8540c   2Gi        RWO            hostpath       45s
```

---

#### Step 4: Inspecting Application and Database Logs

To stream live logs from the Spring Boot application pod:

```cmd
:: Stream Spring Boot application logs
kubectl logs -f -l app=peerlearn-app -n peerlearn

:: Stream MySQL database engine logs
kubectl logs -f -l app=mysql -n peerlearn
```

To troubleshoot or inspect detailed events (useful if a pod stays in `Pending` or `CrashLoopBackOff`):

```cmd
:: Describe PeerLearn application pod
kubectl describe deployment peerlearn-app-deployment -n peerlearn

:: Describe MySQL pod
kubectl describe deployment mysql-deployment -n peerlearn
```

---

#### Step 5: Accessing the Application

Once both pods are `Running` and `Ready`:

1. **Direct NodePort Access (Docker Desktop Kubernetes):**
   Open your browser and navigate to:
   **`http://localhost:30080`**

2. **Health Check Endpoint:**
   **`http://localhost:30080/actuator/health`**  
   Returns: `{"status":"UP","components":{"db":{"status":"UP"},"diskSpace":{"status":"UP"},"livenessState":{"status":"UP"},"ping":{"status":"UP"},"readinessState":{"status":"UP"}}}`

3. **Port-Forwarding Fallback (If NodePort is blocked by firewall):**
   ```cmd
   kubectl port-forward svc/peerlearn-app-service 8080:8080 -n peerlearn
   ```
   Then open: **`http://localhost:8080`**

4. **Minikube Users (If using Minikube instead of Docker Desktop):**
   ```cmd
   minikube service peerlearn-app-service -n peerlearn
   ```

---

#### Step 6: Testing Kubernetes High Availability & Persistent Storage

To prove that student data is safely preserved across pod terminations:

1. Open `http://localhost:30080` and log in or register a new student account.
2. In CMD, delete the running MySQL pod to simulate a hardware or container failure:
   ```cmd
   kubectl delete pod -l app=mysql -n peerlearn
   ```
3. Watch Kubernetes automatically provision a new replacement MySQL pod:
   ```cmd
   kubectl get pods -n peerlearn -w
   ```
4. Refresh `http://localhost:30080` once the new MySQL pod is ready.
5. All students, sessions, and exchanged skills remain intact because the volume was retained by `mysql-pvc`.

---

#### Step 7: Teardown and Cleanup Commands

When finished testing, remove all Kubernetes resources cleanly:

```cmd
:: Delete all resources created in the peerlearn namespace
kubectl delete -f k8s/

:: Or delete via Kustomize
kubectl delete -k k8s

:: Or delete the entire namespace (deletes all resources inside it)
kubectl delete namespace peerlearn
```

---

## 15. Contributors & Authors

- **PeerLearn DevOps Engineering Team**
- **Academic Case Study Lead:** Student Skill Exchange Initiative
- **Contact:** `support@peerlearn.edu`

---

## 16. License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for full details.

