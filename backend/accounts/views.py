from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import RegisterSerializer, UserSerializer
from .jwt_serializers import LoginSerializer
from .logout_serializer import LogoutSerializer
from .admin_serializers import AdminUserSerializer

from .permissions import IsRecruiter, IsAdmin

from companies.models import Company
from jobs.models import Job
from applications.models import Application


class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()

    serializer_class = RegisterSerializer


class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        return Response(
            serializer.validated_data
        )


class CurrentUserView(generics.RetrieveAPIView):

    serializer_class = UserSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(self):

        return self.request.user


class LogoutView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        serializer = LogoutSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message":
                    "Logged out successfully."
            }
        )


class RecruiterDashboardView(APIView):

    permission_classes = [
        IsRecruiter
    ]

    def get(self, request):

        return Response(
            {
                "message":
                    "Welcome Recruiter"
            }
        )


class AdminDashboardStatsView(APIView):

    permission_classes = [
        IsAdmin
    ]

    def get(self, request):

        total_users = User.objects.count()

        total_candidates = User.objects.filter(
            role=User.Role.CANDIDATE
        ).count()

        total_recruiters = User.objects.filter(
            role=User.Role.RECRUITER
        ).count()

        total_companies = Company.objects.count()

        total_jobs = Job.objects.count()

        active_jobs = Job.objects.filter(
            is_active=True
        ).count()

        total_applications = (
            Application.objects.count()
        )

        return Response(
            {
                "users": total_users,
                "candidates": total_candidates,
                "recruiters": total_recruiters,
                "companies": total_companies,
                "jobs": total_jobs,
                "active_jobs": active_jobs,
                "applications":
                    total_applications,
            }
        )


class AdminUserListView(
    generics.ListAPIView
):

    serializer_class = AdminUserSerializer

    permission_classes = [
        IsAdmin
    ]

    def get_queryset(self):

        return (
            User.objects
            .all()
            .order_by("-created_at")
        )


class AdminUserUpdateView(
    generics.UpdateAPIView
):

    serializer_class = AdminUserSerializer

    permission_classes = [
        IsAdmin
    ]

    http_method_names = [
        "patch"
    ]

    def get_queryset(self):

        return User.objects.all()

    def update(
        self,
        request,
        *args,
        **kwargs
    ):

        user = self.get_object()

        if (
            user.is_superuser
            and user != request.user
        ):
            return Response(
                {
                    "detail":
                        "The main administrator cannot be modified."
                },
                status=403,
            )

        allowed_fields = {
            "is_active"
        }

        submitted_fields = set(
            request.data.keys()
        )

        invalid_fields = (
            submitted_fields
            - allowed_fields
        )

        if invalid_fields:

            return Response(
                {
                    "detail":
                        "Only the is_active field "
                        "can be updated."
                },
                status=400,
            )

        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data,
            status=200,
        )