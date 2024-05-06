from flask import Flask
from routes import api_v1, tests
from config import flask_config



def create_app():   
    app = Flask(__name__)
    app.config.from_mapping(**flask_config)
    app.logger.setLevel(flask_config['LOGGING'])
    
    app.register_blueprint(api_v1.api_v1)
    app.register_blueprint(tests.tests)

    return app
