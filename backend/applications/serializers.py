from django.core.files import File
from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(
        source="candidate.username",
        read_only=True,
    )

    candidate_email = serializers.EmailField(
        source="candidate.email",
        read_only=True,
    )

    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )

    company_name = serializers.CharField(
        source="job.company.company_name",
        read_only=True,
    )

    class Meta:
        model = Application

        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "candidate",
            "candidate_name",
            "candidate_email",
            "cover_letter",
            "resume",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "candidate",
            "candidate_name",
            "candidate_email",
            "job_title",
            "company_name",
            "status",
            "resume",
            "created_at",
            "updated_at",
        ]

    def validate_job(self, job):
        request = self.context.get("request")

        if (
            not request
            or not request.user.is_authenticated
        ):
            raise serializers.ValidationError(
                "Authentication is required."
            )

        if not job.is_active:
            raise serializers.ValidationError(
                "This job is no longer accepting applications."
            )

        if Application.objects.filter(
            job=job,
            candidate=request.user,
        ).exists():
            raise serializers.ValidationError(
                "You have already applied for this job."
            )

        return job

    def create(self, validated_data):
        request = self.context["request"]

        candidate = request.user

        validated_data["candidate"] = candidate

        resume_analysis = getattr(
            candidate,
            "resume_analysis",
            None,
        )

        if (
            resume_analysis
            and resume_analysis.resume_file
        ):
            resume_analysis.resume_file.open(
                "rb"
            )

            try:
                validated_data["resume"] = File(
                    resume_analysis.resume_file.file,
                    name=resume_analysis.resume_name,
                )

                application = super().create(
                    validated_data
                )

            finally:
                resume_analysis.resume_file.close()

            return application

        return super().create(
            validated_data
        )