from django.urls import path

from .views import (
    CompanyListCreateView,
    CompanyDetailView,
    MyCompanyListView,
)


urlpatterns = [
    path(
        "",
        CompanyListCreateView.as_view(),
        name="company-list-create",
    ),

    path(
        "my/",
        MyCompanyListView.as_view(),
        name="my-companies",
    ),

    path(
        "<int:pk>/",
        CompanyDetailView.as_view(),
        name="company-detail",
    ),
]