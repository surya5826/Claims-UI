node {
stage("Git Clone"){

git branch: 'main', url: 'https://github.com/surya5826/Claims-UI.git'
}
  stage("mvn clean"){
  sh 'mvn clean package'
  }
stage("Docker build"){  
 sh 'docker build -t claims-ui:latest .'
sh 'docker images'
stage("Deploy"){
 sh 'docker rm -f claims-ui||true'
sh ' docker run -d -p 9999:9999 --name claims-ui claims-ui:latest'
}
}
}
