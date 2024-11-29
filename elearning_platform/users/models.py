from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

# CustomUser model extends the default Django User model and adds a 'role' field.
class CustomUser(AbstractUser):
    # Define the possible roles a user can have
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('admin', 'Admin'),
    ]
    # 'role' field determines the type of user (Student, Instructor, Admin)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        # Return the username of the user when the object is represented as a string
        return self.username

# Get the custom user model to use in the application
User = get_user_model()

# Course model to store course details
class Course(models.Model):
    title = models.CharField(max_length=255)  # Course title
    description = models.TextField()  # Course description
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="courses")  # Link to instructor (User)
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set the creation timestamp

    def __str__(self):
        # Return the course title when the object is represented as a string
        return self.title

# Enrollment model to track which student is enrolled in which course
class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")  # Link to student (User)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")  # Link to course
    enrolled_at = models.DateTimeField(auto_now_add=True)  # Automatically set the enrollment timestamp

    class Meta:
        # Ensure a student can only enroll in the same course once
        unique_together = ('student', 'course')

    def __str__(self):
        # Return a string representation of the enrollment, showing the student and course
        return f"{self.student.username} enrolled in {self.course.title}"

# Assignment model to define assignments for a course
class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')  # Link to course
    title = models.CharField(max_length=200)  # Assignment title
    description = models.TextField()  # Assignment description
    due_date = models.DateTimeField()  # Due date for the assignment

    def __str__(self):
        # Return the assignment title when the object is represented as a string
        return self.title

# Submission model to handle student submissions for assignments
class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')  # Link to assignment
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')  # Link to student (User)
    submitted_at = models.DateTimeField(auto_now_add=True)  # Automatically set the submission timestamp
    file = models.FileField(upload_to='submissions/')  # File field for student submission

    def __str__(self):
        # Return a string representation of the submission, showing the student and assignment
        return f"Submission by {self.student.username} for {self.assignment.title}"
