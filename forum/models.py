from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class Category(models.Model):
    category = models.TextField()


class Forum(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    title = models.TextField()
    content = models.TextField()
    time = models.DateTimeField()
    views = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ('admin', 'administrator of the forum'),
            ('muted', 'User muted for sending blog')
        ]


class Repository(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    title = models.TextField()
    content = models.TextField()
    time = models.DateTimeField()
    views = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)
    category = models.ForeignKey(to=Category, on_delete=models.CASCADE)