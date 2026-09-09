from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginView,
    LogoutView,
    RegisterView,
    CurrentUserView,
    RecruiterDashboardView,
    AdminDashboardStatsView,
    AdminUserListView,
    AdminUserUpdateView,
)


urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "me/",
        CurrentUserView.as_view(),
        name="current_user",
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),

    path(
        "recruiter-dashboard/",
        RecruiterDashboardView.as_view(),
    ),

    path(
        "admin-dashboard-stats/",
        AdminDashboardStatsView.as_view(),
        name="admin_dashboard_stats",
    ),

    path(
        "admin/users/",
        AdminUserListView.as_view(),
        name="admin_users",
    ),

    path(
        "admin/users/<int:pk>/",
        AdminUserUpdateView.as_view(),
        name="admin_user_update",
    ),
]