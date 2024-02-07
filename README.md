This is a README


# DB Setup
While in the django_react_roomscheduler folder run:
```cmd
     docker build -t roomschduler -f Dockerfile . 
```
Then to start the database run
```cmd
    docker run --name RoomScheduler -p 5432:5432 -d roomschduler
```