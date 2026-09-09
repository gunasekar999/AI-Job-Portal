from rest_framework import serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    role = serializers.CharField(
        source="user.role",
        read_only=True,
    )

    class Meta:
        model = Profile

        fields = [
            "id",
            "user",
            "username",
            "email",
            "role",
            "profile_picture",
            "headline",
            "bio",
            "phone",
            "date_of_birth",
            "address",
            "city",
            "state",
            "country",
            "pincode",
            "skills",
            "experience",
            "education",
            "certifications",
            "github",
            "linkedin",
            "portfolio",
            "resume",
            "profile_completion",
            "is_open_to_work",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "username",
            "email",
            "role",
            "profile_completion",
            "created_at",
            "updated_at",
        ]

    def validate_skills(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError(
                "Skills must be provided as a list."
            )

        return value

    def validate_experience(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError(
                "Experience must be provided as a list."
            )

        return value

    def validate_education(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError(
                "Education must be provided as a list."
            )

        return value

    def validate_certifications(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError(
                "Certifications must be provided as a list."
            )

        return value