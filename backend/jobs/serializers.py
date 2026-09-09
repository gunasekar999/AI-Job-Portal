from rest_framework import serializers

from .models import Job

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source="company.company_name",
        read_only=True
    )

    recruiter_name = serializers.CharField(
        source="recruiter.username",
        read_only=True
    )

    class Meta:
        model = Job

        fields = [
            "id",
            "title",
            "description",
            "company",
            "company_name",
            "recruiter",
            "recruiter_name",
            "location",
            "salary",
            "job_type",
            "experience",
            "deadline",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "recruiter",
            "recruiter_name",
            "company_name",
            "created_at",
            "updated_at",
        ]

    def validate_company(self, company):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError(
                "Authentication is required."
            )

        if request.user.is_superuser:
            return company

        if company.created_by != request.user:
            raise serializers.ValidationError(
                "You can only create jobs for your own company."
            )

        return company

    def create(self, validated_data):
        request = self.context["request"]

        validated_data["recruiter"] = request.user

        return super().create(validated_data)