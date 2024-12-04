from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Professor, Student
import jwt

@api_view(['POST'])
def process_user(request):
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.split(" ")[1] if " " in auth_header else None

    if not token:
        return Response({"error": "No token provided"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        decoded_token = jwt.decode(token, "YOUR_SUPABASE_JWT_SECRET", algorithms=["HS256"])
        user_id = decoded_token.get("sub")
    except jwt.ExpiredSignatureError:
        return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError:
        return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    role = request.data.get("role", "")
    if role == "professor":
        user = Professor.objects.filter(user_id=user_id).first()
    elif role == "student":
        user = Student.objects.filter(user_id=user_id).first()
    else:
        return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"is_approved": user.is_approved}, status=status.HTTP_200_OK)