import jenkins.plugins.rocketchatnotifier.model.MessageAttachment
List<String> messagesList = new ArrayList<String>();

pipeline {
	agent{
		label 'general'
	}

	parameters{
		string(
			name: 'ENVIRONMENT',
			defaultValue: 'develop',
			description: 'Default environment'
		)
		string(
			name: 'GIT_URL',
			defaultValue: 'https://github.com/Ilhasoft/weni-marketplace-webapp.git',
			description: 'Git Repository URL'
		)
		string(
			name: 'GIT_BRANCH',
			defaultValue: 'main',
			description: 'Git Repository Branch'
		)
		// Docker
		credentials(
			name: 'AWS_ECR_CREDENTIALS',
			defaultValue: 'aws-push-ecr',
			description: 'AWS ECR Credentials',
		)
		string(
			name: 'DOCKER_REPOSITORY_NAME',
			defaultValue: 'push-backend',
			description: 'Docker Image Name'
		)
		string(
			name: 'DOCKER_REGISTRY',
			defaultValue: '242357350604.dkr.ecr.sa-east-1.amazonaws.com',
			description: 'Docker Registry'
		)
		string(
			name: 'ECR_REGION',
			defaultValue: 'sa-east-1',
			description: 'ECR Region'
		)
	}

	environment{
		DOCKER_REGISTRY = "${params.DOCKER_REGISTRY}"
		DOCKER_REPOSITORY_NAME = "${params.DOCKER_REPOSITORY_NAME}"
		DOCKER_IMAGE_NAME = "${env.DOCKER_REGISTRY}/${env.DOCKER_REPOSITORY_NAME}"
	}

	stages{
		stage('Build Image'){
			when{
				tag 'release-*'
			}
			steps{
				script{
					//try {
					docker.withRegistry("${env.DOCKER_REGISTRY}") {
						docker.build("${env.DOCKER_IMAGE_NAME}")
					}
					// rocketConcatMessage(true, messagesList)
					//} catch (exc) {
					//  rocketConcatMessage(false, messagesList)
					//}
				}
			}
		}
		stage('Push Image'){
			when{
				tag 'release-*'
			}
			steps{
				script{
					//try {
					docker.withRegistry("https://${env.DOCKER_REGISTRY}", "ecr:${params.ECR_REGION}:${params.AWS_ECR_CREDENTIALS}"){
						docker.image("${env.DOCKER_IMAGE_NAME}").push("marketplace-front-${params.ENVIRONMENT}-"+TAG_NAME.minus('release-'))
					}
					//rocketConcatMessage(true, messagesList)
					//}catch(exc){
					//	rocketConcatMessage(false, messagesList)
					//}
				}
			}
		}
		stage('RocketChat - Notifications'){
			steps{
				script{
					rocketSendMessage(messagesList)
				}
			}
		}
	}
}

def rocketConcatMessage(success, messagesList) {
	script {
		def status='Failed'
		def color='red'

		if( success ){
			status='Success'    
			color='green's
		}
		messagesList.add("${color}, ${status}, ${env.STAGE_NAME}")

		if( success==false ){
			rocketSendMessage(messagesList)
			error 'Something failed...'
		}
	}
}

def rocketSendMessage(messagesList) {
	// script {
	//     def avatar_failed = 'https://push-inbox.s3.amazonaws.com/logos/jenkins/rage.png'
	//     def avatar = 'https://push-inbox.s3.amazonaws.com/logos/jenkins/good.png'

	//     def attachments = []
	//     def is_failed = false

	//     for (String i: messagesList) {
	//         message = i.split(', ')

	//         def attachment = [:]
	//         attachment['$class'] = 'MessageAttachment'
	//         attachment['color'] = message[0]
	//         attachment['text'] = message[1]
	//         attachment['collapsed'] = false
	//         attachment['authorName'] = message[2]

	//         attachments.add(attachment)

	//         if (message[1] == 'Failed') {
	//             avatar = avatar_failed
	//         }
	//     }

	//     rocketSend(
	//         channel: 'devops-alerts',
	//         attachments: attachments,
	//         avatar: avatar,
	//         message: "*Pipeline:* ${env.JOB_NAME} - *Build:* ${env.BUILD_NUMBER} - *URL:* ${env.BUILD_URL}",
	//         rawMessage: true,
	//         failOnError: false
	//     )
	// }
}

