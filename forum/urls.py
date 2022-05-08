#!/usr/bin/env python
# -*-coding:utf-8 -*-

from django.urls import path, include
from . import views


urlpatterns = [
    path('index', views.index),
    path('post', views.receivePost),
    path('muteuser', views.muteUser),
    path('deleteblog', views.deleteBlog),
    path('search', views.search)
]

