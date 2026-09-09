from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from accounts.permissions import IsAdmin

from .models import Application
from .permissions import (
    IsCandidate,
    IsRecruiterOrAdmin,
)
from .serializers import ApplicationSerializer


class ApplicationListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = ApplicationSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    permission_classes = [
        IsCandidate,
    ]

    def get_queryset(self):
        return (
            Application.objects
            .select_related(
                "job",
                "job__company",
                "candidate",
            )
            .filter(
                candidate=self.request.user
            )
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save(
            candidate=self.request.user
        )


class ApplicationDetailView(
    generics.RetrieveAPIView
):
    serializer_class = ApplicationSerializer

    permission_classes = [
        IsCandidate,
    ]

    def get_queryset(self):
        return (
            Application.objects
            .select_related(
                "job",
                "job__company",
                "candidate",
            )
            .filter(
                candidate=self.request.user
            )
        )


class ApplicationWithdrawView(
    generics.DestroyAPIView
):
    serializer_class = ApplicationSerializer

    permission_classes = [
        IsCandidate,
    ]

    def get_queryset(self):
        return (
            Application.objects
            .select_related(
                "job",
                "job__company",
                "candidate",
            )
            .filter(
                candidate=self.request.user
            )
        )

    def destroy(
        self,
        request,
        *args,
        **kwargs,
    ):
        application = self.get_object()

        application.delete()

        return Response(
            {
                "detail":
                    "Application withdrawn successfully."
            },
            status=status.HTTP_200_OK,
        )


class RecruiterApplicationListView(
    generics.ListAPIView
):
    serializer_class = ApplicationSerializer

    permission_classes = [
        IsRecruiterOrAdmin,
    ]

    def get_queryset(self):

        user = self.request.user

        queryset = (
            Application.objects
            .select_related(
                "job",
                "job__company",
                "job__recruiter",
                "candidate",
            )
            .order_by("-created_at")
        )

        if (
            user.role == "admin"
            or user.is_superuser
        ):
            return queryset

        return queryset.filter(
            job__recruiter=user
        )


class AdminApplicationListView(
    generics.ListAPIView
):
    """
    Returns all applications for administrators.
    """

    serializer_class = ApplicationSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsAdmin,
    ]

    def get_queryset(self):
        return (
            Application.objects
            .select_related(
                "job",
                "job__company",
                "job__recruiter",
                "candidate",
            )
            .all()
            .order_by("-created_at")
        )


class ApplicationStatusUpdateView(
    generics.UpdateAPIView
):
    serializer_class = ApplicationSerializer

    permission_classes = [
        IsRecruiterOrAdmin,
    ]

    http_method_names = [
        "patch",
    ]

    def get_queryset(self):

        user = self.request.user

        queryset = (
            Application.objects
            .select_related(
                "job",
                "job__company",
                "job__recruiter",
                "candidate",
            )
            .all()
        )

        # Admin can update any application.
        if (
            user.role == "admin"
            or user.is_superuser
        ):
            return queryset

        # Recruiter can update applications
        # belonging only to their own jobs.
        return queryset.filter(
            job__recruiter=user
        )

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):
        application = self.get_object()

        new_status = request.data.get(
            "status"
        )

        if not new_status:
            return Response(
                {
                    "status": [
                        "This field is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        valid_statuses = {
            choice[0]
            for choice in Application.Status.choices
        }

        if new_status not in valid_statuses:
            return Response(
                {
                    "status": [
                        (
                            "Invalid application status. "
                            "Choose one of: "
                            f"{', '.join(valid_statuses)}."
                        )
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        application.status = new_status

        application.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        serializer = self.get_serializer(
            application
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )