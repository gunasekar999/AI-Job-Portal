from rest_framework import generics, permissions
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .models import Profile
from .serializers import ProfileSerializer


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(
            user=self.request.user
        )

        return profile

    def perform_update(self, serializer):
        profile = serializer.save()

        profile.profile_completion = self.calculate_completion(
            profile
        )

        profile.save(
            update_fields=["profile_completion"]
        )

    def calculate_completion(self, profile):
        fields = [
            profile.profile_picture,
            profile.headline,
            profile.bio,
            profile.phone,
            profile.city,
            profile.state,
            profile.country,
            profile.skills,
            profile.experience,
            profile.education,
            profile.certifications,
            profile.github,
            profile.linkedin,
            profile.portfolio,
            profile.resume,
        ]

        completed = 0

        for field in fields:
            if field:
                completed += 1

        return int(
            (completed / len(fields)) * 100
        )