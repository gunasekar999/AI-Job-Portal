from django.urls import path

from .views import (
    JobListCreateView,
    JobDetailView,
    RecruiterJobListView,
    AdminJobListView,
)


urlpatterns = [
    # Public jobs
    path(
        "",
        JobListCreateView.as_view(),
        name="job-list-create",
    ),

    # Admin jobs
    path(
        "admin/",
        AdminJobListView.as_view(),
        name="admin-job-list",
    ),

    # Recruiter's own jobs
    path(
        "recruiter/",
        RecruiterJobListView.as_view(),
        name="recruiter-job-list",
    ),

    # Single job
    path(
        "<int:pk>/",
        JobDetailView.as_view(),
        name="job-detail",
    ),
]