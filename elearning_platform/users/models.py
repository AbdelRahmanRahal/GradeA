from django.db import models
from django.contrib.auth.models import AbstractUser  # Import AbstractUser to create a custom user model
from django.conf import settings  # Import settings to refer to the custom user model


# Custom User Model
class CustomUser(AbstractUser):
    """
    Custom user model that extends the default Django AbstractUser model.
    It includes an additional 'role' field to define the user's role 
    (student, instructor, admin), a bio field for instructors, and 
    a profile picture.
    """
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')  # Defines the role of the user
    bio = models.TextField(null=True, blank=True)  # Optional field for instructor's bio
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)  # Optional profile picture

    # Resolving reverse accessor clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',  # Unique related name for reverse relation
        blank=True,
        help_text='The groups this user belongs to.'  # Groups the user can belong to
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',  # Unique related name for reverse relation
        blank=True,
        help_text='Specific permissions for this user.'  # Permissions assigned to the user
    )

    def __str__(self):
        return self.username  # Return the username when the user object is represented as a string


User = settings.AUTH_USER_MODEL  # Ensure the custom user model is used by referring to settings


# Course Model
class Course(models.Model):
    """
    Model representing a course with a title, description, instructor,
    image, and a flag to mark if it's featured.
    """
    title = models.CharField(max_length=255)  # The title of the course
    description = models.TextField()  # Detailed description of the course
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="courses")  # Instructor of the course
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the course is created
    image = models.ImageField(upload_to='courses/images/', null=True, blank=True)  # Optional image for the course
    is_featured = models.BooleanField(default=False)  # Whether the course is featured or not

    def __str__(self):
        return self.title  # Return the title of the course as the string representation

    def Enrolled_students(self):
        """
        Returns the list of students enrolled in this course with optimized query.
        """
        return self.enrollments.all().select_related('student')  # Query optimization to fetch students


# Enrollment Model
class Enrollment(models.Model):
    """
    Model representing a student's enrollment in a course with status (active/completed).
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Refers to the custom user model
        on_delete=models.CASCADE,  # If the student is deleted, their enrollments will be deleted too
        related_name="enrollments"  # Allows reverse relation from CustomUser to Enrollment
    )
    
    course = models.ForeignKey(
        Course,  # Refers to the Course model
        on_delete=models.CASCADE,  # If the course is deleted, the enrollment will be deleted too
        related_name="enrollments"  # Allows reverse relation from Course to Enrollment
    )
    
    enrolled_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the student enrolls in the course
    
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES,  # Choices between 'active' and 'completed'
        default='active'  # Default value for new enrollments
    )

    def __str__(self):
        return f"{self.student} enrolled in {self.course} ({self.status})"  # String representation of enrollment
    
    class Meta:
        # Optional: Create an index on student and course fields for faster queries
        indexes = [
            models.Index(fields=['student', 'course']),
        ]


# Assignment Model
class Assignment(models.Model):
    """
    Represents an assignment linked to a course with a title, description,
    due date, and total marks.
    """
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')  # Link assignment to a course
    title = models.CharField(max_length=200)  # Title of the assignment
    description = models.TextField()  # Detailed description of the assignment
    due_date = models.DateTimeField()  # The due date for the assignment
    total_marks = models.PositiveIntegerField(default=100)  # The total marks for the assignment

    def __str__(self):
        return self.title  # Return the title of the assignment as the string representation

    def clean(self):
        """
        Custom validation to ensure that the due date is not in the past.
        """
        if self.due_date < timezone.now():
            raise ValidationError('Due date cannot be in the past')


# Submission Model
class Submission(models.Model):
    """
    Represents a student's submission for an assignment, including the grade and file.
    """
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')  # Link submission to an assignment
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')  # Link submission to a student
    submitted_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the submission is made
    file = models.FileField(upload_to='submissions/')  # The file submitted by the student
    grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Optional grade for the submission

    def __str__(self):
        return f"Submission by {self.student.username} for {self.assignment.title}"  # Return string representation


# Course Progress Model
class CourseProgress(models.Model):
    """
    Represents the progress of a student in a course, including percentage progress.
    """
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_progress')  # Link progress to student
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='progress')  # Link progress to course
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # Percentage progress
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when the progress was last updated

    def __str__(self):
        return f"{self.student.username} progress in {self.course.title}: {self.progress}%"  # String representation of progress


# Additional Metadata
class CourseMetadata(models.Model):
    """
    Stores additional metadata for a course, such as its duration and prerequisites.
    """
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='metadata')  # Link metadata to a specific course
    duration = models.PositiveIntegerField(help_text='Course duration in hours', null=True, blank=True)  # Duration in hours
    prerequisites = models.TextField(help_text='Course prerequisites', null=True, blank=True)  # Prerequisites for the course

    def __str__(self):
        return f"Metadata for {self.course.title}"  # String representation of the course metadata
