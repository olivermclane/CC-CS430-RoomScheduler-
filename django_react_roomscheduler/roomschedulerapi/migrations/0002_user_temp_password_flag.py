# Generated by Django 5.0.1 on 2024-04-28 23:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('roomschedulerapi', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='temp_password_flag',
            field=models.BooleanField(default=False),
        ),
    ]
