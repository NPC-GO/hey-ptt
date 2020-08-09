#!/bin/bash
sudo pm2 kill
sudo pkill flask
sudo rm -rf ./hey-ptt
git clone https://github.com/NPC-GO/hey-ptt.git
cd hey-ptt || exit
sudo rm -rf ./git
pip3 install -r requirements.txt
export FLASK_APP=app.py
mkdir certs
cp ../certs/* ./certs
pm2 start -i max
