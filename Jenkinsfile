// Parcel Trail CI/CD: Checkout -> Build -> Test -> Deploy (Ansible) -> Verify
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
        // On Windows agents, uncomment and adjust if docker is not on the service PATH:
        // PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin;${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Uses the repository configured in the Jenkins job (Pipeline from SCM)
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

        stage('Deploy with Ansible') {
            steps {
                // Fails the build if Ansible or the health check fails
                run "ansible-playbook -i inventory.ini courier-deploy.yml -e image_tag=${BUILD_NUMBER}"
            }
        }
    }

    post {
        success { echo "Deployed build ${BUILD_NUMBER}: http://localhost:${APP_PORT}" }
        failure { echo "Build ${BUILD_NUMBER} failed. Check the stage logs above." }
        cleanup { run "docker image prune -f" }
    }
}
