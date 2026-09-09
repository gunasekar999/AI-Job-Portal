import json
import os

from openai import OpenAI


class JobRecommendationService:
    """
    AI service for recommending the most relevant jobs
    for a candidate.
    """

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY is not configured."
            )

        self.client = OpenAI(
            api_key=api_key
        )

        self.model = "gpt-5.6-luna"

    def recommend_jobs(
        self,
        candidate_profile,
        jobs,
    ):
        job_data = []

        for job in jobs:
            job_data.append(
                {
                    "id": job.id,
                    "title": job.title,
                    "description": job.description,
                    "experience": job.experience,
                    "location": job.location,
                    "job_type": job.job_type,
                }
            )

        prompt = f"""
You are an AI career recommendation assistant.

Your task is to recommend the most suitable jobs
for the candidate.

CANDIDATE PROFILE:
{json.dumps(
    candidate_profile,
    indent=2,
    default=str,
)}

AVAILABLE JOBS:
{json.dumps(
    job_data,
    indent=2,
    default=str,
)}

Evaluate the candidate against each available job.

Consider:

- Skills
- Professional experience
- Education
- Certifications
- Job description
- Required experience
- Job type
- Location

Important rules:

1. Only recommend jobs that exist in AVAILABLE JOBS.
2. job_id must exactly match an available job ID.
3. recommendation_score must be an integer from 0 to 100.
4. Do not invent candidate information.
5. Do not recommend jobs with a score below 40.
6. Return at most 10 recommendations.
7. Sort recommendations from highest score to lowest score.
8. Give a short, professional explanation for every recommendation.
"""

        response = self.client.responses.create(
            model=self.model,
            reasoning={
                "effort": "low",
            },
            input=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional AI career "
                        "recommendation assistant. "
                        "Analyze the candidate and available "
                        "jobs carefully and return only the "
                        "requested structured data."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            text={
                "format": {
                    "type": "json_schema",
                    "name": "job_recommendations",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "recommendations": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "job_id": {
                                            "type": "integer",
                                        },
                                        "recommendation_score": {
                                            "type": "integer",
                                            "minimum": 0,
                                            "maximum": 100,
                                        },
                                        "reason": {
                                            "type": "string",
                                        },
                                    },
                                    "required": [
                                        "job_id",
                                        "recommendation_score",
                                        "reason",
                                    ],
                                    "additionalProperties": False,
                                },
                            },
                        },
                        "required": [
                            "recommendations",
                        ],
                        "additionalProperties": False,
                    },
                },
            },
        )

        content = response.output_text

        print(
           "AI RECOMMENDATION RAW RESPONSE:"
)
        print(
            content
)

        if not content:
            raise ValueError(
                "AI returned an empty response."
            )

        try:
            result = json.loads(content)
        except (json.JSONDecodeError, TypeError) as error:
            raise ValueError(
                "AI returned invalid JSON."
            ) from error

        return self._validate_result(
            result,
            jobs,
        )

    def _validate_result(
        self,
        result,
        jobs,
    ):
        if not isinstance(result, dict):
            raise ValueError(
                "AI response must be an object."
            )

        recommendations = result.get(
            "recommendations"
        )

        if not isinstance(
            recommendations,
            list,
        ):
            raise ValueError(
                "AI response missing recommendations."
            )

        valid_job_ids = {
            job.id
            for job in jobs
        }

        validated = []
        seen_job_ids = set()

        for recommendation in recommendations:

            if not isinstance(
                recommendation,
                dict,
            ):
                continue

            job_id = recommendation.get(
                "job_id"
            )

            score = recommendation.get(
                "recommendation_score"
            )

            reason = recommendation.get(
                "reason"
            )

            # -------------------------------------------------
            # Validate job ID
            # -------------------------------------------------

            if not isinstance(
                job_id,
                int,
            ):
                continue

            if job_id not in valid_job_ids:
                continue

            if job_id in seen_job_ids:
                continue

            # -------------------------------------------------
            # Safely validate recommendation score
            # -------------------------------------------------

            if isinstance(score, bool):
                continue

            if isinstance(score, int):
                numeric_score = score

            elif isinstance(score, float):
                numeric_score = int(score)

            elif isinstance(score, str):
                cleaned_score = score.strip()

                # Handle values such as "85"
                if cleaned_score.isdigit():
                    numeric_score = int(
                        cleaned_score
                    )
                else:
                    continue

            else:
                continue

            if (
                numeric_score < 40
                or numeric_score > 100
            ):
                continue

            # -------------------------------------------------
            # Validate reason
            # -------------------------------------------------

            if not isinstance(
                reason,
                str,
            ):
                continue

            reason = reason.strip()

            if not reason:
                continue

            # -------------------------------------------------
            # Add validated recommendation
            # -------------------------------------------------

            validated.append(
                {
                    "job_id": job_id,
                    "recommendation_score": (
                        numeric_score
                    ),
                    "reason": reason,
                }
            )

            seen_job_ids.add(job_id)

        # -----------------------------------------------------
        # Highest score first
        # -----------------------------------------------------

        validated.sort(
            key=lambda item: item[
                "recommendation_score"
            ],
            reverse=True,
        )

        return {
            "recommendations": validated[:10]
        }