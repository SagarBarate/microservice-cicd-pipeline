pipeline {
    agent any

    // environment {
    //     // Optionally set Maven options, tokens, etc.
    //     SONAR_HOST_URL = 'http://localhost:9000'
    //     SONAR_LOGIN = 'YOUR_SONAR_TOKEN'
    // }
    
    stages {
        stage('Checkout') {
            steps {
                // Clones the full repository from GitHub
                git branch: 'main', url: 'https://github.com/SagarBarate/microservice-cicd-pipeline.git'
            }
        }
        stage('Build') {
            steps {
                // Change directory into Shipment-service if the project is located there
                dir('Shipment-service') {
                    sh 'mvn clean install'
                }
            }
        }
        stage('Static Code Analysis') {
            steps {
                dir('Shipment-service') {
                    // Execute SonarQube analysis; ensure your SonarQube server is running
                    sh "mvn sonar:sonar -Dsonar.projectKey=ShipmentService -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=${SONAR_LOGIN}"
                }
            }
        }
        stage('Test') {
            steps {
                dir('Shipment-service') {
                    // Run tests (unit/integration) with Maven
                    sh 'mvn test'
                }
            }
            post {
                always {
                    // Publish JUnit test reports
                    junit 'Shipment-service/target/surefire-reports/*.xml'
                }
            }
        }
        stage('Archive Artifact') {
            steps {
                dir('Shipment-service') {
                    // Archive the JAR artifact for later stages or downloads
                    archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline encountered errors. Please check the logs.'
        }
    }
}
