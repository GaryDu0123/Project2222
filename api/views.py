from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from chat.models import FriendRelationship, MessageRecord


# Create your views here.
def test(request):
    return render(request, "api/chatApiTest.html")


def api_response(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "warning": "login required"
        })
    return HttpResponse("Hello World")


"""
def get_user_friend_box(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "warning": "login required"
        })
    user = request.user
    friend_list = {}
    count = 0
    for friend in FriendRelationship.objects.filter(user1=user):
        friend_list[count] = friend.user2.username
        count += 1
    for friend in FriendRelationship.objects.filter(user2=user):
        friend_list[count] = friend.user1.username
        count += 1
    return JsonResponse(friend_list)
"""


def get_user_friend_box(request):
    return JsonResponse({
        "0": "test0",
        "1": "test1",
        "2": "test2",
        "3": "test3",
        "4": "test5",
    })
