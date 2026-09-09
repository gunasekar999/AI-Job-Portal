import json
import os

from openai import OpenAI


class InterviewQuestionService:
    """
    AI service responsible for generating
    job-specific interview questions for a candidate.
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

    def generate_questions(
        self,
        candidate_profile,
        job,
    ):
        prompt = f"""
You are an AI interview preparation assistant.

Generate interview questions specifically for this
candidate applying for this job.

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

Return ONLY valid JSON using exactly this structure:

{{
    "questions": []
}}

Rules:

1. Return between 8 and 12 interview questions.
2. Questions must be relevant to this specific job.
3. Consider the candidate's skills, experience,
   education, and certifications.
4. Include a mixture of:
   - technical questions
   - practical/project questions
   - behavioral questions
   - job-specific questions
5. Do not invent candidate experience or skills.
6. Questions should be professional and suitable
   for a real job interview.
7. Avoid duplicate or nearly identical questions.
8. Return questions only. Do not include answers.
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
                        "interview preparation assistant. "
                        "Generate accurate, job-specific "
                        "interview questions."
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
                    "name": "interview_questions",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "questions": {
                                "type": "array",
                                "minItems": 8,
                                "maxItems": 12,
                                "items": {
                                    "type": "string",
                                },
                            },
                        },
                        "required": [
                            "questions",
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
                "AI interview response must be an object."
            )

        questions = result.get(
            "questions"
        )

        if not isinstance(
            questions,
            list,
        ):
            raise ValueError(
                "AI response questions must be a list."
            )

        cleaned_questions = []

        for question in questions:
            question = str(
                question
            ).strip()

            if question:
                cleaned_questions.append(
                    question
                )

        if not cleaned_questions:
            raise ValueError(
                "AI returned no interview questions."
            )

        if len(cleaned_questions) > 12:
            cleaned_questions = (
                cleaned_questions[:12]
            )

        return {
            "questions": cleaned_questions
        }