from django import forms
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser


# Custom user creation form for user registration with additional fields
class CustomUserCreationForm(UserCreationForm):
    """
    Custom form for creating a new user with additional email and profile picture fields.
    Inherits from UserCreationForm to handle user registration with extra validation.
    """
    email = forms.EmailField(required=True)  # Email field is mandatory for registration
    profile_picture = forms.ImageField(required=False)  # Optional profile picture upload

    class Meta:
        model = CustomUser  # Use the custom user model
        fields = ['username', 'email', 'password1', 'password2', 'profile_picture']  # Fields for user creation


# User registration form with password validation and optional bio/profile picture
class UserRegistrationForm(forms.ModelForm):
    """
    Form for user registration with fields like username, email, password, profile picture, and bio.
    Includes custom validation for password and email.
    """
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Enter password'}),  # Password input with placeholder
        label="Password",
        help_text="Your password must be at least 8 characters long.",  # Help text for password
    )
    password_confirm = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm password'}),  # Confirm password field with placeholder
        label="Confirm Password",
    )
    profile_picture = forms.ImageField(
        required=False,  # Optional profile picture
        label="Profile Picture",
        help_text="Optional: Upload a profile picture."  # Help text for profile picture
    )
    bio = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Tell us about yourself', 'rows': 4}),  # Textarea for bio
        required=False,  # Optional bio field
        label="Bio",
        help_text="Optional: Add a brief description about yourself."  # Help text for bio
    )

    class Meta:
        model = CustomUser  # Use the custom user model
        fields = ['username', 'email', 'role', 'password', 'profile_picture', 'bio']  # Fields to display in the form
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Enter username'}),  # Username input with placeholder
            'email': forms.EmailInput(attrs={'placeholder': 'Enter email'}),  # Email input with placeholder
            'role': forms.Select(attrs={'placeholder': 'Select your role'}),  # Role selection with placeholder
        }

    # Validate password with Django's built-in password validation
    def clean_password(self):
        password = self.cleaned_data.get("password")
        validate_password(password)  # Ensures password meets Django's security standards
        return password

    # Check if email is already registered
    def clean_email(self):
        email = self.cleaned_data.get("email")
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already registered.")  # Raise error if email exists
        return email

    # Ensure the selected role is valid
    def clean_role(self):
        role = self.cleaned_data.get("role")
        if role not in [choice[0] for choice in CustomUser.ROLE_CHOICES]:  # Check if the role is valid
            raise forms.ValidationError("Invalid role selected.")  # Raise error if role is invalid
        return role

    # Ensure passwords match
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_confirm = cleaned_data.get("password_confirm")

        # If passwords don't match, add error to the confirm password field
        if password and password_confirm and password != password_confirm:
            self.add_error('password_confirm', "Passwords do not match")

        return cleaned_data
