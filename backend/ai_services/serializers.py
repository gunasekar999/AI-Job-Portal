from rest_framework import serializers

from .models import JobMatchResult


class JobMatchResultSerializer(
    serializers.ModelSerializer
):
    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )

    class Meta:
        model = JobMatchResult

        fields = [
            "id",
            "job",
            "job_title",
            "match_score",
            "matching_skills",
            "missing_skills",
            "strengths",
            "recommendations",
            "summary",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "job_title",
            "match_score",
            "matching_skills",
            "missing_skills",
            "strengths",
            "recommendations",
            "summary",
            "created_at",
            "updated_at",
        ]