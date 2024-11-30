"""
URL configuration for elearning_platform project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from users import views
from django.conf.urls import handler404, handler500

handler404 = 'users.views.custom_404_view'
handler500 = 'users.views.custom_500_view'



urlpatterns = [
    path('', views.index_view, name='index'),
     path('admin/', admin.site.urls),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('courses/', views.course_list, name='course_list'),
    path('courses/<int:course_id>/', views.course_detail, name='course_detail'),
    path('assignments/', views.assignment_list, name='assignment_list'),
    path('assignments/<int:assignment_id>/', views.assignment_detail, name='assignment_detail'),
   
    path('courses/<int:course_id>/enroll/', views.enroll_course, name='enroll_course'),
    path('progress/', views.progress_tracking, name='progress_tracking'),
]