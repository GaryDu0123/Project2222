from datetime import datetime

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import Forum
from django.contrib.auth.decorators import login_required


# Create your views here.

@login_required
def index(request):
    return render(request, 'forum/index.html', {"contents": Forum.objects.all().order_by('-id')})


@login_required
def receivePost(request):
    try:
        request_data = request.POST
        timestamp = int(request_data["timestamp"])
        date = datetime.fromtimestamp(timestamp / 1000)
        message = Forum.objects.create(user=request.user,
                                       title=request_data['title'],
                                       content=request_data['content'],
                                       time=date
                                       )

        return JsonResponse({'status': '200', "content": {
            'user': message.user.username,
            'time': message.time.strftime('%Y-%m-%d %H:%M:%S')
        }})
    except Exception:
        return JsonResponse({'status': '403'})
