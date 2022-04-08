from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import FriendRelationship, MessageRecord
import utils

# Create your views here.
@login_required
def index(request):
    return render(request, 'chat/index.html')


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
    if not request.user.is_authenticated:
        return JsonResponse({
            "warning": "login required"
        })
    print(request.POST)
    try:
        user1 = request.user
        user2 = User.objects.get(username=request.POST["receiver"])
        if not utils.is_friend(user1, user2):
            raise Exception
        MessageRecord.objects.create(sender=user1,
                                     receiver=user2,
                                     message=request.POST["content"],
                                     timestamp=request.POST["timestamp"])
    except Exception:
        return HttpResponse(status=403)

    return HttpResponse(status=200)
