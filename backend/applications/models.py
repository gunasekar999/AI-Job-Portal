from django.conf import settings
from django.db import models

from common.models import TimeStampedModel
from jobs.models import Job


class Application(TimeStampedModel):
    class Status(models.TextChoices):
        APPLIED = "applied", "Applied"
        REVIEWING = "reviewing", "Reviewing"
        SHORTLISTED = "shortlisted", "Shortlisted"
        INTERVIEW = "interview", "Interview"
        SELECTED = "selected", "Selected"
        REJECTED = "rejected", "Rejected"

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    cover_letter = models.TextField(blank=True)

    resume = models.FileField(
        upload_to="resumes/",
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED,
    )

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("job", "candidate")

    def __str__(self):
        return f"{self.candidate.username} - {self.job.title}"