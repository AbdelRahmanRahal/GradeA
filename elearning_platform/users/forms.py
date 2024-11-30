from django import forms
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    profile_picture = forms.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password1', 'password2', 'profile_picture']  # Include all required fields

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Enter password'}),
        label="Password",
        help_text="Your password must be at least 8 characters long.",
    )
    password_confirm = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm password'}),
        label="Confirm Password",
    )
    profile_picture = forms.ImageField(
        required=False,
        label="Profile Picture",
        help_text="Optional: Upload a profile picture."
    )
    bio = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Tell us about yourself', 'rows': 4}),
        required=False,
        label="Bio",
        help_text="Optional: Add a brief description about yourself."
    )

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'role', 'password', 'profile_picture', 'bio']
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Enter username'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Enter email'}),
            'role': forms.Select(attrs={'placeholder': 'Select your role'}),
        }

    def clean_password(self):
        password = self.cleaned_data.get("password")
        validate_password(password)  # Ensures password meets Django's security standards
        return password

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already registered.")
        return email

    def clean_role(self):
        role = self.cleaned_data.get("role")
        if role not in [choice[0] for choice in CustomUser.ROLE_CHOICES]:
            raise forms.ValidationError("Invalid role selected.")
        return role

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_confirm = cleaned_data.get("password_confirm")

        if password and password_confirm and password != password_confirm:
            self.add_error('password_confirm', "Passwords do not match")

        return cleaned_data
