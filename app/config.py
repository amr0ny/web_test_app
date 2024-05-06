import dotenv
import os
from utils import read_csv_to_dict

dotenv.load_dotenv()

flask_config = {
    'DEBUG': os.getenv('DEBUG'),
    'LOGGING': os.getenv('LOGGING'),
#    'SERVER_NAME': os.getenv('SERVER_NAME'),
    'JSONIFY_MIMETYPE': 'application/json',
    'SECRET_KEY':  os.urandom(24),
}
csv_sample_path = os.getenv('CSV_SAMPLE_PATH')

sample = read_csv_to_dict(csv_sample_path)