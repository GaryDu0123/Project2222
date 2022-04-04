#!/usr/bin/env python
# -*-coding:utf-8 -*-
import random

from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseServerError, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User


def index(request):
    return render(request, 'index.html')


def about(request):
    """
    about_garble
    Returns one of several strings for the about page
    """
    garble = [
        "leverage agile frameworks to provide a robust synopsis for high level overviews.",
        "iterate approaches to corporate strategy and foster collaborative thinking to further the overall value "
        "proposition.",
        "organically grow the holistic world view of disruptive innovation via workplace change management and "
        "empowerment.",
        "bring to the table win-win survival strategies to ensure proactive and progressive competitive domination.",
        "ensure the end of the day advancement, a new normal that has evolved from epistemic management approaches "
        "and is on the runway towards a streamlined cloud solution.",
        "provide user generated content in real-time will have multiple touchpoints for offshoring."
    ]

    return render(request, 'about.html', {"garble": garble[random.randint(0, len(garble) - 1)]})


def login_page(request):
    next_direct = request.GET.get('next', '')
    if request.method == 'GET':
        return render(request, "login.html")
    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            if next_direct == "":
                # todo 考虑一下要不要直接redirect
                # return render(request, "valid.html", {"name": user.username})
                return redirect("/chat/index")
            else:
                return HttpResponseRedirect(next_direct)
        else:
            return render(request, "invalid.html")
    raise Http404("Page does not exist")


def register(request):
    if request.method == 'GET':
        return render(request, "register.html")
    elif request.method == 'POST':
        # todo 不安全!!!!!! 警告
        username = request.POST['username']
        password = request.POST['password']
        password_check_box = request.POST['passwordCheckBox']
        if password != password_check_box:
            # todo 添加警示错误
            return render(request, "register.html")

        try:
            if User.objects.get(username=username) is not None:
                return render(request, "register.html")
        except Exception as e:
            pass

        try:
            user = User.objects.create_user(username, email=None, password=password)
        except Exception as e:
            print(e)
            # todo 添加警示错误
            return render(request, "register.html")
        login(request, user)
        # todo 添加提示
        return render(request, "valid.html", {"name": user.username})
    raise Http404("Page does not exist")


def error(request, exception):
    return render(request, 'error.html', {"error_type": exception.response, "error_msg": exception.error_msg})


def robot(request):
    return render(request, 'robots.txt')


def logout_button(request):
    logout(request)
    return redirect("/login")


@login_required
def test(request):
    return render(request, "test.html")
