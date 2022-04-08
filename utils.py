#!/usr/bin/env python
# -*-coding:utf-8 -*-
from chat.models import FriendRelationship, MessageRecord
from django.db.models import Q


def is_friend(user_1, user_2):
    try:
        test = FriendRelationship.objects.get(Q(user_1=user_2, user_2=user_1) | Q(user_1=user_1, user_2=user_2))
        if test is not None:
            return True
    except Exception as e:
        pass
    return False

