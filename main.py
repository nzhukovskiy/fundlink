from flask import Flask, abort, jsonify, request
from dotenv import load_dotenv
import jwt
import os

from probability_recommendation_service import ProbabilityRecommendationService
load_dotenv(override=True)
app = Flask(__name__)

probability_recommendation_service = ProbabilityRecommendationService()

def validate_jwt(token):
    try:
        payload = jwt.decode(
            token,
            os.getenv('JWT_API_SECRET'),
            algorithms=['HS256'],
        )
        return payload.get('service') == 'fundlink-api'
    except Exception:
        return False

@app.before_request
def check_auth():
    if request.endpoint == 'calculate':
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not validate_jwt(token):
            return jsonify({"msg": "Unauthorized"}), 401

@app.route('/get-recommendations/<int:id>', methods=['GET'])
def calculate(id):
    return probability_recommendation_service.calculate_probs_recommendations(id)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)