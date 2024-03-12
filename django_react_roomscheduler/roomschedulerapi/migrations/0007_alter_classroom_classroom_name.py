from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("roomschedulerapi", "0006_merge_20240229_2150"),
    ]

    operations = [
        migrations.AlterField(
            model_name="classroom",
            name="classroom_name",
            field=models.CharField(default=0, max_length=1000),
        ),
    ]
