#!/usr/bin/env python
# -*-coding:utf-8 -*-
import base64

from Cryptodome.PublicKey import RSA
from Cryptodome.Cipher import PKCS1_OAEP, PKCS1_v1_5

print("Start Generating REA Keys")
# __PUBLIC_KEY_NUMBER, __PRIVATE_KEY_NUMBER = rsa.newkeys(2048)
# with open('pub_8.pem', 'r') as f:
#     PUBLIC_KEY_8 = f.read()
#
# with open('pri_8.pem', 'r') as f:
#     PRIVATE_KEY_8 = f.read()
#
# with open('pub_1.pem', 'r') as f:
#     PUBLIC_KEY_1 = f.read()
#
# with open('pri_1.pem', 'r') as f:
#     PRIVATE_KEY_1 = f.read()
# PUBLIC_KEY = str(__PUBLIC_KEY_NUMBER.save_pkcs1(), 'utf-8')
# PRIVATE_KEY = str(__PRIVATE_KEY_NUMBER.save_pkcs1(), 'utf-8')
print("RES Key Initialization Completed")


class RSAManager:
    def __init__(self):
        with open('encryption/pri_1.pem', 'r') as f:
            self.PUBLIC_KEY_8 = f.read()

        with open('encryption/pri_1.pem', 'r') as f:
            self.PRIVATE_KEY_8 = f.read()

        with open('encryption/pri_1.pem', 'r') as f:
            self.PUBLIC_KEY_1 = f.read()

        with open('encryption/pri_1.pem', 'r') as f:
            self.PRIVATE_KEY_1 = f.read()

    # Reference:  https://blog.csdn.net/weixin_44777680/article/details/106444437
    def decrypt(self, text):
        private_key = RSA.import_key(self.PRIVATE_KEY_8)
        cipher_rsa = PKCS1_v1_5.new(private_key)
        cipher_byte = base64.b64decode(text)
        return cipher_rsa.decrypt(cipher_byte, None).decode()

    def encrypt(self, text):
        public_key = RSA.import_key(self.PUBLIC_KEY_8)
        cipher_rsa = PKCS1_v1_5.new(public_key)
        msg = text.encode('utf8')
        en_data = cipher_rsa.encrypt(msg)
        return base64.b64encode(en_data).decode()


RSA_manager = RSAManager()
