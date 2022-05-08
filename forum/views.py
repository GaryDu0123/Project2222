from datetime import datetime

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import Forum
from django.contrib.auth.decorators import login_required, permission_required


# Create your views here.

@login_required
def index(request):
    return render(request, 'forum/index.html',
                  {"contents": Forum.objects.all().order_by('-id').filter(is_deleted=False)})


@login_required
def receivePost(request):
    try:
        if request.user.has_perm('forum.muted'):
            return JsonResponse({'status': 'muted'})
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
            'time': message.time.strftime('%Y-%m-%d %H:%M:%S'),
            'id': message.id
        }})
    except Exception:
        return JsonResponse({'status': '403'})


@permission_required('forum.admin', raise_exception=True)
@login_required
def deleteBlog(request):
    try:
        forum_blog = Forum.objects.get(id=int(request.POST['id']))
        forum_blog.is_deleted = True
        forum_blog.save()
        return JsonResponse({'status': 'successful'})
    except Exception:
        return JsonResponse({'status': 'error'})


@permission_required('forum.admin', raise_exception=True)
@login_required
def muteUser(request):
    try:
        user = Forum.objects.get(id=int(request.POST['id'])).user
        content_type = ContentType.objects.get_for_model(Forum)
        permission = Permission.objects.get(
            codename='muted',
            content_type=content_type,
        )
        user.user_permissions.add(permission)
        user.save()
        return JsonResponse({'status': 'successful'})
    except Exception:
        return JsonResponse({'status': 'error'})


@login_required
def search(request):
    content = request.GET['search-content'] if 'search-content' in request.GET else None
    if content is None:
        return render(request, 'forum/index.html', {
            "contents": Forum.objects.filter(is_deleted=False).order_by('-id')
        })
    return render(request, 'forum/index.html', {
        "contents": Forum.objects.filter(Q(title__contains=content) | Q(content__contains=content), is_deleted=False).order_by('-id')
    })
