import os

from waitress import serve

import app

serve(app.app, host=os.environ['HOST'], port=os.environ['PORT'])
