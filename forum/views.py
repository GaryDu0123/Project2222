from datetime import datetime

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import Forum, Repository, Category
from django.contrib.auth.decorators import login_required, permission_required


# Create your views here.

@login_required
def index(request):
    return render(request, 'forum/index.html',
                  {"contents": Forum.objects.all().order_by('-id').filter(is_deleted=False)})


@login_required
def receivePost(request):
    if request.method == 'POST':
        try:
            if request.user.has_perm('forum.muted'):
                return JsonResponse({'status': 'muted'})
            request_data = request.POST
            timestamp = int(request_data["timestamp"])
            date = datetime.fromtimestamp(timestamp / 1000)
            message = Forum.objects.create(user=request.user,
                                           title=request_data['title'],
                                           content=request_data['content'],
                                           time=date,
                                           )

            return JsonResponse({'status': '200', "content": {
                'user': message.user.username,
                'time': message.time.strftime('%Y-%m-%d %H:%M:%S'),
                'id': message.id
            }})
        except Exception:
            return JsonResponse({'status': '403'})
    else:
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
        "contents": Forum.objects.filter(Q(title__contains=content) | Q(content__contains=content),
                                         is_deleted=False).order_by('-id')
    })


@login_required
def resource_repository(request):
    return render(request, 'forum/knowledgeRepository.html',
                  {"contents": Repository.objects.filter(is_deleted=False).order_by('-id'),
                   'categorys': Category.objects.all()
                   })


@login_required
def repositoryPost(request):
    try:
        if request.user.has_perm('forum.muted'):
            return JsonResponse({'status': 'muted'})
        request_data = request.POST
        timestamp = int(request_data["timestamp"])
        date = datetime.fromtimestamp(timestamp / 1000)
        category = Category.objects.get(category=request_data["category"])
        message = Repository.objects.create(user=request.user,
                                            title=request_data['title'],
                                            content=request_data['content'],
                                            time=date,
                                            category=category
                                            )

        return JsonResponse({'status': '200', "content": {
            'user': message.user.username,
            'time': message.time.strftime('%Y-%m-%d %H:%M:%S'),
            'id': message.id,
            'category': message.category.category,
        }})
    except Exception:
        return JsonResponse({'status': '403'})


@login_required
def repository_search(request):
    content = None
    category = None
    if 'search-content' in request.GET:
        content = request.GET['search-content']
    if 'category' in request.GET:
        category = request.GET['category']
    if content is None and category is None:
        return render(request, 'forum/knowledgeRepository.html', {
            "contents": Repository.objects.filter(is_deleted=False).order_by('-id')
        })

    if content is not None:
        return render(request, 'forum/knowledgeRepository.html', {
            "contents": Repository.objects.filter(Q(title__contains=content) | Q(content__contains=content),
                                                  is_deleted=False).order_by('-id'),
            'categorys': Category.objects.all()
        })
    if category is not None:
        category_obj = Category.objects.get(category=category)
        return render(request, 'forum/knowledgeRepository.html', {
            "contents": Repository.objects.filter(category=category_obj, is_deleted=False).order_by('-id'),
            'categorys': Category.objects.all()
        })


@permission_required('forum.admin', raise_exception=True)
@login_required
def repository_deleteblog(request):
    try:
        repository_blog = Repository.objects.get(id=int(request.POST['id']))
        repository_blog.is_deleted = True
        repository_blog.save()
        return JsonResponse({'status': 'successful'})
    except Exception:
        return JsonResponse({'status': 'error'})


@permission_required('forum.admin', raise_exception=True)
@login_required
def repository_muteuser(request):
    try:
        user = Repository.objects.get(id=int(request.POST['id'])).user
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

