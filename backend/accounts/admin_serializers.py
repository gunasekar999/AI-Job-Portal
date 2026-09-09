from rest_framework import serializers

from .models import User


class AdminUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = (
            "id",
            "email",
            "username",
            "role",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )