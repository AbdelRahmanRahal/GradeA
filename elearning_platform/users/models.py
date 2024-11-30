from django.db import models
from django.contrib.auth.models import AbstractUser  # Import AbstractUser
from django.conf import settings  # Import settings for AUTH_USER_MODEL


# Custom User Model
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    bio = models.TextField(null=True, blank=True)  # Optional bio for instructors
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)  # Optional profile picture

    # Resolving reverse accessor clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',  # Unique related name
        blank=True,
        help_text='The groups this user belongs to.'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',  # Unique related name
        blank=True,
        help_text='Specific permissions for this user.'
    )

    def __str__(self):
        return self.username


User = settings.AUTH_USER_MODEL  # Ensure this points to your custom user model


# Course Model
class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="courses")
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='courses/images/', null=True, blank=True)  # Optional course image
    is_featured = models.BooleanField(default=False)  # Add this field for featured courses

    def __str__(self):
        return self.title

    def Enrolled_students(self):
        return self.enrollments.all().select_related('student')  # Query optimization


# Enrollment Model
class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Uses the custom user model
        on_delete=models.CASCADE,  # If the user is deleted, also delete their enrollments
        related_name="enrollments"  # Allows reverse relation from CustomUser to Enrollment
    )
    
    course = models.ForeignKey(
        Course,  # Assuming Course is defined in the same or another app
        on_delete=models.CASCADE,  # If the course is deleted, also delete the enrollment
        related_name="enrollments"  # Allows reverse relation from Course to Enrollment
    )
    
    enrolled_at = models.DateTimeField(auto_now_add=True)  # Automatically set when the enrollment is created
    
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES,  # Provides 'active' or 'completed' options
        default='active'  # Default value for new enrollments
    )

    def __str__(self):
        return f"{self.student} enrolled in {self.course} ({self.status})"
    
    class Meta:
        # Optional: Index on 'student' and 'course' for better query performance
        indexes = [
            models.Index(fields=['student', 'course']),
        ]


# Assignment Model
class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateTimeField()
    total_marks = models.PositiveIntegerField(default=100)  # Max marks for assignment

    def __str__(self):
        return self.title

    def clean(self):
        if self.due_date < timezone.now():
            raise ValidationError('Due date cannot be in the past')


# Submission Model
class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    submitted_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='submissions/')
    grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Grade given to submission

    def __str__(self):
        return f"Submission by {self.student.username} for {self.assignment.title}"


# Course Progress Model
class CourseProgress(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='progress')
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # Percentage progress
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.username} progress in {self.course.title}: {self.progress}%"


# Additional Metadata
class CourseMetadata(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='metadata')
    duration = models.PositiveIntegerField(help_text='Course duration in hours', null=True, blank=True)
    prerequisites = models.TextField(help_text='Course prerequisites', null=True, blank=True)

    def __str__(self):
        return f"Metadata for {self.course.title}"
