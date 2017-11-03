IMAGE_NAME=puppyrender
IMAGE_TAG=latest

IMAGE_NAMETAG=${IMAGE_NAME}:${IMAGE_TAG}

if [[ "$(docker images -q ${IMAGE_NAMETAG} 2> /dev/null)" == "" ]]; then
  docker rmi ${IMAGE_NAMETAG}
fi

docker build -t ${IMAGE_NAMETAG} .