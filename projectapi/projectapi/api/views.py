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

    expected_num_donors = str(
        round(float(runML(playersURL, playersKey, playersInputs))))

    return Response({"result": {"expected_donors": expected_num_donors, "expected_donation": expected_avg_donation}})
    
    #render(request, "campaign-calculator-container.js", {"result": {"expected_donors": expected_num_donors, "expected_donation": expected_avg_donation}})