node {
stage("Git Clone"){

git branch: 'main', url: 'https://github.com/surya5826/Claims-UI.git'
}
//   stage("mvn clean"){
//   sh 'mvn clean package'
//   }
stage("Docker build"){  
 sh 'docker build -t claims-ui:latest .'
sh 'docker images'
stage("Deploy"){
 sh 'docker rm -f claims-ui||true'
sh ' docker run -d -p 8899:80 --name claims-ui claims-ui:latest'
}
}
}
