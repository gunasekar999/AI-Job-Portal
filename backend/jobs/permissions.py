from rest_framework.permissions import BasePermission


class IsJobOwnerOrAdmin(BasePermission):
    """
    Allows:
    - Superusers
    - Users with the admin role
    - The recruiter who posted the job

    Other users cannot modify the job.
    """

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if not request.user.is_authenticated:
            return False

        if (
            request.user.is_superuser
            or request.user.role == "admin"
        ):
            return True

        return obj.recruiter == request.user