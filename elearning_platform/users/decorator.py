from django.http import HttpResponseForbidden

def role_required(required_role):
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            if request.user.role != required_role:
                return HttpResponseForbidden("You do not have access to this page.")
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator
