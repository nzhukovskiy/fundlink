from datetime import datetime
from math import exp
import os
from flask import jsonify
import psycopg2

ALPHA=50000000

class ProbabilityRecommendationService():
    def calculate_probs_recommendations(self, id):
        connection = psycopg2.connect(os.getenv("POSTGRES_URL"))
        cursor = connection.cursor()
        cursor.execute("""
            SELECT 
                i.id AS investor_id,
                i."name" ,
                i.surname ,
                s.id AS startup_id,
                s.title,
                s.description,
                iv.amount ,
                iv."date" 
            from investor i
                JOIN investment iv ON i.id = iv."investorId"
                JOIN funding_round fr ON iv."fundingRoundId"  = fr.id
                JOIN startup s ON fr."startupId"  = s.id
                       where iv.stage = 'COMPLETED'
        """)
        rows = cursor.fetchall()
        investor_data = {}
        startup_data = {}
        investor_weights = {}
        startups_weights = {}
        for row in rows:
            investor_id, name, surname, startup_id, startup_title, startup_description, investment_amount, investment_date = row
            investment_amount = int(investment_amount)

            self.__construct_dict(investor_id, investor_data, startup_id, 
                {
                    "name": name,
                    "surname": surname,
                    "startups": {}
                },
                {
                    "title": startup_title,
                    "description": startup_description,
                    "investments": []
                },
                "startups", investment_amount, investment_date)
            self.__construct_dict(startup_id, startup_data, investor_id, 
                {
                    "title": startup_title,
                    "description": startup_description,
                    "investors": {}
                },
                {
                    "name": name,
                    "surname": surname,
                    "investments": []
                },
                "investors", investment_amount, investment_date)
            startups_weights[startup_id] = 0
            investor_weights[investor_id] = 1 if investor_id == id else 0

        for investor_id in investor_data.keys():
            total_investments = self.__calculate_total_investments(investor_data[investor_id])
            for startup_id in investor_data[investor_id]["startups"].keys():
                connection_sum = 0
                for investment in investor_data[investor_id]["startups"][startup_id]["investments"]:
                    time_decay = 1
                    connection_sum += time_decay*investment["investment_amount"]
                investor_data[investor_id]["startups"][startup_id]["weight"] = connection_sum/total_investments
                startup_data[startup_id]["investors"][investor_id]["weight"] = connection_sum/total_investments


        for i in range(2):
            self.__calculate_part_weights(investor_weights, startups_weights, investor_data, "startups")
            self.__calculate_part_weights(startups_weights, investor_weights, startup_data, "investors", last_calculation=True if i == 1 else False)

        startup_data_top = [
                {"id": k, **v}
                for k, v in sorted(
                    ((k, v) for k, v in startup_data.items() if k not in investor_data[id]["startups"]),
                    key=lambda x: startups_weights[x[0]],
                    reverse=True
                )[:20]
            ]
        
        startup_ids = [startup["id"] for startup in startup_data_top]
        placeholders = ', '.join(['%s'] * len(startup_ids))
        query = f'''
            SELECT * FROM funding_round
            WHERE "startupId" IN ({placeholders}) AND "isCurrent" = true
        '''
        cursor.execute(query, startup_ids)
        funding_rounds = cursor.fetchall()

        funding_round_map = {}
        for row in funding_rounds:
            (id, stage, funding_goal, current_raised, start_date, end_date, is_current,
            startup_id, notifications_sent, pre_money) = row
            funding_round_map[startup_id] = {
                "id": id,
                "startup_id": startup_id,
                "stage": stage,
                "fundingGoal": funding_goal,
                "currentRaised": current_raised,
                "start_date": start_date,
                "end_date": end_date,
                "isCurrent": is_current
            }

        for startup in startup_data_top:
            funding_round = funding_round_map.get(startup["id"])
            startup["fundingRounds"] = [funding_round] if funding_round else []

        cursor.close()
        connection.close()
        return jsonify({
            "startup_weights": startups_weights,
            "recommendedStartups": startup_data_top
        })

    def __construct_dict(self, parent_id, collection, child_id, parent_dict, child_dict, child_key, investment_amount, investment_date):
        if parent_id not in collection:
            collection[parent_id] = parent_dict
        if child_id not in collection[parent_id][child_key]:
            collection[parent_id][child_key][child_id] = child_dict
        collection[parent_id][child_key][child_id]["investments"].append({"investment_amount": investment_amount, "investment_date": investment_date})

    def __calculate_part_weights(self, source_weights, target_weights, source_data, target_key, last_calculation = False):
        for source_id in source_weights:
                for target_id in source_data[source_id][target_key].keys():
                    edge_weight = source_weights[source_id] * source_data[source_id][target_key][target_id]["weight"]
                    target_weights[target_id] += edge_weight

        if not last_calculation:
            for source_id in source_weights.keys():
                source_weights[source_id] = 0

    def __calculate_total_investments(self, investor):
        investments_sum = 0
        for startup in investor["startups"].values():
            for investment in startup["investments"]:
                investments_sum += investment["investment_amount"]
        return investments_sum