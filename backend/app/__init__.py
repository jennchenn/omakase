import os
from flask import Flask


def create_app():
    app = Flask(__name__)

    app.config["MONGODB_URL"] = os.getenv("DB_URI")

    from . import models, routes

    models.init_app(app)
    routes.init_app(app)

    return app
