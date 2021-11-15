#!/bin/bash

echo 'script start'

cd /home/ubuntu/insplace
pm2 stop 0
pm2 kill
pm2 start ./bin/www
