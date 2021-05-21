def init_app(app):
    from . import health_routes

    app.register_blueprint(health_routes.blueprint)
