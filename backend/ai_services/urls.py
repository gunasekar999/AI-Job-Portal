from django.urls import path

from .interview_views import (
    InterviewQuestionView,
    RegenerateInterviewQuestionView,
)

from .recommendation_views import (
    JobRecommendationAPIView,
)

from .resume_views import (
    ResumeAnalysisAPIView,
)

from .views import (
    JobMatchAPIView,
    MyJobMatchListView,
    RegenerateJobMatchAPIView,
)


urlpatterns = [
    # AI Job Match

    path(
        "job-match/",
        JobMatchAPIView.as_view(),
        name="job-match",
    ),

    path(
        "job-match/<int:job_id>/",
        JobMatchAPIView.as_view(),
        name="job-match-detail",
    ),

    path(
        "job-match/<int:job_id>/regenerate/",
        RegenerateJobMatchAPIView.as_view(),
        name="job-match-regenerate",
    ),

    # Saved AI Matches

    path(
        "my-matches/",
        MyJobMatchListView.as_view(),
        name="my-job-matches",
    ),

    # AI Job Recommendations

    path(
        "recommendations/",
        JobRecommendationAPIView.as_view(),
        name="job-recommendations",
    ),

    # AI Interview Questions

    path(
        "interview-questions/",
        InterviewQuestionView.as_view(),
        name="interview-questions",
    ),

    path(
        "interview-questions/<int:job_id>/",
        InterviewQuestionView.as_view(),
        name="interview-questions-detail",
    ),

    path(
        "interview-questions/<int:job_id>/regenerate/",
        RegenerateInterviewQuestionView.as_view(),
        name="interview-questions-regenerate",
    ),

    # AI Resume Analysis

    path(
        "resume-score/",
        ResumeAnalysisAPIView.as_view(),
        name="resume-score",
    ),
]