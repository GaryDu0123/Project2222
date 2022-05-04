from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class Forum(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    title = models.TextField()
    context = models.TextField()
    author = models.TextField()
    time = models.DateTimeField()
    views = models.IntegerField(default=0)
