from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from jobs.models import Job
from profiles.models import Profile

from .interview_service import InterviewQuestionService
from .models import InterviewQuestionResult


class InterviewQuestionView(APIView):
    """
    Generate or retrieve AI interview questions
    for the authenticated candidate and a specific job.
    """

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

        result = (
            InterviewQuestionResult.objects.filter(
                candidate=request.user,
                job=job,
            )
            .first()
        )

        if not result:
            return Response(
                {
                    "detail": (
                        "Interview questions have not "
                        "been generated yet."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "job": {
                    "id": job.id,
                    "title": job.title,
                    "company": (
                        job.company.company_name
                    ),
                    "location": job.location,
                },
                "questions": result.questions,
                "created_at": result.created_at,
                "updated_at": result.updated_at,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        return self._generate_questions(
            request=request,
            force_refresh=False,
        )

    def _generate_questions(
        self,
        request,
        force_refresh=False,
        job_id=None,
    ):
        if job_id is None:
            job_id = request.data.get(
                "job_id"
            )

        if not job_id:
            return Response(
                {
                    "detail": "job_id is required."
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
            InterviewQuestionResult.objects.filter(
                candidate=request.user,
                job=job,
            )
            .first()
        )

        if (
            existing_result
            and not force_refresh
        ):
            return Response(
                {
                    "job": {
                        "id": job.id,
                        "title": job.title,
                        "company": (
                            job.company.company_name
                        ),
                        "location": job.location,
                    },
                    "questions": (
                        existing_result.questions
                    ),
                    "created_at": (
                        existing_result.created_at
                    ),
                    "updated_at": (
                        existing_result.updated_at
                    ),
                },
                status=status.HTTP_200_OK,
            )

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

        candidate_profile = {
            "headline": (
                profile.headline or ""
            ),
            "bio": profile.bio or "",
            "skills": profile.skills or [],
            "experience": (
                profile.experience or []
            ),
            "education": (
                profile.education or []
            ),
            "certifications": (
                profile.certifications or []
            ),
        }

        try:
            service = (
                InterviewQuestionService()
            )

            result = service.generate_questions(
                candidate_profile=(
                    candidate_profile
                ),
                job=job,
            )

            if existing_result:
                existing_result.questions = (
                    result["questions"]
                )

                existing_result.save()

                interview_result = (
                    existing_result
                )

            else:
                interview_result = (
                    InterviewQuestionResult.objects.create(
                        candidate=request.user,
                        job=job,
                        questions=(
                            result["questions"]
                        ),
                    )
                )

            return Response(
                {
                    "job": {
                        "id": job.id,
                        "title": job.title,
                        "company": (
                            job.company.company_name
                        ),
                        "location": job.location,
                    },
                    "questions": (
                        interview_result.questions
                    ),
                    "created_at": (
                        interview_result.created_at
                    ),
                    "updated_at": (
                        interview_result.updated_at
                    ),
                },
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
                "AI INTERVIEW QUESTIONS ERROR:",
                repr(error),
            )

            return Response(
                {
                    "detail": (
                        "Unable to generate AI "
                        "interview questions."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RegenerateInterviewQuestionView(
    InterviewQuestionView
):
    """
    Explicitly generates a fresh set of
    AI interview questions.
    """

    def post(
        self,
        request,
        job_id=None,
    ):
        return self._generate_questions(
            request=request,
            force_refresh=True,
            job_id=job_id,
        )