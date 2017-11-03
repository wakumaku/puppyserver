IMAGE_NAME=puppyrender
IMAGE_TAG=latest

IMAGE_NAMETAG=${IMAGE_NAME}:${IMAGE_TAG}

docker run --rm \
    -p 9090:9090 \
    -it ${IMAGE_NAMETAG} \
    bash -c "node index.js"