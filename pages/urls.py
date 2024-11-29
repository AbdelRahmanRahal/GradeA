from django.urls import path, include
from .views import authView, home

# h import views page hena 34an a3ml link ll funcitions bta3tha
from . import views

urlpatterns = [
    # esm el link b3d el slash, anhi func, adeha name
    #path('', views.index, name='index'),
    path("", home, name="home"),
    path("signup/", authView, name="authView"),
    path("accounts/", include("django.contrib.auth.urls")),
    # path('esmElPage', views.index, name='index')
    # www.site.com/esmELProj/esmELpage
    # esm el proj bykon m7tot fl main urls.py file
]