#!/usr/bin/env python
# -*-coding:utf-8 -*-

from django import template
from django.utils.html import format_html
from encryption.key import RSA_manager

register = template.Library()


@register.simple_tag
def public_key():
    return format_html(
        '<input type="hidden" id="public_key" value="{}" disabled="disabled">',
        RSA_manager.PUBLIC_KEY_8
    )
