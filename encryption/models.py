from django.conf import settings
from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User


# class Message

# Create your models here.


class PublicManage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    public_key = models.TextField()
