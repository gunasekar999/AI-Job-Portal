from rest_framework import generics, permissions

from accounts.permissions import IsRecruiter, IsAdmin
from .models import Job
from .permissions import IsJobOwnerOrAdmin
from .serializers import JobSerializer


class JobListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                permissions.IsAuthenticated(),
                IsRecruiter(),
            ]

        return [
            permissions.AllowAny()
        ]

    def get_queryset(self):
        return (
            Job.objects
            .select_related(
                "company",
                "recruiter",
            )
            .filter(
                is_active=True
            )
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save(
            recruiter=self.request.user
        )


class RecruiterJobListView(
    generics.ListAPIView
):
    """
    Returns jobs belonging to the
    authenticated recruiter.
    """

    serializer_class = JobSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return (
            Job.objects
            .select_related(
                "company",
                "recruiter",
            )
            .filter(
                recruiter=self.request.user
            )
            .order_by("-created_at")
        )


class AdminJobListView(
    generics.ListAPIView
):
    """
    Returns all jobs for administrators.
    Includes both active and inactive jobs.
    """

    serializer_class = JobSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsAdmin,
    ]

    def get_queryset(self):
        return (
            Job.objects
            .select_related(
                "company",
                "recruiter",
            )
            .all()
            .order_by("-created_at")
        )


class JobDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = JobSerializer

    def get_queryset(self):
        return (
            Job.objects
            .select_related(
                "company",
                "recruiter",
            )
            .all()
        )

    def get_permissions(self):

        if self.request.method == "GET":
            return [
                permissions.AllowAny()
            ]

        return [
            permissions.IsAuthenticated(),
            IsJobOwnerOrAdmin(),
        ]