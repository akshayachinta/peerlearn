pipeline {
    agent any

    tools {
        jdk 'Java21'
    }

    environment {
        APP_DIR = 'spring-boot-backend'
        IMAGE_NAME = 'peerlearn-app'
        IMAGE_TAG = '1.0'
    }

    stages {
        stage('1. Checkout') {
            steps {
                echo '=== Stage 1: Checkout Source Code from GitHub ==='
                checkout scm
            }
        }

        stage('2. Maven Build') {
            steps {
                echo '=== Stage 2: Compile Source Code with Maven ==='
                script {
                    if (isUnix()) {
                        sh '''
                            if [ -f "./mvnw" ]; then chmod +x ./mvnw; fi
                            if [ -f "./spring-boot-backend/mvnw" ]; then chmod +x ./spring-boot-backend/mvnw; fi
                            if [ -d "spring-boot-backend" ]; then
                                cd spring-boot-backend && ./mvnw compile
                            else
                                ./mvnw compile
                            fi
                        '''
                    } else {
                        bat '''
                            @echo off
                            echo Compiling PeerLearn Java 21 Spring Boot application...
                            if exist spring-boot-backend (
                                cd spring-boot-backend && mvnw.cmd compile
                            ) else (
                                mvnw.cmd compile
                            )
                        '''
                    }
                }
            }
        }

        stage('3. Test') {
            steps {
                echo '=== Stage 3: Execute Automated JUnit 5 Unit Tests ==='
                script {
                    if (isUnix()) {
                        sh '''
                            if [ -d "spring-boot-backend" ]; then
                                cd spring-boot-backend && ./mvnw test
                            else
                                ./mvnw test
                            fi
                        '''
                    } else {
                        bat '''
                            @echo off
                            echo Running JUnit 5 test suite...
                            if exist spring-boot-backend (
                                cd spring-boot-backend && mvnw.cmd test
                            ) else (
                                mvnw.cmd test
                            )
                        '''
                    }
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                }
            }
        }

        stage('4. Package') {
            steps {
                echo '=== Stage 4: Package Spring Boot Executable JAR ==='
                script {
                    if (isUnix()) {
                        sh '''
                            if [ -d "spring-boot-backend" ]; then
                                cd spring-boot-backend && ./mvnw package -DskipTests=true
                            else
                                ./mvnw package -DskipTests=true
                            fi
                        '''
                    } else {
                        bat '''
                            @echo off
                            echo Packaging Spring Boot JAR artifact...
                            if exist spring-boot-backend (
                                cd spring-boot-backend && mvnw.cmd package -DskipTests=true
                            ) else (
                                mvnw.cmd package -DskipTests=true
                            )
                        '''
                    }
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true, allowEmptyArchive: false
                }
            }
        }

        stage('5. Docker Build') {
            steps {
                echo '=== Stage 5: Build Docker Container Image (peerlearn-app:1.0) ==='
                script {
                    if (isUnix()) {
                        sh '''
                            echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                            docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                        '''
                    } else {
                        bat '''
                            @echo off
                            echo Building Docker image: %IMAGE_NAME%:%IMAGE_TAG%
                            docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
                            if %ERRORLEVEL% NEQ 0 (
                                echo [ERROR] Docker build failed.
                                echo Diagnostic note for Windows 11:
                                echo 1. Verify Docker Desktop is actively running.
                                echo 2. Ensure Jenkins user is added to 'docker-users' local group:
                                echo    net localgroup docker-users "NT AUTHORITY\\SYSTEM" /add
                                exit /b 1
                            )
                        '''
                    }
                }
            }
        }

        stage('6. Docker Image Verification') {
            steps {
                echo '=== Stage 6: Verify Docker Image Creation and Metadata ==='
                script {
                    if (isUnix()) {
                        sh '''
                            echo "Verifying local Docker images..."
                            docker images | grep "${IMAGE_NAME}"
                            echo "Inspecting Docker image metadata..."
                            docker inspect --format='Image ID: {{.Id}} | Size: {{.Size}} bytes | Created: {{.Created}}' ${IMAGE_NAME}:${IMAGE_TAG}
                        '''
                    } else {
                        bat '''
                            @echo off
                            echo Verifying created Docker image in local engine repository:
                            docker images | findstr %IMAGE_NAME%
                            echo Inspecting container entrypoint and exposed ports:
                            docker inspect --format="Image ID: {{.Id}} | OS: {{.Os}} | Size: {{.Size}} bytes" %IMAGE_NAME%:%IMAGE_TAG%
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "SUCCESS: PeerLearn CI/CD pipeline completed all 6 stages successfully!"
            echo "Artifacts generated: peerlearn-platform-1.0.0.jar & Docker image peerlearn-app:1.0"
        }
        failure {
            echo "FAILURE: Pipeline execution failed. Please inspect build and test logs above."
        }
    }
}
