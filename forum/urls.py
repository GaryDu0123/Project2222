#!/usr/bin/env python
# -*-coding:utf-8 -*-

from django.urls import path, include
from . import views


urlpatterns = [
    path('index', views.index),
    path('repository', views.resource_repository),
    path('post', views.receivePost),
    path('muteuser', views.muteUser),
    path('deleteblog', views.deleteBlog),
    path('search', views.search),
    path('repository/post', views.repositoryPost),
    path('repository/search', views.repository_search),
    path('repository/muteuser', views.repository_muteuser),
    path('repository/deleteblog', views.repository_deleteblog)
]

