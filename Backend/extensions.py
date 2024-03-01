from flask import Flask
import os
import psycopg2
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager


db= SQLAlchemy()
connection = psycopg2.connect(
        host=os.environ['HOST_NAME'],
        database=os.environ['DATABASE'],
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])
jwt=JWTManager()