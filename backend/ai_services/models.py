from django.conf import settings
from django.db import models

from jobs.models import Job


class JobMatchResult(models.Model):
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_match_results",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="match_results",
    )

    match_score = models.PositiveSmallIntegerField()

    matching_skills = models.JSONField(
        default=list,
        blank=True,
    )

    missing_skills = models.JSONField(
        default=list,
        blank=True,
    )

    strengths = models.JSONField(
        default=list,
        blank=True,
    )

    recommendations = models.JSONField(
        default=list,
        blank=True,
    )

    summary = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "candidate",
                    "job",
                ],
                name="unique_candidate_job_match",
            )
        ]

        ordering = ["-updated_at"]

    def __str__(self):
        return (
            f"{self.candidate.username} - "
            f"{self.job.title} - "
            f"{self.match_score}%"
        )


class JobRecommendation(models.Model):
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_recommendations",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="ai_recommendations",
    )

    recommendation_score = (
        models.PositiveSmallIntegerField()
    )

    reason = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = [
            "-recommendation_score",
            "-created_at",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "candidate",
                    "job",
                ],
                name="unique_candidate_job_recommendation",
            )
        ]

    def __str__(self):
        return (
            f"{self.candidate.username} - "
            f"{self.job.title} - "
            f"{self.recommendation_score}%"
        )


class InterviewQuestionResult(models.Model):
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="interview_question_results",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="interview_question_results",
    )

    questions = models.JSONField(
        default=list,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-updated_at"]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "candidate",
                    "job",
                ],
                name="unique_candidate_job_interview_questions",
            )
        ]

    def __str__(self):
        return (
            f"{self.candidate.username} - "
            f"{self.job.title} - "
            "Interview Questions"
        )


class ResumeAnalysis(models.Model):
    candidate = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resume_analysis",
    )

    resume_name = models.CharField(
        max_length=255,
        blank=True,
    )

    resume_file = models.FileField(
        upload_to="resumes/",
        blank=True,
        null=True,
    )

    resume_text = models.TextField(
        blank=True,
    )

    ai_score = models.PositiveSmallIntegerField(
        default=0,
    )

    ai_summary = models.TextField(
        blank=True,
    )

    extracted_skills = models.JSONField(
        default=list,
        blank=True,
    )

    strengths = models.JSONField(
        default=list,
        blank=True,
    )

    missing_skills = models.JSONField(
        default=list,
        blank=True,
    )

    improvements = models.JSONField(
        default=list,
        blank=True,
    )

    interview_questions = models.JSONField(
        default=list,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return (
            f"{self.candidate.username} - "
            "Resume Analysis"
        )