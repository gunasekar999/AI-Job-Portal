from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from jobs.models import Job
from profiles.models import Profile 

from .models import JobRecommendation
from .recommendation_service import JobRecommendationService


class JobRecommendationAPIView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request):
        try:
            profile = Profile.objects.get(
                user=request.user
            )
        except Profile.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "Candidate profile not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        jobs = list(
            Job.objects
            .filter(is_active=True)
            .select_related("company")
            .order_by("-created_at")[:50]
        )

        if not jobs:
            return Response(
                {
                    "recommendations": []
                },
                status=status.HTTP_200_OK,
            )

        candidate_profile = {
            "headline": profile.headline or "",
            "bio": profile.bio or "",
            "skills": profile.skills or [],
            "experience": profile.experience or [],
            "education": profile.education or [],
            "certifications": (
                profile.certifications or []
            ),
        }

        try:
            service = JobRecommendationService()

            result = service.recommend_jobs(
                candidate_profile=candidate_profile,
                jobs=jobs,
            )

            JobRecommendation.objects.filter(
                candidate=request.user
            ).delete()

            recommendations = []

            job_map = {
                job.id: job
                for job in jobs
            }

            for item in result[
                "recommendations"
            ]:
                job = job_map.get(
                    item["job_id"]
                )

                if not job:
                    continue

                recommendation = (
                    JobRecommendation.objects.create(
                        candidate=request.user,
                        job=job,
                        recommendation_score=(
                            item[
                                "recommendation_score"
                            ]
                        ),
                        reason=item["reason"],
                    )
                )

                recommendations.append(
                    recommendation
                )

            return Response(
                self._serialize(
                    recommendations
                ),
                status=status.HTTP_200_OK,
            )

        except ValueError as error:
            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        except Exception as error:
            print(
                "AI RECOMMENDATION ERROR:",
                repr(error),
            )

            return Response(
                {
                    "detail": (
                        "Unable to generate "
                        "AI recommendations."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def _serialize(
        self,
        recommendations,
    ):
        return [
            {
                "id": recommendation.id,
                "job_id": recommendation.job.id,
                "job_title": recommendation.job.title,
                "company_name": (
                    recommendation.job.company.company_name
                ),
                "recommendation_score": (
                    recommendation.recommendation_score
                ),
                "reason": recommendation.reason,
                "created_at": (
                    recommendation.created_at
                ),
            }
            for recommendation in recommendations
        ]