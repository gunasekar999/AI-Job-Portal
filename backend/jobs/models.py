from django.db import models

from accounts.models import User
from common.models import TimeStampedModel
from companies.models import Company


class Job(TimeStampedModel):

    class JobType(models.TextChoices):
        FULL_TIME = "Full Time", "Full Time"
        PART_TIME = "Part Time", "Part Time"
        INTERNSHIP = "Internship", "Internship"
        REMOTE = "Remote", "Remote"

    class Experience(models.TextChoices):
        FRESHER = "Fresher", "Fresher"
        JUNIOR = "1-2 Years", "1-2 Years"
        MID = "3-5 Years", "3-5 Years"
        SENIOR = "5+ Years", "5+ Years"

    title = models.CharField(
        max_length=255
    )

    description = models.TextField()

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="posted_jobs"
    )

    location = models.CharField(
        max_length=255
    )

    salary = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices
    )

    experience = models.CharField(
        max_length=20,
        choices=Experience.choices
    )

    deadline = models.DateField()

    is_active = models.BooleanField(
        default=True
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Job"
        verbose_name_plural = "Jobs"

    def __str__(self):
        return f"{self.title} - {self.company.company_name}"