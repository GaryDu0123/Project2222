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

# Admin user
Admin manage site: https://127.0.0.1:8000/admin/
> Username: garydu
> password: group1