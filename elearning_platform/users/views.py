# Import necessary modules for user authentication, rendering views, etc.
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import UserRegistrationForm  # Import the form for user registration
from .decorator import role_required  # Import custom decorator for role-based access control
from .models import Course, Enrollment  # Import models for courses and enrollments

# View for handling user registration
def register(request):
    if request.method == 'POST':
        # If the request is a POST, process the registration form
        form = UserRegistrationForm(request.POST)
        if form.is_valid():  # If form data is valid, save user and log them in
            user = form.save()
            login(request, user)
            return redirect('dashboard')  # Redirect to the dashboard after successful registration
    else:
        form = UserRegistrationForm()  # Render an empty registration form for GET request
    return render(request, 'register.html', {'form': form})

# View for handling user login
def user_login(request):
    if request.method == 'POST':
        # If the request is a POST, authenticate the user based on provided credentials
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:  # If authentication is successful, log the user in and redirect to the dashboard
            login(request, user)
            return redirect('dashboard')
        else:
            # If authentication fails, render the login page with an error message
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')  # Render the login page for GET request

# View for logging out the user
@login_required  # Ensure that the user is logged in before they can access this view
def user_logout(request):
    logout(request)  # Log the user out
    return redirect('login')  # Redirect to the login page after logging out

# Instructor dashboard view, accessible only to users with the 'instructor' role
@login_required
@role_required('instructor')  # Custom decorator to ensure only instructors can access this view
def instructor_dashboard(request):
    # Fetch all courses taught by the current instructor
    courses = Course.objects.filter(instructor=request.user)

    # Gather statistics for each course (e.g., number of students enrolled)
    course_data = []
    for course in courses:
        enrollments = Enrollment.objects.filter(course=course)
        course_data.append({
            "course": course,
            "student_count": enrollments.count(),
            "enrollments": enrollments,
        })

    context = {
        "courses": course_data,  # Pass the course data to the template context
    }
    return render(request, "dashboard/instructor_dashboard.html", context)

# Custom error handling views

# Custom 404 error page when the requested page is not found
def custom_404_view(request, exception):
    return render(request, '404.html', status=404)

# Custom 500 error page for internal server errors
def custom_500_view(request):
    return render(request, '500.html', status=500)

# The index view for rendering the home page
def index_view(request):
    return render(request, 'index.html')  # Render the 'index.html' template

