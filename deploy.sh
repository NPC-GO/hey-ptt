rm -rf ./hey-ptt
git clone https://github.com/NPC-GO/hey-ptt.git
# shellcheck disable=SC2164
cd hey-ptt
pip3 freeze > requirements.txt
pip3 install -r requirements.txt
export FLASK_APP=app.py
sudo flask run --cert ./certs/server.pub --key ./certs/server.key --host=0.0.0.0 --port=443
