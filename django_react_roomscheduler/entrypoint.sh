#!/bin/sh

if [ "$DATABASE_TYPE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      echo "Postgres is not up yet..."
      sleep 1
    done

    echo "PostgreSQL started"
fi

python manage.py flush --no-input

python manage.py collectstatic --no-input
python manage.py migrate

exec "$@"