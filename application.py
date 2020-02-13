import os
import datetime

from flask import Flask, jsonify, redirect, render_template, request
from dotenv import load_dotenv
from helpers import inst_lookup, nutrient_lookup

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure API Key and ID are provided
os.environ.clear()
load_dotenv()
if 'API_KEY' not in os.environ:
    print('API_KEY is not defined!')

if 'API_ID' not in os.environ:
    print('API_ID is not defined!')


@app.route("/")
def index():
    """Display home page"""

    return render_template("index.html")


@app.route("/target", methods=["GET"])
def target():
    """Display the target nutrient page"""

    return render_template("target.html")


@app.route("/target_array", methods=["GET"])
def target_array():
    """Calculate the target nutrients based on user input from target page"""

    # Log user entered weight and prevent submission of non-numeric value
    weight = request.args.get('weight')
    try:
        weight = float(weight)
    except ValueError:
        return jsonify(0)

    # Log user entered goal and prevent submission of invalid value
    goal = request.args.get('goal')
    if goal != 'Lose Weight' and goal != 'Maintain Weight' and goal != 'Gain Weight':
        return jsonify(0)

    # Set multiplier values for protein, carb, and fat
    p, c, f = 1.0, 1.6, 0.35
    if goal == 'Lose Weight':
        p, c, f = 1.2, 1.0, 0.20
    elif goal == 'Gain Weight':
        p, c, f = 1.0, 2.0, 0.40

    # Calculate macros in grams
    pGram = p * weight
    cGram = c * weight
    fGram = f * weight

    # Calculate macros in calories
    pCal = pGram * 4
    cCal = cGram * 4
    fCal = fGram * 9

    # Calculate total calories
    Cal = pCal + cCal + fCal

    # Store values in list
    targets = {
        "Calories" : int(Cal),
            "pGram" : int(pGram),
            "cGram" : int(cGram),
            "fGram" : int(fGram),
            "pCal" : int(pCal),
            "cCal" : int(cCal),
            "fCal" : int(fCal)
        }

    # RDA micro-nutrients
    micro = {
        "micro" : [{"label": "Sodium", "value": "1500", "unit": "mg"},
            {"label": "Potassium", "value": "3400", "unit": "mg"},
            {"label": "Dietary Fiber", "value": "38", "unit": "g"},
            {"label": "Vitamin A", "value": "3000", "unit": "mcg"},
            {"label": "Vitamin C", "value": "90", "unit": "mg"},
            {"label": "Calcium", "value": "1000", "unit": "mg"},
            {"label": "Iron", "value": "8", "unit": "mg"}]
        }

    # Add micro-nutrients to target list
    targets.update(micro)

    # Submit the complete target list
    return jsonify(targets)


@app.route("/food_lookup", methods=["GET"])
def food_lookup():
    """Display the food lookup page"""

    return render_template("food_lookup.html")


@app.route("/food_array", methods=["GET"])
def food_array():
    """Return list of foods matching user inputted string from Nutrinix API"""

    # Partial string from autocomplete text input field
    item = request.args.get("item")

    # Call to API for matching food names
    food_list = inst_lookup(item)

    # Return empty list if no matching results, else return the list
    if food_list == None:
        food_list = []
    return jsonify(food_list)


@app.route("/nutrient_array", methods=["GET"])
def nutrient_array():
    """Return list of nutrients matching user inputted food name from Nutrinix API"""

    # Food name submitted by user
    food = request.args.get("foodName")

    # Call to API to return nutrients for food name
    nutrient_list = nutrient_lookup(food)

    # Return empty list if no matching results, else return the list
    if nutrient_list == None:
        nutrient_list = []
    return jsonify(nutrient_list)


@app.route("/meal_planner")
def meal_planner():
    """Display the meal planner page"""

    return render_template("meal_planner.html")

if __name__ == "__main__":
    app.run()
