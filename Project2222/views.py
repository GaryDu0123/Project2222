#!/usr/bin/env python
# -*-coding:utf-8 -*-
import random

from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseServerError, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required


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
                return render(request, "valid.html", {"name": user.username})
            else:
                return HttpResponseRedirect(next_direct)
        else:
            return render(request, "invalid.html")
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
