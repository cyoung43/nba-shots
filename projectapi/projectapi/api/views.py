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
################ THESE ARE THE OLD AZURE VIEWS ################
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
def getExpectedAvgDonationCorona(request, fromMethod=False): # Corona Virus Related
    
    
    donationsURL = 'https://ussouthcentral.services.azureml.net/workspaces/c76b9f0e8066401db73b32ba2ea74ed9/services/4172a5aa47424881a36753d3d79b42f2/execute?api-version=2.0&details=true'
    donationsKey = 'DIKaCG+NIpUDVk3wCD34yZ6JvZHdZM5+0JWmPFrQNiWO7NSBc7zVjSnWbOyL2ZSWNE4xe8NWMRau4arzs6cCzg=='


    stuff = json.loads(request.body)
    

    auto_fb_post_mode = stuff['auto_fb_post_mode']
    currencycode = stuff['currencycode']
    goal = stuff['goal']
    days_active = stuff['days_active']
    title = stuff['title']
    description = stuff['description']
    social_share_total = stuff['social_share_total']
    location_country = stuff['location_country']
    average_donation = '0000'

    

    donationsInputs = {
        "ColumnNames": ["auto_fb_post_mode", "currencycode", "goal", "days_active", "title", "description", "social_share_total", "location_country", "average_donation"],
        "Values": [[auto_fb_post_mode, currencycode, goal, days_active, title, description, social_share_total, location_country, average_donation], ]
    }

    expected_avg_donation = str(
        runML(donationsURL, donationsKey, donationsInputs))

    if fromMethod:
        return expected_avg_donation
    else:
        return Response({"result": expected_avg_donation})
        
    #render(request, "src\campaign-calculator-container.js", {"result": expected_avg_donation})

# Relies on the getExpectedAvgDonation method above

@csrf_exempt
@api_view(['GET', 'POST', ])
def getExpectedNumDonorsCorona(request): # Corona Virus Related
    donorsURL = 'https://ussouthcentral.services.azureml.net/workspaces/c76b9f0e8066401db73b32ba2ea74ed9/services/155f03648c3847659a35ce4734227129/execute?api-version=2.0&details=true'
    donorsKey = 'aLl69DHFyVdkWJj4b2GSks3eT/FmeCliMPADx0VCRi2rLy7pMshJKZodPVnnUsWVktXNWVtDf/IIwKyVgOitaw=='

    stuff = json.loads(request.body)

    campaign_id = '0000'
    auto_fb_post_mode = stuff['auto_fb_post_mode']
    currencycode = stuff['currencycode']
    goal = stuff['goal']
    donators = '0000'
    days_active = stuff['days_active']
    title = stuff['title']
    description = stuff['description']
    social_share_total = stuff['social_share_total']
    location_country = stuff['location_country']
    average_donation = '0000'
    expected_avg_donation = stuff['expected_avg_donation']#getExpectedAvgDonation(request.body, True)

    donorsInputs = {
        "ColumnNames": ["campaign_id", "auto_fb_post_mode", "currencycode", "goal", "donators", "days_active", "title", "description", "social_share_total", "location_country", "average_donation"],
        "Values": [[campaign_id, auto_fb_post_mode, currencycode, goal, donators, days_active, title, description, social_share_total, location_country, expected_avg_donation], ]
    }

    expected_num_donors = str(
        round(float(runML(donorsURL, donorsKey, donorsInputs))))

    return Response({"result": {"expected_donors": expected_num_donors, "expected_donation": expected_avg_donation}})
    
    #render(request, "campaign-calculator-container.js", {"result": {"expected_donors": expected_num_donors, "expected_donation": expected_avg_donation}})



###################### NON-CORONA VIRUS PREDICTIONS ##########################
@csrf_exempt
@api_view(['GET', 'POST', ])
def getExpectedAvgDonationRegular(request, fromMethod=False): # Corona Virus Related
    
    
    donationsURL = 'https://ussouthcentral.services.azureml.net/workspaces/c76b9f0e8066401db73b32ba2ea74ed9/services/ffff27b371dd45a1a19ce723cf8f6fac/execute?api-version=2.0&details=true'
    donationsKey = 'qNxK76DRGm0aYMUh1U8tV1uU7uKGPItqCANUrFrDaTgd8s+Bz76PO/hXRNWWIO7UwF4Pj5tqJqP82FpQxtDM/w=='


    stuff = json.loads(request.body)
    

    auto_fb_post_mode = stuff['auto_fb_post_mode']
    currencycode = stuff['currencycode']
    goal = stuff['goal']
    days_active = stuff['days_active']
    title = stuff['title']
    description = stuff['description']
    social_share_total = stuff['social_share_total']
    location_country = stuff['location_country']
    average_donation = '0000'

    

    donationsInputs = {
        "ColumnNames": ["auto_fb_post_mode", "currencycode", "goal", "days_active", "title", "description", "social_share_total", "location_country", "average_donation"],
        "Values": [[auto_fb_post_mode, currencycode, goal, days_active, title, description, social_share_total, location_country, average_donation], ]
    }

    expected_avg_donation = str(
        runML(donationsURL, donationsKey, donationsInputs))

    print('AZUREML TEST: ', expected_avg_donation)
    if fromMethod:
        return expected_avg_donation
    else:
        return Response({"result": expected_avg_donation})
        
    #render(request, "src\campaign-calculator-container.js", {"result": expected_avg_donation})

# Relies on the getExpectedAvgDonation method above

@csrf_exempt
@api_view(['GET', 'POST', ])
def getExpectedNumDonorsRegular(request): # Corona Virus Related
    donorsURL = 'https://ussouthcentral.services.azureml.net/workspaces/c76b9f0e8066401db73b32ba2ea74ed9/services/21464a08fbfc4aedb91a0df543ec3129/execute?api-version=2.0&details=true'
    donorsKey = 'W1kzIjC5W1aYs7Yu9hqjWBAN39UMXPJkg2IZuKn41d4tHHNHvgzT/i64GRaBw+oC7W9OC3KZyEMExF0of6S3dw=='

    stuff = json.loads(request.body)

    campaign_id = '0000'
    auto_fb_post_mode = stuff['auto_fb_post_mode']
    currencycode = stuff['currencycode']
    goal = stuff['goal']
    donators = '0000'
    days_active = stuff['days_active']
    title = stuff['title']
    description = stuff['description']
    social_share_total = stuff['social_share_total']
    location_country = stuff['location_country']
    average_donation = '0000'
    expected_avg_donation = stuff['expected_avg_donation']#getExpectedAvgDonation(request.body, True)

    donorsInputs = {
        "ColumnNames": ["campaign_id", "auto_fb_post_mode", "currencycode", "goal", "donators", "days_active", "title", "description", "social_share_total", "location_country", "average_donation"],
        "Values": [[campaign_id, auto_fb_post_mode, currencycode, goal, donators, days_active, title, description, social_share_total, location_country, expected_avg_donation], ]
    }

    expected_num_donors = str(
        round(float(runML(donorsURL, donorsKey, donorsInputs))))

    return Response({"result": {"expected_donors": expected_num_donors, "expected_donation": expected_avg_donation}})
    
    #render(request, "campaign-calculator-container.js", {"result": {"expected_donors": expected_num_donors, "expected_donation": expected_avg_donation}})