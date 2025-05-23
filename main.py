from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin

from probability_recommendation_service import ProbabilityRecommendationService
load_dotenv()
app = Flask(__name__)
CORS(app)

probability_recommendation_service = ProbabilityRecommendationService()

@app.route('/get-recommendations/<int:id>', methods=['GET'])
@cross_origin()
def calculate(id):
    return probability_recommendation_service.calculate_probs_recommendations(id)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)