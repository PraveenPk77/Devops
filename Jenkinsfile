// Parcel Trail CI/CD: Checkout -> Build -> Test -> Deploy -> Verify
// Works on Linux agents (sh) and Windows agents (bat).
def run(String cmd) {
    if (isUnix()) { sh cmd } else { bat cmd }
}

pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        IMAGE_NAME = 'parcel-trail'
        APP_PORT   = '5003'
        // Common Docker Desktop installation paths on Windows agents:
        PATH       = "C:\\Users\\dhars\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;C:\\Program Files\\Docker\\Docker\\resources\\bin;${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build image') {
            steps {
                run "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Test') {
            steps {
                // Tests run inside the freshly built image, so CI matches production
                run "docker run --rm ${IMAGE_NAME}:${BUILD_NUMBER} python -m pytest -q"
            }
        }

        stage('Deploy') {
            steps {
                script {
                    if (isUnix()) {
                        sh "ansible-playbook -i inventory.ini courier-deploy.yml -e image_tag=${BUILD_NUMBER}"
                    } else {
                        // Direct Docker deployment on Windows agents (where native Ansible is unavailable)
                        bat """
                            docker volume create parcel_trail_data 2>nul || ver >nul
                            docker stop parcel-trail-app 2>nul || ver >nul
                            docker rm parcel-trail-app 2>nul || ver >nul
                            docker run -d --name parcel-trail-app -p ${APP_PORT}:5000 -v parcel_trail_data:/app/data ${IMAGE_NAME}:${BUILD_NUMBER}
                        """
                    }
                }
            }
        }
    }

    post {
        success { echo "Deployed build ${BUILD_NUMBER}: http://localhost:${APP_PORT}" }
        failure { echo "Build ${BUILD_NUMBER} failed. Check the stage logs above." }
        cleanup { run "docker image prune -f" }
    }
}

