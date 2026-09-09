from .models import User


class AuthService:

    @staticmethod
    def register(validated_data):
        print("Validated Data:", validated_data)
        return User.objects.create_user(**validated_data)