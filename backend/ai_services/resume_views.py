from rest_framework import permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ResumeAnalysis
from .resume_service import ResumeAnalysisService


class ResumeAnalysisAPIView(APIView):
    """
    Upload a resume and generate an AI-powered
    resume analysis for the authenticated candidate.

    GET:
        Retrieve the candidate's latest saved
        resume analysis.

    POST:
        Upload a resume and generate a new
        AI-powered resume analysis.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get(self, request):
        """
        Return the authenticated candidate's
        previously saved resume analysis.

        Does NOT call OpenAI.
        """

        analysis = (
            ResumeAnalysis.objects
            .filter(
                candidate=request.user
            )
            .first()
        )

        if not analysis:
            return Response(
                {
                    "detail": (
                        "No resume analysis found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            self._serialize_analysis(
                analysis
            ),
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        resume_file = request.FILES.get(
            "resume"
        )

        if not resume_file:
            return Response(
                {
                    "detail": (
                        "Resume file is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        file_name = (
            resume_file.name or ""
        ).lower()

        if not (
            file_name.endswith(".pdf")
            or file_name.endswith(".docx")
        ):
            return Response(
                {
                    "detail": (
                        "Only PDF and DOCX resumes "
                        "are supported."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            service = ResumeAnalysisService()

            resume_text = service.extract_text(
                resume_file
            )

            result = service.analyze_resume(
                resume_text
            )

            analysis, created = (
                ResumeAnalysis.objects.update_or_create(
                    candidate=request.user,
                    defaults={
                        "resume_name": (
                            resume_file.name
                        ),

                        "resume_file": (
                            resume_file
                        ),

                        "resume_text": (
                            resume_text
                        ),

                        "ai_score": (
                            result["ai_score"]
                        ),

                        "ai_summary": (
                            result["ai_summary"]
                        ),

                        "extracted_skills": (
                            result[
                                "extracted_skills"
                            ]
                        ),

                        "strengths": (
                            result["strengths"]
                        ),

                        "missing_skills": (
                            result[
                                "missing_skills"
                            ]
                        ),

                        "improvements": (
                            result["improvements"]
                        ),

                        "interview_questions": (
                            result[
                                "interview_questions"
                            ]
                        ),
                    },
                )
            )

            return Response(
                self._serialize_analysis(
                    analysis
                ),
                status=status.HTTP_200_OK,
            )

        except ValueError as error:
            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as error:
            print(
                "AI RESUME ANALYSIS ERROR:",
                repr(error),
            )

            return Response(
                {
                    "detail": (
                        "Unable to analyze the "
                        "resume."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def _serialize_analysis(
        self,
        analysis,
    ):
        return {
            "id": analysis.id,

            "resume_name": (
                analysis.resume_name
            ),

            "resume_file": (
                analysis.resume_file.url
                if analysis.resume_file
                else None
            ),

            "ai_score": (
                analysis.ai_score
            ),

            "ai_summary": (
                analysis.ai_summary
            ),

            "extracted_skills": (
                analysis.extracted_skills
            ),

            "strengths": (
                analysis.strengths
            ),

            "missing_skills": (
                analysis.missing_skills
            ),

            "improvements": (
                analysis.improvements
            ),

            "interview_questions": (
                analysis.interview_questions
            ),

            "created_at": (
                analysis.created_at
            ),

            "updated_at": (
                analysis.updated_at
            ),
        }