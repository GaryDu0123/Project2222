# Database
Database current use in sqlite3

# Install the project requirement
```shell
pip install -r requirements.txt
```

# Start the server
```shell
python manage.py runsslserver 127.0.0.1:8000 --certificate ./certs/myCA.pem --key ./certs/server_nopwd.key
```

# Test user
> Username: user1
> password: 123

> Username: user2
> password: 123

Please insert the public key into browser
1. Click F12 on the keyboard or use check to open browser developer mode
2. Click Application tab
3. Click Local storage and insert below key pair

```
Key: user1
Value: 
{"publicKey":"-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmC1GvRupdaGCI8tK5ruZKw/vd\nSRN/6yn9//0rRauFxnIGDcAEJY3Bb73SLvhS+OBQDbmtdaKaqfMzWX+ddbP13Oxh\nbiuDNINYk7zdnbrz4PUBjOuWOGhbNyr2cX1Re/1K9wVkLoPXhDkWEUexfPeNy2n7\nq2NLugdvVbBdJILv7QIDAQAB\n-----END PUBLIC KEY-----","privateKey":"-----BEGIN PRIVATE KEY-----\nMIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAKYLUa9G6l1oYIjy\n0rmu5krD+91JE3/rKf3//StFq4XGcgYNwAQljcFvvdIu+FL44FANua11opqp8zNZ\nf511s/Xc7GFuK4M0g1iTvN2duvPg9QGM65Y4aFs3KvZxfVF7/Ur3BWQug9eEORYR\nR7F8943LafurY0u6B29VsF0kgu/tAgMBAAECgYAJqw8OjaqH1dQJJVpvxWdTYyX/\nNIoWILNJPuaW5m+eUnfBMnvDwgwG/2KmImYDLsqg3qu5Fehp6QtoKgXsPTZFOp0w\nLxqD5vPmWNbevN5Fwx9aUN4PRtFQLGf9sbGKVsRXDYhI3eCRZJKy2Q5x414+Yvuv\nbrU93A7sQjS4OefXYQJBAM/K6JciZCIA4a/69Zi09hOnHKBHAngTG+lKvriGhgkD\nNCH/+w/Xr7pOUo5G6w6OMbmZz9mh+IVKdr7lkuakUZMCQQDMkOpUcIAdQbTT1/Bb\nGA/0rQ9O1N6PdHFegIvelWI83C5SHSHdGbBMmCcVbpk6WBFjQC1E1FbgKEmNmlMw\ncqh/AkBv9STy4Y3QIGd5eR9A4ye/GQg8d2YmKi2cujAeniSz0G0TcKfmNlExcafb\njuxxUD4MgYpS+Yk80A1A99L5wElPAkAiB4FTpptJQqLoEqXjIW+WDivbu0GCr6Yk\nSFH8JvF+mkoCUuJNO3a+ZxkpUYqf0AKkdgqRxpjlFQ6XRbLM/mXVAkAn5p0HA+9X\nKnx/aAEPFWJiS/aYl5RBZDjKNB1WvQZ6Wgnxb+bUDenaCZogxAtitwM0fDQxMHhF\nlZVAwOc8vJfU\n-----END PRIVATE KEY-----"}
```
```
Key: user2
Value: 
{"publicKey":"-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDyLFuD8dUlQqc14JdNnu7DPQKZ\nKtG1c+ZFEBilaXdr5hTWjYkKlsa75MBgBxesH/QkFRPUOiKLxPFUDUQ54D0tuftF\njSzNnk8eF3X4di4lEdxO1nDTOhQ7L5K5tq1TSsh5qLSg8f7Ihd5Cof0wedpMDVHf\nJ16rbC6WcY/jxy5o2wIDAQAB\n-----END PUBLIC KEY-----","privateKey":"-----BEGIN PRIVATE KEY-----\nMIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAPIsW4Px1SVCpzXg\nl02e7sM9Apkq0bVz5kUQGKVpd2vmFNaNiQqWxrvkwGAHF6wf9CQVE9Q6IovE8VQN\nRDngPS25+0WNLM2eTx4Xdfh2LiUR3E7WcNM6FDsvkrm2rVNKyHmotKDx/siF3kKh\n/TB52kwNUd8nXqtsLpZxj+PHLmjbAgMBAAECgYA0o2mc62K9/5fiwReCGqqhK1C2\nRDVi8Hc7ybzhr2PywwcCf68q6wz1aEpcVQ5TLnrdoOs3dQ9vO/aMo3mR7ui87G2X\nrmyTBR7vai9wuVO0D609yO55vwBJwhY4iNe42RKRA1s22P4NgfG2lFi9ATJ9RZb+\nYIlAta4zri7KJ0FBuQJBAP30e/89TNJmJFX+ZuUW2ywOL8OPZ3FCGt02jOln7gS8\n1kVct5WJAowx4DTZ2rvXwBxyeo42NBM9S5UgINvyO/UCQQD0H5XsPnFUKywE4TR/\nfU3l/1YUnnvp/rwyg/O9+RPQU5fsfuMxfh74BBxNMozccb5+Fe+rApiva/CDSncP\nw1+PAkEAiO4vgcOCzZunkfqXboTxboLDvFVxeD8ljwuf1SZlz4YmnsXMc0Op7P/j\nnXuuFkTR4ETV0iJl183gGCt3rECjlQJBAKD8W0+pde69cY/eO1J/fWlY0plSUgDj\nHZRqc8gpgyl0ltE8c/Jla2K+wzMdTMrqr2ZSbPRnB+1WzwqlhpJ8kn0CQAY+vjzr\nGj4N1DahDNNH4DcRUihsslZcJ3pNukYpmW/keqFn+SnnxiGYfEHj5Y27Tlec2X7m\nv/zsArlaWFScgu4=\n-----END PRIVATE KEY-----"}
```
See picture in Project2222/other/img.png

# Admin user
Admin manage site: https://127.0.0.1:8000/admin/
> Username: garydu
> password: group1