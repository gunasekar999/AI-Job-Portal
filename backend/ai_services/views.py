from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from jobs.models import Job

from .models import JobMatchResult
from .serializers import JobMatchResultSerializer
from .services import JobMatchService


class JobMatchAPIView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(
                id=job_id,
                is_active=True,
            )
        except Job.DoesNotExist:
            return Response(
                {
                    "detail": "Active job not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        match_result = (
            JobMatchResult.objects.filter(
                candidate=request.user,
                job=job,
            ).first()
        )

        if not match_result:
            return Response(
                {
                    "detail": (
                        "AI match has not been "
                        "generated yet."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            JobMatchResultSerializer(
                match_result
            ).data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        return self._generate_match(
            request=request,
            force_refresh=False,
        )

    def _generate_match(
        self,
        request,
        force_refresh=False,
        job_id=None,
    ):
        # If job_id comes from the URL, use it.
        # Otherwise, use job_id from the request body.

        if job_id is None:
            job_id = request.data.get(
                "job_id"
            )

        candidate_profile = request.data.get(
            "candidate_profile"
        )

        if not job_id:
            return Response(
                {
                    "detail": "job_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not candidate_profile:
            return Response(
                {
                    "detail": (
                        "candidate_profile is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            job = Job.objects.get(
                id=job_id,
                is_active=True,
            )
        except Job.DoesNotExist:
            return Response(
                {
                    "detail": "Active job not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        existing_result = (
            JobMatchResult.objects.filter(
                candidate=request.user,
                job=job,
            ).first()
        )

        if (
            existing_result
            and not force_refresh
        ):
            return Response(
                JobMatchResultSerializer(
                    existing_result
                ).data,
                status=status.HTTP_200_OK,
            )

        try:
            service = JobMatchService()

            result = service.calculate_match(
                candidate_profile=candidate_profile,
                job=job,
            )

            if existing_result:
                existing_result.match_score = (
                    result["match_score"]
                )

                existing_result.matching_skills = (
                    result["matching_skills"]
                )

                existing_result.missing_skills = (
                    result["missing_skills"]
                )

                existing_result.strengths = (
                    result["strengths"]
                )

                existing_result.recommendations = (
                    result["recommendations"]
                )

                existing_result.summary = (
                    result["summary"]
                )

                existing_result.save()

                match_result = existing_result

            else:
                match_result = (
                    JobMatchResult.objects.create(
                        candidate=request.user,
                        job=job,
                        match_score=result[
                            "match_score"
                        ],
                        matching_skills=result[
                            "matching_skills"
                        ],
                        missing_skills=result[
                            "missing_skills"
                        ],
                        strengths=result[
                            "strengths"
                        ],
                        recommendations=result[
                            "recommendations"
                        ],
                        summary=result[
                            "summary"
                        ],
                    )
                )

            return Response(
                JobMatchResultSerializer(
                    match_result
                ).data,
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
                "AI MATCH ERROR:",
                repr(error),
            )

            return Response(
                {
                    "detail": (
                        "Unable to generate AI "
                        "match result."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RegenerateJobMatchAPIView(
    JobMatchAPIView
):
    """
    Explicitly generates a fresh AI analysis.

    This endpoint intentionally makes a new
    OpenAI API request.
    """

    def post(
        self,
        request,
        job_id=None,
    ):
        return self._generate_match(
            request=request,
            force_refresh=True,
            job_id=job_id,
        )


class MyJobMatchListView(
    generics.ListAPIView
):
    serializer_class = JobMatchResultSerializer

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_queryset(self):
        return (
            JobMatchResult.objects
            .select_related("job")
            .filter(
                candidate=self.request.user
            )
            .order_by("-updated_at")
        )