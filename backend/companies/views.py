from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS

from accounts.permissions import IsRecruiter

from .models import Company
from .permissions import IsCompanyOwnerOrAdmin
from .serializers import CompanySerializer


class CompanyListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = CompanySerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsAuthenticated(),
                IsRecruiter(),
            ]

        return []

    def get_queryset(self):
        return (
            Company.objects
            .select_related("created_by")
            .all()
            .order_by("company_name")
        )

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user
        )


class CompanyDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Company.objects.all()

    serializer_class = CompanySerializer

    def get_permissions(self):

        if self.request.method in SAFE_METHODS:
            return []

        return [
            IsAuthenticated(),
            IsCompanyOwnerOrAdmin(),
        ]

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()


class MyCompanyListView(
    generics.ListAPIView
):
    """
    Returns companies created by
    the currently authenticated recruiter.
    """

    serializer_class = CompanySerializer

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return (
            Company.objects
            .select_related("created_by")
            .filter(
                created_by=self.request.user
            )
            .order_by("company_name")
        )