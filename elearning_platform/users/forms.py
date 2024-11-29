from django import forms
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

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

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'role', 'password']

    def clean_password(self):
        password = self.cleaned_data.get("password")
        validate_password(password)  # Ensures password meets Django's security standards
        return password

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_confirm = cleaned_data.get("password_confirm")

        if password and password_confirm and password != password_confirm:
            self.add_error('password_confirm', "Passwords do not match")

        return cleaned_data
