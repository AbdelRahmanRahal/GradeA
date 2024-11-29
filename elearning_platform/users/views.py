from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import UserRegistrationForm
from .decorator import role_required

from django.contrib.auth.decorators import login_required
from .models import Course, Enrollment

def register(request):
    if request.method == 'POST':

        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')  # Redirect to a dashboard
    else:
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')

@login_required
def user_logout(request):
    logout(request)
    return redirect('login')



@login_required
def instructor_dashboard(request):
    if request.user.role != "instructor":
        return render(request, "403.html")  # Show forbidden page if not an instructor

    # Get all courses taught by the instructor
    courses = Course.objects.filter(instructor=request.user)

    # Gather statistics for each course
    course_data = []
    for course in courses:
        enrollments = Enrollment.objects.filter(course=course)
        course_data.append({
            "course": course,
            "student_count": enrollments.count(),
            "enrollments": enrollments,
        })

    context = {
        "courses": course_data,
    }
    return render(request, "dashboard/instructor_dashboard.html", context)
def custom_404_view(request, exception):
    return render(request, '404.html', status=404)

def custom_500_view(request):
    return render(request, '500.html', status=500)
def index_view(request):
    return render(request, 'index.html')