from rest_framework.permissions import BasePermission


class IsCompanyOwnerOrAdmin(
    BasePermission
):
    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if not request.user.is_authenticated:
            return False

        if (
            request.user.role == "admin"
            or request.user.is_superuser
        ):
            return True

        return obj.created_by == request.user