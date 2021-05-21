from flask import Blueprint
from flask import jsonify

# defines a shared URL prefix for all routes
blueprint = Blueprint("health", __name__, url_prefix="/health")


@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_health():
    return jsonify({"status": "UP"}), 200
