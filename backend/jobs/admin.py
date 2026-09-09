from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "company",
        "recruiter",
        "job_type",
        "experience",
        "location",
        "salary",
        "deadline",
        "is_active",
        "created_at",
    )

    list_filter = (
        "job_type",
        "experience",
        "is_active",
        "company",
    )

    search_fields = (
        "title",
        "company__company_name",
        "location",
        "recruiter__username",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = ("-created_at",)

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "company",
                    "recruiter",
                    "title",
                    "description",
                )
            },
        ),
        (
            "Job Details",
            {
                "fields": (
                    "location",
                    "job_type",
                    "experience",
                    "salary",
                    "deadline",
                    "is_active",
                )
            },
        ),
        (
            "Audit",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )