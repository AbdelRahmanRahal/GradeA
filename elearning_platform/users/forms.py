from django import forms
from django.contrib.auth.password_validation import validate_password  

# User Registration Form definition
class UserRegistrationForm(forms.ModelForm):
    # Define password field with custom widget for password input
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Enter password'}),  # Custom placeholder for password input
        label="Password",  # Label for the password field
        help_text="Your password must be at least 8 characters long.",  # Help text shown to the user
    )
    
    # Define password confirmation field
    password_confirm = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm password'}),  # Custom placeholder for confirming password
        label="Confirm Password",  # Label for the password confirmation field
    )

    class Meta:
        model = CustomUser  # Specify that the form uses the CustomUser model
        fields = ['username', 'email', 'role', 'password']  # Fields to be included in the form

    # Custom method to validate the password field
    def clean_password(self):
        password = self.cleaned_data.get("password")  # Get the password from cleaned data
        validate_password(password)  # Django’s built-in function to validate password strength
        return password  # Return the validated password

    # Custom clean method to validate password confirmation matches the original password
    def clean(self):
        cleaned_data = super().clean()  # Call parent clean method to get the cleaned data
        password = cleaned_data.get("password")  # Get the password field
        password_confirm = cleaned_data.get("password_confirm")  # Get the confirm password field

        # Check if both password and password_confirm match
        if password and password_confirm and password != password_confirm:
            self.add_error('password_confirm', "Passwords do not match")  # Add error if passwords don't match

        return cleaned_data  # Return cleaned data to be used in form
