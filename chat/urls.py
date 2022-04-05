#!/usr/bin/env python
# -*-coding:utf-8 -*-

from django.urls import path, include
from . import views


urlpatterns = [
    path('index', views.index),
    path('debug/addfriend', views.debug_add_friend),
    path('debug/addmessagerecord', views.debug_add_message)
]

