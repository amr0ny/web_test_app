import dotenv
import os

dotenv.load_dotenv()

flask_config = {
    'DEBUG': os.getenv('DEBUG'),
    'LOGGING': os.getenv('LOGGING'),
#    'SERVER_NAME': os.getenv('SERVER_NAME'),
    'JSONIFY_MIMETYPE': 'application/json',
    'SECRET_KEY':  os.urandom(24),
}

