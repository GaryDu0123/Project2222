#!/usr/bin/env python
# -*-coding:utf-8 -*-

from django.urls import path, include
from . import views


urlpatterns = [
    path('test', views.test),
    path('response', views.api_response),
    path('get_user_friend_box', views.get_user_friend_box)
]

