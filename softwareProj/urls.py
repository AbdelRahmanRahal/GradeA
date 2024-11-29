"""
URL configuration for softwareProj project.

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
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include(("pages.urls", "pages"), "pages"))
    # path('thisThing', include('pages.urls')),
    # www.site.com/thisThing
    # awel param: el klma elly btkon mwgoda f a5r el link b3d el slash elly htwasalk ll page de msln (pages/) (w lw sebtaha fadya yb2a hya de awel 7aga htft7 m3ak mn el main link), 
    # tani param: urls files el far3i elly gwa el app bta3i
]
