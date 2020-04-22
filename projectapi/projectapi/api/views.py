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

    # print('HEY: ', resp)
    return float(resp['Results']['output1']['value']['Values'][0][12])

@csrf_exempt
@api_view(['GET', 'POST', ])
def getShotPrediction(request):

    shotURL = 'https://ussouthcentral.services.azureml.net/workspaces/e7626090de274eec971d136acbc67e67/services/ed1ee599e573413bb3961627ee44eb89/execute?api-version=2.0&details=true'
    shotKey = 'H1hkxnUbil+UYJmXPQ2bzA7BB6n5n6gCdt9SLE+jAzgxuITlFvHIBw/hpqKF7FnTVigsLH1RnE/5ELMWtgL22g=='

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
    shot_result = 0

    shotInputs = {
        "ColumnNames": ["LOCATION", "SHOT_NUMBER", "PERIOD", "SHOT_CLOCK", "DRIBBLES", "SHOT_DIST", "PTS_TYPE", "CLOSE_DEF_DIST", "game_clock", "FG", "Experience", "player_first", "player_last", "SHOT_RESULT"],
        "Values": [[location, shot_number, period, shot_clock, dribbles, shot_distance, pts_type, close_def_dist, game_clock, fg, experience, player_first, player_last, shot_result], ]
    }

    shot_prediction = runModel(shotURL, shotKey, shotInputs)

    shot_prediction2 = round(shot_prediction)

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
        "INSERT INTO Shot_Prediction(LOCATION, SHOT_NUMBER, PERIOD, SHOT_CLOCK, DRIBBLES, SHOT_DIST, PTS_TYPE, CLOSE_DEF_DIST, game_clock, FG, Experience, SHOT_RESULT, player_first, player_last) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", location, shot_number, period, shot_clock, dribbles, shot_distance, pts_type, close_def_dist, game_clock, fg, experience, shot_prediction2, player_first, player_last)

    cnxn.commit()
    cursor.close()
    cnxn.close()

    return Response({"result": shot_prediction})

@csrf_exempt
def runModel2(scoring_uri, key, input):
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

    print('HEY: ', resp)

    results = {"player1": resp['Results']['output1']['value']['Values'][0][1], "player2": resp['Results']['output1']['value']['Values'][0][2], "player3": resp['Results']['output1']['value']['Values'][0][3], 'player4': resp['Results']['output1']['value']['Values'][0][0]}

    return results



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

    player_recommendation = runModel2(playersURL, playersKey, playersInputs)

    print('players: ', player_recommendation)

    first1, last1 = player_recommendation['player1'].split()
    first2, last2 = player_recommendation['player2'].split()
    first3, last3 = player_recommendation['player3'].split()
    first4, last4 = player_recommendation['player4'].split()

    # SAVE RESULTS TO DB
    server = 'final-project-415.database.windows.net'
    database = 'nba-data'
    username = 'admin415'
    password = '415@data'
    driver = 'ODBC Driver 17 for SQL Server'
    cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server +
                          ';PORT=1433;DATABASE='+database+';UID='+username+';PWD=' + password)
    cursor = cnxn.cursor()

    cursor.execute("SELECT * FROM cleaned_stats WHERE First = ? AND Last = ?", first1, last1)
    p1stats = cursor.fetchone()
    cursor.execute("SELECT * FROM cleaned_stats WHERE First = ? AND Last = ?", first2, last2)
    p2stats = cursor.fetchone()
    cursor.execute("SELECT * FROM cleaned_stats WHERE First = ? AND Last = ?", first3, last3)
    p3stats = cursor.fetchone()
    cursor.execute("SELECT * FROM cleaned_stats WHERE First = ? AND Last = ?", first4, last4)
    p4stats = cursor.fetchone()

    cursor.close()
    cnxn.close()

    return Response({
        "player1": player_recommendation['player1'],
        "player1stats": {'games': p1stats[1], 'points': p1stats[3], 'rebounds': p1stats[15], 'assists': p1stats[16], 'effeciency': p1stats[21]},
        "player2": player_recommendation['player2'],
        "player2stats": {'games': p2stats[1], 'points': p2stats[3], 'rebounds': p2stats[15], 'assists': p2stats[16], 'effeciency': p2stats[21]},
        "player3": player_recommendation['player3'],
        "player3stats": {'games': p3stats[1], 'points': p3stats[3], 'rebounds': p3stats[15], 'assists': p3stats[16], 'effeciency': p3stats[21]},
        "player4": player_recommendation['player4'],
        "player4stats": {'games': p4stats[1], 'points': p4stats[3], 'rebounds': p4stats[15], 'assists': p4stats[16], 'effeciency': p4stats[21]}
    })
