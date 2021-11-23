#!/bin/bash

echo 'script start'

cd /home/ubuntu/insplace

sudo docker build --tag rlxo6919/insplace .
sudo docker push rlxo6919/insplace
kubectl rollout restart deployment insplace