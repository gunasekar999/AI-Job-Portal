import re

import fitz
from docx import Document

COMMON_SKILLS = [
    "python",
    "django",
    "flask",
    "fastapi",
    "react",
    "javascript",
    "typescript",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "postgresql",
    "mysql",
    "sqlite",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "git",
    "github",
    "rest api",
    "drf",
    "django rest framework",
    "jwt",
    "linux",
    "oop",
    "data structures",
    "algorithms",
    "numpy",
    "pandas",
    "machine learning",
    "tensorflow",
    "pytorch",
    "openai",
]

def extract_text_from_pdf(file):
    text = ""

    pdf = fitz.open(stream=file.read(), filetype="pdf")

    for page in pdf:
        text += page.get_text()

    pdf.close()

    file.seek(0)

    return text


def extract_text_from_docx(file):
    document = Document(file)

    text = "\n".join(
        paragraph.text for paragraph in document.paragraphs
    )

    file.seek(0)

    return text


def extract_resume_text(file):
    extension = file.name.split(".")[-1].lower()

    if extension == "pdf":
        return extract_text_from_pdf(file)

    if extension == "docx":
        return extract_text_from_docx(file)

    return ""


def extract_skills(text):
    found_skills = []

    lower_text = text.lower()

    for skill in COMMON_SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, lower_text):
            found_skills.append(skill.title())

    return sorted(list(set(found_skills)))


def calculate_resume_score(skills):
    maximum_skills = len(COMMON_SKILLS)

    score = int((len(skills) / maximum_skills) * 100)

    return min(score, 100)


def generate_summary(skills):
    if not skills:
        return (
            "No technical skills could be extracted from the uploaded resume."
        )

    return (
        "Resume contains "
        f"{len(skills)} identified technical skills including: "
        + ", ".join(skills[:10])
        + "."
    )