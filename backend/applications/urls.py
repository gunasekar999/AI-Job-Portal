from django.urls import path

from .views import (
    ApplicationDetailView,
    ApplicationListCreateView,
    ApplicationStatusUpdateView,
    ApplicationWithdrawView,
    RecruiterApplicationListView,
    AdminApplicationListView,
)


urlpatterns = [
    # Candidate applications
    path(
        "",
        ApplicationListCreateView.as_view(),
        name="application-list-create",
    ),

    # Admin applications
    path(
        "admin/",
        AdminApplicationListView.as_view(),
        name="admin-applications",
    ),

    # Recruiter applications
    path(
        "recruiter/",
        RecruiterApplicationListView.as_view(),
        name="recruiter-applications",
    ),

    # Single application
    path(
        "<int:pk>/",
        ApplicationDetailView.as_view(),
        name="application-detail",
    ),

    # Update application status
    path(
        "<int:pk>/status/",
        ApplicationStatusUpdateView.as_view(),
        name="application-status-update",
    ),

    # Withdraw application
    path(
        "<int:pk>/withdraw/",
        ApplicationWithdrawView.as_view(),
        name="application-withdraw",
    ),
]