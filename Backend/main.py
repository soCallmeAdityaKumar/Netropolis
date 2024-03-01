from flask import Flask
from extensions import jwt
# from extensions import db,jwt
from auth import authUser_bp,authComp_bp
from job import job_bp
from flask_cors import CORS
import os
# from models import init_db
def create_app():

    app=Flask(__name__)
    app.config['JWT_SECRET_KEY'] = os.environ.get('FLASK_JWT_SECRET_KEY', 'fallback_secret_key')
    app.config.from_prefixed_env()
    CORS(app)
    #initialize app
    # db.init_app(app)
    # with app.app_context():
    #     init_db()

    jwt.init_app(app)

    #register blueprint
    app.register_blueprint(authUser_bp,url_prefix='/auth/user')
    app.register_blueprint(authComp_bp,url_prefix='/auth/company')
    app.register_blueprint(job_bp,url_prefix="/jobs")


    return app

