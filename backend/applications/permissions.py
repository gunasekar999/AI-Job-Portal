from rest_framework.permissions import BasePermission


class IsCandidate(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "candidate"
        )


class IsRecruiterOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.role == "recruiter"
                or request.user.role == "admin"
                or request.user.is_superuser
            )
        )


class IsApplicationOwnerOrRecruiterOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if (
            request.user.role == "admin"
            or request.user.is_superuser
        ):
            return True

        if obj.candidate == request.user:
            return True

        if (
            request.user.role == "recruiter"
            and obj.job.recruiter == request.user
        ):
            return True

        return False