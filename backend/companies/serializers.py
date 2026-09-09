from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source="created_by.email")

    class Meta:
        model = Company
        fields = "__all__"