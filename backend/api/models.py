from django.db import models
import uuid

class Professor(models.Model):
    id = models.CharField(max_length=10, unique=True, null=False, primary_key=True)
    first_name = models.CharField(max_length=50, null=False)
    last_name = models.CharField(max_length=50, null=False)
    email = models.EmailField(unique=True, null=False)
    departments = models.JSONField(null=False)  # Storing multiple departments as a JSON array
    year = models.SmallIntegerField(null=False)
    serial_number = models.IntegerField(null=False)
    user_id = models.UUIDField(default=uuid.uuid4, unique=True)
    is_approved = models.BooleanField(default=False)

    class Meta:
        db_table = "professors"
        unique_together = ("year", "serial_number")


class Student(models.Model):
    id = models.CharField(max_length=10, unique=True, null=False, primary_key=True)
    first_name = models.CharField(max_length=50, null=False)
    last_name = models.CharField(max_length=50, null=False)
    email = models.EmailField(unique=True, null=False)
    department = models.CharField(max_length=25, null=False)
    year = models.SmallIntegerField(null=False)
    serial_number = models.IntegerField(null=False)
  
