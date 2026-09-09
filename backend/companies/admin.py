from django.contrib import admin

from .models import Company

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "company_name",
        "location",
        "created_by",
        "created_at",
    )

    search_fields = (
        "company_name",
    )

    list_filter = (
        "location",
    )