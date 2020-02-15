# GetFit
GetFit is a nutrition website that allows users to calculate their daily nutrient needs, build healthy meal plans, and lookup nutrition facts for their favorite foods.  The site is built using Python and Flask on the backend, Javascript and jQuery of the front, and styled with Bootstrap.  Nutrition information is pulled from the [Nutritionix API](https://developer.nutritionix.com/docs/v2).

See a live version of this website: https://getfit-pyflask.herokuapp.com/.  Video walk through: https://youtu.be/i3X8UZf0fw0.

## Table of Contents

- [Background](#background)
- [What I Learned](#what-i-learned)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact Information](#contact-information)

## Background

This website is my final project for Harvard’s Introduction to Computer Science class, [CS50](https://www.edx.org/course/cs50s-introduction-to-computer-science).  The requirements for the final project were quite simple, “build something of interest to you, that you solve an actual problem, that you impact your community, or that you change the world.”

As someone who enjoys eating healthy and living a healthy lifestyle, I am constantly on the hunt for tools to help on my journey.  One thing that has always been missing is a nutrition website that allows the user to lookup food nutrients and build daily meal plans.  There are a ton of great websites available that allow users to track daily food consumption and provide the subsequent nutrient breakdown, but I could never find something that checked all of the boxes for me, namely the meal planner.  GetFit was built to solve that.  GetFit helps the user determine their daily calorie needs, then allows them to build a meal plan to match.  Although the final product does not portray the exact vision I had for the project (a valuable lesson in feature creep), it still accomplished my goal to create an all-in-one nutrition website. 

## What I Learned

- Implement a [Flask](https://flask.palletsprojects.com/en/1.1.x/) application in Python
- Make requests to an API and parse the return data
- Use Javascript and jQuery to create dynamic content
- Store session variables to preserve page content and provide a better user experience

Key Features
- Auto completing text field built using JS and jQuery, making `$.get()` request to Python.  The list of food names returned are the top 5 matching results returned from the Nutritionix API.  (A great lesson on asynchronous programming and how to utilize callback functions!)
- Bootstrap modal used to enable users to lookup individual foods and build meals, without leaving the meal plan page.

## Prerequisites

This project was built using [Python 3](https://www.python.org/).  Learn more and download the most recent version appropriate for you.

## Install

1. Setup a python [virtual enviroment](https://docs.python.org/3/tutorial/venv.html)
2. Install the required packages `$ pip install -r requirements.txt`

What will be installed
- [Flask 1.1.1](https://pypi.org/project/Flask/)
- [requests 2.22.0](https://pypi.org/project/requests/)
- [python-dotenv 0.10.5](https://pypi.org/project/python-dotenv/)

## Usage

You can launch this program without registering for the [Nutritionix API](https://developer.nutritionix.com/docs/v2), however, the main features of the site will not be available to you.  [Registration](https://developer.nutritionix.com/signup) is free and once completed, will provide you with an Application Key (API Key) and Application ID.  Steps for use:

1. Rename the `.env_SAMPLE` file to `.env`
2. Change the values of the corresponding environment variables within the `.env` file to your unique Application Key and Application ID.

Launch the [Flask](https://flask.palletsprojects.com/en/1.1.x/quickstart/) application
1. `$ export FLASK_APP=application.py`
2. `$ flask run`
3. Click the url `http://127.0.0.1:5000/`

A local version of the site should now be running in your default browser.  If you plan to make changes to the code, consider launching the site in developer mode.

## Contributing

Since this code represents the final project as I submitted for CS50, I intend to preserve the code here in its original state and will not be allowing changes.  However, any comments on code structure, readability, etc. are welcomed. Remember this was my first web application, so structured feedback would be a huge benefit for my continued education.

If you are interested in the topic, I do intend to create a better functioning GetFit 2.0 (working title) that will improve upon existing features, and create new ones.  Once available, I will include the link here.

## Contact Information

Once I create a proper portfolio site, that will be the best way to contact me.  For now, feel free to connect with me via [LinkedIn](https://www.linkedin.com/in/eric-hippler/).