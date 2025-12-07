/**
 * Jenkins Pipeline for Cypress Test Automation
 * 
 * Prerequisites:
 * - Node.js installed on Jenkins agent
 * - Chrome/Firefox browser installed
 * - Jenkins credentials configured for test credentials
 * 
 * This pipeline is configured for MANUAL trigger only.
 * Remove the 'when' conditions if you want automatic triggers.
 */

pipeline {
    agent any
    
    // Manual trigger - no automatic builds
    triggers {
        // Uncomment below for scheduled runs
        // cron('0 6 * * *')  // Run daily at 6 AM
    }
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['qa', 'staging', 'prod'],
            description: 'Select the environment to run tests against'
        )
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox', 'edge', 'electron'],
            description: 'Select the browser for test execution'
        )
        choice(
            name: 'TEST_TYPE',
            choices: ['all', 'smoke', 'regression', 'api'],
            description: 'Select the type of tests to run'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Run tests in headed mode (visible browser)'
        )
        booleanParam(
            name: 'GENERATE_ALLURE',
            defaultValue: true,
            description: 'Generate Allure report'
        )
    }
    
    environment {
        // Node.js configuration
        NODE_VERSION = '20'
        
        // Cypress configuration from Jenkins credentials
        CYPRESS_BASE_URL = credentials('cypress-base-url')
        CYPRESS_USERNAME = credentials('cypress-username')
        CYPRESS_PASSWORD = credentials('cypress-password')
        CYPRESS_API_BASE_URL = credentials('cypress-api-base-url')
        
        // Report paths
        REPORTS_DIR = 'cypress/reports'
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
    }
    
    tools {
        nodejs 'NodeJS-20'  // Configure this in Jenkins Global Tool Configuration
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out branch: ${env.BRANCH_NAME}"
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                echo 'Dependencies installed successfully'
            }
        }
        
        stage('Verify Cypress') {
            steps {
                sh 'npx cypress verify'
                sh 'npx cypress info'
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    def testCommand = "npx cypress run"
                    
                    // Add browser
                    testCommand += " --browser ${params.BROWSER}"
                    
                    // Add headed mode if selected
                    if (params.HEADED) {
                        testCommand += " --headed"
                    }
                    
                    // Add environment config
                    testCommand += " --env configFile=${params.ENVIRONMENT}"
                    
                    // Add test type filter
                    switch(params.TEST_TYPE) {
                        case 'smoke':
                            testCommand += " --env grepTags=@smoke"
                            break
                        case 'regression':
                            testCommand += " --env grepTags=@regression"
                            break
                        case 'api':
                            testCommand += " --spec 'cypress/e2e/api/**/*.cy.js'"
                            break
                        default:
                            // Run all tests
                            break
                    }
                    
                    // Execute tests
                    sh testCommand
                }
            }
        }
        
        stage('Generate Mochawesome Report') {
            when {
                expression { return true }
            }
            steps {
                sh 'npm run report:full || true'
            }
        }
        
        stage('Generate Allure Report') {
            when {
                expression { return params.GENERATE_ALLURE }
            }
            steps {
                sh 'npm run allure:generate || true'
            }
        }
    }
    
    post {
        always {
            // Archive test artifacts
            archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/reports/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-results/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-report/**/*', allowEmptyArchive: true
            
            // Publish HTML reports
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'cypress/reports/html',
                reportFiles: 'report.html',
                reportName: 'Mochawesome Report'
            ])
            
            // Publish Allure report (requires Allure Jenkins plugin)
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
            
            // Clean workspace
            cleanWs(
                cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true
            )
        }
        
        success {
            echo 'Tests completed successfully!'
            // Uncomment to send email on success
            // emailext (
            //     subject: "SUCCESS: Cypress Tests - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            //     body: "Tests passed. View report: ${env.BUILD_URL}",
            //     to: "${env.EMAIL_RECIPIENTS}"
            // )
        }
        
        failure {
            echo 'Tests failed!'
            // Uncomment to send email on failure
            // emailext (
            //     subject: "FAILED: Cypress Tests - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            //     body: "Tests failed. View report: ${env.BUILD_URL}",
            //     to: "${env.EMAIL_RECIPIENTS}",
            //     attachmentsPattern: 'cypress/screenshots/**/*'
            // )
        }
    }
}
