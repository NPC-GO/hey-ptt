from waitress import serve
import app
import os

serve(app.app, host='0.0.0.0', port=os.environ['PORT'])
