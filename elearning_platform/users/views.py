from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from .models import Course, Enrollment, Assignment, CourseProgress, CustomUser  # Use CustomUser for custom user model
from .forms import CustomUserCreationForm  # Use the custom form for user registration
from django.http import JsonResponse
from .decorator import role_required
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm


# 1. User Registration View
def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)

        if form.is_valid():
            # Save the user and redirect to the login page after successful registration
            form.save()
            messages.success(request, "Registration successful! You can now log in.")
            return redirect('login')  # Redirect to the login page
        else:
            # If the form is invalid, show the errors for debugging
            print(form.errors)  # This will print the errors to the console
            messages.error(request, "There was an error with your registration. Please try again.")
            
            # Optionally: Print each error individually for debugging purposes
            for field, errors in form.errors.items():
                print(f"Field {field} has errors: {errors}")

    else:
        form = CustomUserCreationForm()  # For GET requests, show an empty form

    return render(request, 'register.html', {'form': form})


# 2. User Login View
def user_login(request):
    """
    Handles user login by checking the credentials, logging in the user, and redirecting.
    """
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            # Retrieve the cleaned data from the form
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            # Authenticate the user using the provided credentials
            user = authenticate(request, username=username, password=password)

            if user is not None:
                # If user is authenticated, log them in
                login(request, user)

                # Check if a 'next' parameter is provided and redirect accordingly
                next_url = request.GET.get('next', 'dashboard')  # Default to 'dashboard'
                return redirect(next_url)
            else:
                # If authentication fails, show an error message
                messages.error(request, "Invalid username or password.")
                return render(request, 'login.html', {'form': form})

        else:
            # If form is invalid, show errors
            messages.error(request, "Please correct the error below.")
            return render(request, 'login.html', {'form': form})

    else:
        form = AuthenticationForm()  # For GET requests, show an empty form

    return render(request, 'login.html', {'form': form})


@login_required
def user_logout(request):
    """
    Logs out the user and redirects to the login page.
    """
    logout(request)
    return redirect('login')


@login_required
def dashboard(request):
    """
    Displays a unified dashboard based on the user's role (student or instructor).
    """
    if request.user.role == 'instructor':
        return instructor_dashboard(request)  # Redirect to instructor dashboard
    else:
        # For students, filter enrollments based on the 'student' field
        enrollments = Enrollment.objects.filter(student=request.user)  # Changed user to student
        context = {"enrollments": enrollments}
        return render(request, 'dashboard/student_dashboard.html', context)


@login_required
@role_required('instructor')  # Restrict access to instructors only
def instructor_dashboard(request):
    """
    Displays the instructor's dashboard with their courses and statistics.
    """
    courses = Course.objects.filter(instructor=request.user)
    course_data = [
        {
            "course": course,
            "student_count": Enrollment.objects.filter(course=course).count(),
        }
        for course in courses
    ]
    return render(request, "dashboard/instructor_dashboard.html", {"courses": course_data})


@login_required
def course_search(request):
    """
    Enables users to search and filter courses by query and category.
    """
    query = request.GET.get('query', '')  # Get the search query
    category = request.GET.get('category', '')  # Get the category filter
    courses = Course.objects.all()  # Get all courses

    if query:
        # Filter courses by title based on query
        courses = courses.filter(title__icontains=query)
    if category:
        # Filter courses by category if provided
        courses = courses.filter(category=category)

    return render(request, 'courses/course_list.html', {"courses": courses, "query": query, "category": category})


@login_required
def progress_tracking(request):
    """
    Tracks user progress and displays it in a chart-friendly format.
    """
    user_progress = Progress.objects.filter(user=request.user)  # Assuming Progress model is related to user
    progress_data = [
        {"course": progress.course.title, "percentage": progress.percentage}
        for progress in user_progress
    ]
    return JsonResponse({"progress": progress_data})


def index_view(request):
    """
    Displays the index page with featured courses.
    """
    featured_courses = Course.objects.all()  # Fetch all courses marked as featured
    return render(request, 'index.html', {'featured_courses': featured_courses})


def custom_404_view(request, exception):
    """
    Custom 404 error page.
    """
    return render(request, '404.html', status=404)


def custom_500_view(request):
    """
    Custom 500 error page.
    """
    return render(request, '500.html', status=500)


@login_required
def course_detail(request, course_id):
    """
    Displays detailed information about a specific course.
    """
    course = get_object_or_404(Course, id=course_id)  # Fetch course by ID
    is_enrolled = Enrollment.objects.filter(student=request.user, course=course).exists()  # Check if user is enrolled
    return render(request, 'courses/course_detail.html', {"course": course, "is_enrolled": is_enrolled})


@login_required
def enroll_course(request, course_id):
    """
    Allows users to enroll in a course.
    """
    course = get_object_or_404(Course, id=course_id)  # Fetch course by ID
    Enrollment.objects.get_or_create(student=request.user, course=course)  # Enroll user if not already enrolled
    return redirect('dashboard')  # Redirect to the dashboard


# View to display all courses
def course_list(request):
    """
    Fetches and displays all courses.
    """
    courses = Course.objects.all()  # Fetch all courses from the database
    return render(request, 'courses/course_list.html', {'courses': courses})


# View to display the details of a specific course
def course_detail(request, course_id):
    """
    Displays detailed information about a specific course.
    """
    course = get_object_or_404(Course, id=course_id)  # Fetch course based on its ID
    assignments = Assignment.objects.filter(course=course)  # Get assignments for this course
    return render(request, 'courses/course_detail.html', {'course': course, 'assignments': assignments})


# View to display all assignments
def assignment_list(request):
    """
    Displays a list of all assignments.
    """
    assignments = Assignment.objects.all()  # Fetch all assignments from the database
    return render(request, 'assignments/assignment_list.html', {'assignments': assignments})


# View to display the details of a specific assignment
def assignment_detail(request, assignment_id):
    """
    Displays detailed information about a specific assignment.
    """
    assignment = get_object_or_404(Assignment, id=assignment_id)  # Fetch the assignment based on its ID
    return render(request, 'assignments/assignment_detail.html', {'assignment': assignment})
