from django.conf import settings
from django.db import models

from common.models import TimeStampedModel


class Profile(TimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True,
    )

    headline = models.CharField(
        max_length=255,
        blank=True,
    )

    bio = models.TextField(
        blank=True,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True,
    )

    address = models.CharField(
        max_length=255,
        blank=True,
    )

    city = models.CharField(
        max_length=100,
        blank=True,
    )

    state = models.CharField(
        max_length=100,
        blank=True,
    )

    country = models.CharField(
        max_length=100,
        blank=True,
    )

    pincode = models.CharField(
        max_length=20,
        blank=True,
    )

    skills = models.JSONField(
        default=list,
        blank=True,
    )

    experience = models.JSONField(
        default=list,
        blank=True,
    )

    education = models.JSONField(
        default=list,
        blank=True,
    )

    certifications = models.JSONField(
        default=list,
        blank=True,
    )

    github = models.URLField(
        blank=True,
    )

    linkedin = models.URLField(
        blank=True,
    )

    portfolio = models.URLField(
        blank=True,
    )

    resume = models.FileField(
        upload_to="candidate_resumes/",
        blank=True,
        null=True,
    )

    profile_completion = models.PositiveIntegerField(
        default=0,
    )

    is_open_to_work = models.BooleanField(
        default=True,
    )

    def __str__(self):
        return self.user.username