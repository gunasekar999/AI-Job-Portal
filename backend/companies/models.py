from django.db import models

from common.models import TimeStampedModel
from accounts.models import User

class Company(TimeStampedModel):

    company_name = models.CharField(
        max_length=255,
        unique=True
    )

    description = models.TextField()

    website = models.URLField(
        blank=True
    )

    location = models.CharField(
        max_length=255
    )

    logo = models.ImageField(
        upload_to="company_logos/",
        blank=True,
        null=True
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="companies"
    )

    def __str__(self):
        return self.company_name