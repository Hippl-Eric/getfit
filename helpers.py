import os
import requests

from flask import redirect, render_template, request

def inst_lookup(partial_string):
    """Populate list of food names for partial_string using API instant lookup"""

    # Contact Nutritionix Instant Endpoint API
    try:
        app_id = os.environ['API_ID']
        app_key = os.environ['API_KEY']
        url = "https://trackapi.nutritionix.com/v2/search/instant"
        headers = {
            'x-app-id' : app_id,
            'x-app-key' : app_key,
            'x-remote-user-id' : '0'
        }
        data = {'query' : partial_string}
        response = requests.get(url, headers=headers, params=data)
        response.raise_for_status()
    except requests.RequestException:
        return None

    # Parse response
    try:
        query = response.json()

        # Filter results and return only top 5 results
        item_list = []
        common_foods = query.get('common')
        l = len(common_foods)
        if l < 5 and l > 0:
            for x in range(l):
                item_list.append(common_foods[x].get('food_name'))
        elif l > 0:
            for x in range(5):
                item_list.append(common_foods[x].get('food_name'))
        return item_list

    except (KeyError, TypeError, ValueError):
        return None


def nutrient_lookup(food_name):
    """Populate list of food names for food_name using API instant lookup"""

    # Contact Nutritionix: Natural Language for Nutrients API
    try:
        app_id = os.environ['API_ID']
        app_key = os.environ['API_KEY']
        url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
        headers = {
            'Content-Type' : 'application/json',
            'x-app-id' : app_id,
            'x-app-key' : app_key,
            'x-remote-user-id' : '0'
        }
        data = {"query": food_name}
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
    except requests.RequestException:
        return None

    # Parse response
    try:
        query = response.json()

        parse = query.get('foods')[0]
        food_nutrients = create_empty_nutrient_list()
        for item in food_nutrients:
            for key in parse:

                # Set thumbnail photo
                if item.get('db_id') == 'photo':
                    item['value'] = parse.get('photo').get('thumb')

                # Set basic nutrients
                elif key == item.get('db_id'):
                    item['value'] = parse.get(key)

                # Set full nutrients
                else:
                    new_parse = parse.get('full_nutrients')
                    for dic in new_parse:
                        if dic.get('attr_id') == item.get('db_id'):
                            item['value'] = dic.get('value')

        # Calculate and set Calories from Fat (multiply total fat (g) by 9 (calories/gram))
        for fat_cal in food_nutrients:
            if fat_cal.get('label') == 'Calories from Fat':
                for tot_fat in food_nutrients:
                    if tot_fat.get('label') == 'Total Fat':
                        fat_cal['value'] = tot_fat.get('value') * 9

        return food_nutrients
    except (KeyError, TypeError, ValueError):
        return None


def create_empty_nutrient_list():
    """Create an empty list to store nutrient information and include all default values"""

    name_list = [{"label": "Food Item Picture", "db_id": "photo", "unit": ""},
                    {"label": "Food name", "db_id": "food_name", "unit": ""},
                    {"label": "serving qty", "db_id": "serving_qty", "unit": ""},
                    {"label": "serving unit", "db_id": "serving_unit", "unit": ""},
                    {"label": "serving weight grams", "db_id": "serving_weight_grams", "unit": "g"},
                    {"label": "Calories", "db_id": 208, "unit": ""},
                    {"label": "Calories from Fat", "unit": ""},
                    {"label": "Total Fat", "db_id": 204, "unit": "g"},
                    {"label": "Saturated Fat", "db_id": 606, "unit": "g"},
                    {"label": "Trans Fat", "db_id": 695, "unit": "g"},
                    {"label": "Polyunsaturated Fat", "db_id": 646, "unit": "g"},
                    {"label": "Monounsaturated Fat", "db_id": 645, "unit": "g"},
                    {"label": "Cholesterol", "db_id": 601, "unit": "mg"},
                    {"label": "Sodium", "db_id": 307, "unit": "mg"},
                    {"label": "Potassium", "db_id": 306, "unit": "mg"},
                    {"label": "Total Carbohydrates", "db_id": 205, "unit": "g"},
                    {"label": "Dietary Fiber", "db_id": 291, "unit": "g"},
                    {"label": "Sugars", "db_id": 269, "unit": "g"},
                    {"label": "Sugars, added", "db_id": 539, "unit": "g"},
                    {"label": "Protein", "db_id": 203, "unit": "g"},
                    {"label": "Vitamin A", "db_id": 320, "unit": "mcg"},
                    {"label": "Vitamin C", "db_id": 401, "unit": "mg"},
                    {"label": "Calcium", "db_id": 301, "unit": "mg"},
                    {"label": "Iron", "db_id": 303, "unit": "mg"}]
    for dic in name_list:
        dic['value'] = 0
    return(name_list)

