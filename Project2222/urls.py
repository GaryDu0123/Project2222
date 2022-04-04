"""Project2222 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib.staticfiles.views import serve
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('about', views.about),
    path('register', views.register),
    path('', views.index),
    path('home', views.index),
    path('login', views.login_page),
    path('robots.txt', views.robot),
    path('favicon.ico', serve, {'path': 'icon/favicon.ico'}),
    path('test', views.test),
    path('logout', views.logout_button),
    path('chat/', include('chat.urls'))
]

handler404 = views.error
