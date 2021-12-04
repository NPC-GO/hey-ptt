from waitress import serve
import app
import os

serve(app.app, host=os.environ['HOST'], port=os.environ['PORT'])
