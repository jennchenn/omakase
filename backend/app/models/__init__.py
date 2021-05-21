from mongoengine import connect


def init_app(app):
    # from .entity import Entity
    # from .user import User

    app.app_context().push()
    # connect to MongoDB
    connect(host=app.config["MONGODB_URL"])
