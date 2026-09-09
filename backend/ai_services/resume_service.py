import json
import os

from docx import Document
from openai import OpenAI
from PyPDF2 import PdfReader


class ResumeAnalysisService:
    """
    Service responsible for extracting resume text
    and generating structured AI resume analysis.
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

    def extract_text(self, resume_file):
        """
        Extract text from PDF or DOCX resume.
        """

        file_name = (
            getattr(
                resume_file,
                "name",
                "",
            )
            .lower()
        )

        if file_name.endswith(".pdf"):
            return self._extract_pdf(
                resume_file
            )

        if file_name.endswith(".docx"):
            return self._extract_docx(
                resume_file
            )

        raise ValueError(
            "Only PDF and DOCX resumes are supported."
        )

    def _extract_pdf(self, resume_file):
        try:
            reader = PdfReader(
                resume_file
            )

            pages = []

            for page in reader.pages:
                page_text = (
                    page.extract_text()
                )

                if page_text:
                    pages.append(
                        page_text
                    )

            text = "\n".join(pages).strip()

            if not text:
                raise ValueError(
                    "Unable to extract text from the PDF resume."
                )

            return text

        except ValueError:
            raise

        except Exception as error:
            raise ValueError(
                "Unable to read the PDF resume."
            ) from error

    def _extract_docx(self, resume_file):
        try:
            document = Document(
                resume_file
            )

            paragraphs = []

            for paragraph in document.paragraphs:
                text = paragraph.text.strip()

                if text:
                    paragraphs.append(
                        text
                    )

            text = "\n".join(
                paragraphs
            ).strip()

            if not text:
                raise ValueError(
                    "Unable to extract text from the DOCX resume."
                )

            return text

        except ValueError:
            raise

        except Exception as error:
            raise ValueError(
                "Unable to read the DOCX resume."
            ) from error

    def analyze_resume(self, resume_text):
        """
        Send extracted resume text to OpenAI
        and return structured analysis.
        """

        if not resume_text:
            raise ValueError(
                "Resume text is empty."
            )

        prompt = f"""
You are a professional AI resume analyst
and career advisor.

Analyze the candidate's resume carefully.

RESUME:
{resume_text}

Return ONLY valid JSON using exactly this structure:

{{
    "ai_score": 0,
    "ai_summary": "",
    "extracted_skills": [],
    "strengths": [],
    "missing_skills": [],
    "improvements": [],
    "interview_questions": []
}}

Rules:

1. ai_score must be an integer from 0 to 100.
2. Evaluate the resume based only on the supplied content.
3. Do not invent skills, experience, education,
   certifications, projects, or achievements.
4. extracted_skills must contain technical and
   professional skills clearly present in the resume.
5. strengths must identify the candidate's strongest
   qualifications based on the resume.
6. missing_skills should contain useful skills that
   appear relevant to improving the candidate's
   employability, but do not claim they are required
   unless the resume or context supports that.
7. improvements should contain practical,
   professional resume improvements.
8. interview_questions should contain 8 to 12
   useful questions based on the candidate's actual
   skills, projects, and experience.
9. Include a mixture of technical, project,
   behavioral, and experience-based questions.
10. Do not invent candidate experience.
11. Keep ai_summary concise and professional.
12. Return questions only in interview_questions.
    Do not provide answers.
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
                        "resume analyst and career advisor. "
                        "Return accurate structured JSON."
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
                    "name": "resume_analysis",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "ai_score": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 100,
                            },
                            "ai_summary": {
                                "type": "string",
                            },
                            "extracted_skills": {
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
                            "missing_skills": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                            },
                            "improvements": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                            },
                            "interview_questions": {
                                "type": "array",
                                "minItems": 8,
                                "maxItems": 12,
                                "items": {
                                    "type": "string",
                                },
                            },
                        },
                        "required": [
                            "ai_score",
                            "ai_summary",
                            "extracted_skills",
                            "strengths",
                            "missing_skills",
                            "improvements",
                            "interview_questions",
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
            result = json.loads(
                content
            )

        except json.JSONDecodeError as error:
            raise ValueError(
                "AI returned invalid JSON."
            ) from error

        return self._validate_result(
            result
        )

    def _validate_result(self, result):
        if not isinstance(
            result,
            dict,
        ):
            raise ValueError(
                "AI resume response must be an object."
            )

        required_fields = [
            "ai_score",
            "ai_summary",
            "extracted_skills",
            "strengths",
            "missing_skills",
            "improvements",
            "interview_questions",
        ]

        for field in required_fields:
            if field not in result:
                raise ValueError(
                    f"AI response missing field: {field}"
                )

        score = int(
            result["ai_score"]
        )

        if score < 0 or score > 100:
            raise ValueError(
                "AI resume score must be between 0 and 100."
            )

        result["ai_score"] = score

        result["ai_summary"] = str(
            result["ai_summary"]
        )

        for field in [
            "extracted_skills",
            "strengths",
            "missing_skills",
            "improvements",
            "interview_questions",
        ]:
            if not isinstance(
                result[field],
                list,
            ):
                raise ValueError(
                    f"AI response field '{field}' must be a list."
                )

            result[field] = [
                str(item).strip()
                for item in result[field]
                if str(item).strip()
            ]

        if not result[
            "interview_questions"
        ]:
            raise ValueError(
                "AI returned no interview questions."
            )

        return result