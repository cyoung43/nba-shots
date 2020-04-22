from django.shortcuts import render
import json
import requests

# Create your views here.

from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

#from api.models import Campaign, NoCoronaCampaign
#from api.serializers import CampaignSerializer, NoCoronaCampaignSerializer



###############################################################
######################## OLD AZURE VIEWS ######################
###############################################################

########################## AZURE VIEWS ########################
@csrf_exempt
def runML(scoring_uri, key, input):
    # Two sets of data to score, so we get two results back
    data = {
        "Inputs": {
            "input1": input
        },
    }
    # Convert to JSON string
    input_data = json.dumps(data)

    # Set the content type
    headers = {'Content-Type': 'application/json'}
    # If authentication is enabled, set the authorization header
    headers['Authorization'] = f'Bearer {key}'

    # Make the request and display the response
    resp = requests.post(scoring_uri, input_data, headers=headers)
    resp = json.loads(resp.text)

    return resp['Results']['output1']['value']['Values'][0][0]

@csrf_exempt
@api_view(['GET', 'POST', ])
def getShotPrediction(request, fromMethod=False): # Corona Virus Related
    
    
    shotsURL = 'https://ussouthcentral.services.azureml.net/workspaces/e7626090de274eec971d136acbc67e67/services/ed1ee599e573413bb3961627ee44eb89/execute?api-version=2.0&details=true'
    shotsKey = 'H1hkxnUbil+UYJmXPQ2bzA7BB6n5n6gCdt9SLE+jAzgxuITlFvHIBw/hpqKF7FnTVigsLH1RnE/5ELMWtgL22g=='


    stuff = json.loads(request.body)
    

    location = stuff['LOCATION']
    shot_number = stuff['SHOT_NUMBER']
    period = stuff['PERIOD']
    shot_clock = stuff['SHOT_CLOCK']
    dribbles = stuff['DRIBBLES']
    shot_distance = stuff['SHOT_DISTANCE']
    pts_type = stuff['PTS_TYPE']
    close_def_dist = stuff['CLOSE_DEF_DIST']
    game_clock = stuff['GAME_CLOCK']
    fg = stuff['FG']
    experience = stuff['EXPERIENCE']


    

    shotsInputs = {
        "ColumnNames": ["location", "shot_number", "period", "shot_clock", "dribbles", "shot_distance", "pts_type", "close_def_dist", "game_clock", "fg", "experience"],
        "Values": [[location, shot_number, period, shot_clock, dribbles, shot_distance, pts_type, close_def_dist, game_clock, fg, experience], ]
    }

    shots_prediction = str(
        runML(shotURL, shotKey, shotInputs))

    if fromMethod:
        return shots_prediction
    else:
        return Response({"result": shots_prediction})
        
    #render(request, "src\campaign-calculator-container.js", {"result": expected_avg_donation})

# Relies on the getExpectedAvgDonation method above

@csrf_exempt
@api_view(['GET', 'POST', ])
def getPlayerRecommendation(request): # Corona Virus Related
    playersURL = 'https://ussouthcentral.services.azureml.net/workspaces/e7626090de274eec971d136acbc67e67/services/b85c3fe5a9814626bec6d9bcc3b91a27/execute?api-version=2.0&details=true'
    playersKey = 'hFY+UlW9/nPCsFtcvOGukx2VEEc/7C8l1zpq/K9YSpc2+8RwJA+sUKvzxY5ys1BcnhoP1TpOQhPPCXs5fdatKg=='

    stuff = json.loads(request.body)

    full_name = stuff['Full_Name']

    playersInputs = {
        "ColumnNames": ["full_name"],
        "Values": [[full_name], ]
    }

    player_recommendations = str(
        round(float(runML(playersURL, playersKey, playersInputs))))

    return Response({"result": player_recommendations})
    
    #render(request, "campaign-calculator-container.js", {"result": {"expected_donors": expected_num_donors, "expected_donation": expected_avg_donation}})





import pyodbc

server = 'final-project-415.database.windows.net'
database = 'nba-data'
username = 'admin415'
password = '415@data'
driver = 'ODBC Driver 17 for SQL Server'
cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server +
                      ';PORT=1433;DATABASE='+database+';UID='+username+';PWD=' + password)
cursor = cnxn.cursor()
# cursor.execute("SELECT * FROM cleaned_stats")
# row = cursor.fetchone()

LOCATION = 'TEST'
SHOT_NUMBER = 99
PERIOD = 'TEST'
SHOT_CLOCK = 22.22
DRIBBLES = 99
SHOT_DISTANCE = 99.99
PTS_TYPE = 'TEST'
CLOSE_DEF_DIST = 99.99
game_clock = 99
FG = 99.99
Experience = 'TEST'
SHOT_RESULT = 0
player_first = 'TEST-last'
player_last = 'TEST-first'

# cursor.execute("insert into products(id, name) values (?, ?)", 'pyodbc', 'awesome library')

# Insert some data into table
cursor.execute(
    f"INSERT INTO Shot_Prediction(location, SHOT_NUMBER, PERIOD, SHOT_CLOCK, DRIBBLES, SHOT_DIST, PTS_TYPE, CLOSE_DEF_DIST, game_clock, FG, Experience, SHOT_RESULT, player_first, player_last) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", LOCATION, SHOT_NUMBER, PERIOD, SHOT_CLOCK, DRIBBLES, SHOT_DISTANCE, PTS_TYPE, CLOSE_DEF_DIST, game_clock, FG, Experience, SHOT_RESULT, player_first, player_last)

# Cleanup
cnxn.commit()
cursor.close()
cnxn.close()