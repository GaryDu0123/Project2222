from django.db import models
from django.contrib.auth.models import User


# class Message

# Create your models here.
class FriendRelationship(models.Model):
    relation_id = models.AutoField(primary_key=True)
    user1 = models.OneToOneField(to=User, on_delete=models.CASCADE, related_name="user1")
    user2 = models.OneToOneField(to=User, on_delete=models.CASCADE, related_name="user2")


# todo 写发送的时候记得在后端前端都做个最大限制
class MessageRecord(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="receiver")
    message = models.TextField()
