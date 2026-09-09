import json
import os

from openai import OpenAI


class JobMatchService:
    """
    AI service for matching a candidate profile
    with a specific job.
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

    def calculate_match(
        self,
        candidate_profile,
        job,
    ):
        prompt = f"""
You are an AI recruitment matching assistant.

Analyze how well the candidate matches the specific job.

CANDIDATE PROFILE:
{json.dumps(
    candidate_profile,
    indent=2,
    default=str,
)}

JOB:
Title: {job.title}
Description: {job.description}
Experience Required: {job.experience}
Location: {job.location}
Job Type: {job.job_type}

Return ONLY structured JSON with these fields:

{{
    "match_score": 0,
    "matching_skills": [],
    "missing_skills": [],
    "strengths": [],
    "recommendations": [],
    "summary": ""
}}

Rules:

1. match_score must be an integer from 0 to 100.
2. matching_skills must contain skills supported by both
   the candidate profile and the job requirements.
3. missing_skills must contain important job skills that
   are not present in the candidate profile.
4. strengths must contain the candidate's strongest
   qualifications for this specific job.
5. recommendations must contain practical suggestions
   that could improve the candidate's suitability.
6. summary must be concise and professional.
7. Do not invent candidate skills, experience, education,
   or certifications.
8. Base the analysis only on the supplied information.
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
                        "You are a professional AI "
                        "recruitment matching assistant. "
                        "Analyze the supplied candidate and "
                        "job information accurately."
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
                    "name": "job_match_result",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "match_score": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 100,
                            },
                            "matching_skills": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                            },
                            "missing_skills": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                            },
                            "strengths": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                            },
                            "recommendations": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                            },
                            "summary": {
                                "type": "string",
                            },
                        },
                        "required": [
                            "match_score",
                            "matching_skills",
                            "missing_skills",
                            "strengths",
                            "recommendations",
                            "summary",
                        ],
                        "additionalProperties": False,
                    },
                },
            },
        )

        content = response.output_text

        if not content:
            raise ValueError(
                "AI returned an empty response."
            )

        try:
            result = json.loads(content)
        except json.JSONDecodeError as error:
            raise ValueError(
                "AI returned invalid JSON."
            ) from error

        return self._validate_result(result)

    def _validate_result(self, result):
        if not isinstance(result, dict):
            raise ValueError(
                "AI match response must be an object."
            )

        required_fields = [
            "match_score",
            "matching_skills",
            "missing_skills",
            "strengths",
            "recommendations",
            "summary",
        ]

        for field in required_fields:
            if field not in result:
                raise ValueError(
                    f"AI response missing field: {field}"
                )

        score = result["match_score"]

        if not isinstance(score, int):
            raise ValueError(
                "AI match score must be an integer."
            )

        if score < 0 or score > 100:
            raise ValueError(
                "AI match score must be between 0 and 100."
            )

        list_fields = [
            "matching_skills",
            "missing_skills",
            "strengths",
            "recommendations",
        ]

        for field in list_fields:
            if not isinstance(
                result[field],
                list,
            ):
                raise ValueError(
                    f"AI response field '{field}' "
                    "must be a list."
                )

            result[field] = [
                str(item).strip()
                for item in result[field]
                if str(item).strip()
            ]

        result["summary"] = str(
            result["summary"]
        ).strip()

        return result