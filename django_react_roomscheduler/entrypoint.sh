#!/bin/sh

echo "Database: $DATABASE, Host: $DB_HOST, Port: $DB_PORT"

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      echo "Postgres is not up yet..."
      sleep 1
    done

    echo "PostgreSQL started"
fi

python manage.py flush --no-input
python manage.py migrate

exec "$@"