from django.http import HttpResponseForbidden
from functools import wraps

# Decorator to check if a user has the required role
def role_required(required_role):
    # The actual decorator that wraps the view function
    
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # Retrieve the user's role from the request object
            # If the role is not found, default to None
            user_role = getattr(request.user, 'role', None)
            
            # If the user role doesn't match the required role, return a Forbidden response
            if user_role != required_role:
                return HttpResponseForbidden("You do not have access to this page.")
            
            # If the user has the required role, proceed to the original view
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    # Return the decorator function
    return decorator
