from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import FriendRelationship, MessageRecord


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