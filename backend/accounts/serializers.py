from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User
        fields = (
            "email",
            "username",
            "password",
            "role",
        )

    def create(self, validated_data):
        from .services import AuthService
        return AuthService.register(validated_data)

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "role",
            "created_at",
        )
