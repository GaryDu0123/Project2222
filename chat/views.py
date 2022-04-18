import json
import time
from datetime import datetime

from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import FriendRelationship, MessageRecord
import utils


# Create your views here.
@login_required
def index(request):
    return render(request, 'chat/index.html', {'username': request.user.username})


def debug_add_friend(request):
    user1 = User.objects.get(id=5)
    user2 = User.objects.get(id=7)
    FriendRelationship.objects.create(user1=user1, user2=user2)
    return HttpResponse(f"{user1}\n{user2}")


def debug_add_message(request):
    user1 = User.objects.get(id=5)
    user2 = User.objects.get(id=7)
    MessageRecord.objects.create(sender=user1, receiver=user2, message="你好7")
    return HttpResponse(f"{user1}\n{user2}")
    # record1 = MessageRecord.objects.filter(sender=user1)


def message_receive(request):
    # print(request.POST)
    if not request.user.is_authenticated:
        return JsonResponse({
            "warning": "login required"
        })
    try:
        user1 = request.user
        user2 = User.objects.get(username=request.POST["receiver"])
        if not utils.is_friend(user1, user2):
            raise Exception
        timestamp = int(request.POST["timestamp"])
        date = datetime.fromtimestamp(timestamp / 1000)
        message = json.loads(request.POST["content"])
        sender_version = message['sender']
        receiver_version = message['receiver']
        with transaction.atomic():
            record_sender = MessageRecord.objects.create(sender=user1,
                                                         receiver=user2,
                                                         message=sender_version,
                                                         timestamp=date,
                                                         belong=user1
                                                         )
            record_receiver = MessageRecord.objects.create(sender=user1,
                                                           receiver=user2,
                                                           message=receiver_version,
                                                           timestamp=date,
                                                           belong=user2
                                                           )
            record_sender.save()
            record_receiver.save()
    except Exception as e:
        print(e)
        return HttpResponse(status=403)

    return HttpResponse(status=200)
