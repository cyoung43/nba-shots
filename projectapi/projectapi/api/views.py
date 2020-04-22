import pyodbc
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
import pyodbc

#from api.models import Campaign, NoCoronaCampaign
#from api.serializers import CampaignSerializer, NoCoronaCampaignSerializer


###############################################################
######################## OLD AZURE VIEWS ######################
###############################################################

########################## AZURE VIEWS ########################
@csrf_exempt
def runModel(scoring_uri, key, input):
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
def getShotPrediction(request):

    shotsURL = 'https://ussouthcentral.services.azureml.net/workspaces/e7626090de274eec971d136acbc67e67/services/ed1ee599e573413bb3961627ee44eb89/execute?api-version=2.0&details=true'
    shotsKey = 'H1hkxnUbil+UYJmXPQ2bzA7BB6n5n6gCdt9SLE+jAzgxuITlFvHIBw/hpqKF7FnTVigsLH1RnE/5ELMWtgL22g=='

    stuff = json.loads(request.body)

    location = stuff['location']
    shot_number = stuff['shot_number']
    period = stuff['period']
    shot_clock = stuff['shot_clock']
    dribbles = stuff['dribbles']
    shot_distance = stuff['shot_distance']
    pts_type = stuff['pts_type']
    close_def_dist = stuff['close_def_dist']
    game_clock = stuff['game_clock']
    fg = stuff['fg']
    experience = stuff['experience']
    player_first = stuff['player_first']
    player_last = stuff['player_last']

    shotsInputs = {
        "ColumnNames": ["location", "shot_number", "period", "shot_clock", "dribbles", "shot_distance", "pts_type", "close_def_dist", "game_clock", "fg", "experience"],
        "Values": [[location, shot_number, period, shot_clock, dribbles, shot_distance, pts_type, close_def_dist, game_clock, fg, experience], ]
    }

    shot_prediction = str(runModel(shotURL, shotKey, shotInputs))

    # SAVE RESULTS TO DB
    server = 'final-project-415.database.windows.net'
    database = 'nba-data'
    username = 'admin415'
    password = '415@data'
    driver = 'ODBC Driver 17 for SQL Server'
    cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server +
                          ';PORT=1433;DATABASE='+database+';UID='+username+';PWD=' + password)
    cursor = cnxn.cursor()

    cursor.execute(
        "INSERT INTO Shot_Prediction(location, SHOT_NUMBER, PERIOD, SHOT_CLOCK, DRIBBLES, SHOT_DIST, PTS_TYPE, CLOSE_DEF_DIST, game_clock, FG, Experience, SHOT_RESULT, player_first, player_last) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", location, shot_number, period, shot_clock, dribbles, shot_distance, pts_type, close_def_dist, game_clock, fg, experience, shot_prediction, player_first, player_last)

    # cnxn.commit()
    cursor.close()
    cnxn.close()

    return Response({"result": shot_prediction})


@csrf_exempt
@api_view(['GET', 'POST', ])
def getPlayerRecommendation(request):
    playersURL = 'https://ussouthcentral.services.azureml.net/workspaces/e7626090de274eec971d136acbc67e67/services/b85c3fe5a9814626bec6d9bcc3b91a27/execute?api-version=2.0&details=true'
    playersKey = 'hFY+UlW9/nPCsFtcvOGukx2VEEc/7C8l1zpq/K9YSpc2+8RwJA+sUKvzxY5ys1BcnhoP1TpOQhPPCXs5fdatKg=='

    stuff = json.loads(request.body)

    full_name = stuff['Full_Name']

    playersInputs = {
        "ColumnNames": ["full_name"],
        "Values": [[full_name], ]
    }

    player_recommendation = str(
        runModel(playersURL, playersKey, playersInputs))

    return Response({"result": player_recommendation})
