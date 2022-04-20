#!/usr/bin/env python
# -*-coding:utf-8 -*-
import random
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseServerError, Http404, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import transaction
from encryption.key import RSA_manager
from encryption.models import KeyManager
import json


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
    if request.method == 'GET':
        return render(request, "login.html")
    elif request.method == 'POST':
        try:
            data = RSA_manager.decrypt(request.POST['key'])
            request_data = json.loads(data)
            username = request_data['username']
            password = request_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                # todo 考虑一下要不要直接redirect
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=401)
        except Exception as e:
            print(e)
            return HttpResponse(status=403)
    raise Http404("Page does not exist")


def register(request):
    if request.method == 'GET':
        return render(request, "register.html")
    elif request.method == 'POST':
        try:
            data = RSA_manager.decrypt(request.POST['key'])  # private key decrypts ciphertext
            request_data = json.loads(data)  # change the json string to dict
            username = request_data['username']  # get username
            password = request_data['password']  # get password
            password_check_box = request_data['passwordCheckBox']  # get checkbox
            public_key = request.POST['publicKey']  # get user public key
            if password != password_check_box:
                raise Exception
            # transaction.atomic() guaranteed that both insert statements can be
            # successfully executed, and any statement that fails will fall back
            # to before execution.
            with transaction.atomic():
                user = User.objects.create_user(username, email=None, password=password)
                key = KeyManager.objects.create(user=user, public_key=public_key)
                user.save()
                key.save()
        except Exception as e:
            print(e)
            return HttpResponse(status=403)
        login(request, user)
        return HttpResponse(status=200)
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
