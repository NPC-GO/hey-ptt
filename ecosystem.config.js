module.exports = {
    apps: [
        {
            name: 'HEY-PTT',
            script: 'sudo flask run --cert ./certs/server.pub --key ./certs/server.key --port=443 --host=0.0.0.0'
        }
    ]
}
