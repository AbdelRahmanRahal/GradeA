from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

# Create your views here.


# el user lama ysearch on the link hwa k2no byb3t request to the 
# data base bta3ti wana barod 3leh b shakl el page 3amla ezay

# def about(request):
#     return HttpResponse('about page')

# -------------------------------------------------------

# 3ayza a pass template l page gahza kamla msh klma b2a:-

@login_required
def home(request):
 return render(request, "home.html", {})

def authView(request):
 if request.method == "POST":
  form = UserCreationForm(request.POST or None)
  if form.is_valid():
   form.save()
   return redirect("pages:login")
 else:
  form = UserCreationForm()
 return render(request, "registration/sign_up.html", {"form": form})
