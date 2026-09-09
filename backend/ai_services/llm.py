import re

TECH_SKILLS = {
    "Python", "Django", "Django REST Framework", "DRF",
    "React", "React.js", "JavaScript", "TypeScript",
    "HTML", "CSS", "Tailwind CSS", "Bootstrap",
    "PostgreSQL", "MySQL", "SQLite",
    "Git", "GitHub",
    "Docker", "Kubernetes",
    "AWS", "Azure", "GCP",
    "Redis", "Celery",
    "REST API", "JWT",
    "Pandas", "NumPy", "Machine Learning",
    "TensorFlow", "PyTorch",
    "OpenAI", "LangChain", "LLM"
}


INTERVIEW_QUESTIONS = {
    "Python": "Explain Python decorators.",
    "Django": "Explain Django middleware.",
    "React": "How does React reconciliation work?",
    "REST API": "What is REST and why is it stateless?",
    "JWT": "Explain JWT Authentication.",
    "PostgreSQL": "Difference between DELETE, TRUNCATE and DROP.",
    "Git": "Explain Git rebase vs merge.",
    "Docker": "What is Docker and why do we use containers?",
    "AWS": "What AWS services have you used?",
}


def extract_detected_skills(text):
    found = []

    lower_text = text.lower()

    for skill in TECH_SKILLS:
        if skill.lower() in lower_text:
            found.append(skill)

    return sorted(list(set(found)))


def calculate_score(skills):

    score = 40

    score += len(skills) * 4

    if "Python" in skills:
        score += 8

    if "Django" in skills:
        score += 8

    if "React" in skills or "React.js" in skills:
        score += 8

    if "PostgreSQL" in skills:
        score += 6

    if "Git" in skills:
        score += 5

    return min(score, 100)


def generate_summary(skills):

    if not skills:
        return (
            "Resume uploaded successfully. "
            "No major software development skills were detected."
        )

    top = ", ".join(skills[:5])

    return (
        f"Candidate demonstrates knowledge in {top}. "
        f"The resume indicates a software development profile with "
        f"{len(skills)} identified technical skills."
    )


def generate_strengths(skills):

    strengths = []

    mapping = {
        "Python": "Strong Python programming",
        "Django": "Backend development with Django",
        "React": "Frontend development using React",
        "REST API": "REST API development",
        "Git": "Version control using Git",
        "PostgreSQL": "Database design using PostgreSQL",
        "Docker": "Containerization knowledge",
        "AWS": "Cloud platform exposure",
    }

    for skill in skills:
        if skill in mapping:
            strengths.append(mapping[skill])

    return strengths[:5]


def generate_missing_skills(skills):

    recommended = [
        "Docker",
        "AWS",
        "CI/CD",
        "Redis",
        "Celery",
        "Testing",
    ]

    return [x for x in recommended if x not in skills][:5]


def generate_improvements(text):

    improvements = []

    lower = text.lower()

    if "github" not in lower:
        improvements.append("Add GitHub repository links.")

    if "project" not in lower:
        improvements.append("Include personal or academic projects.")

    if "%" not in text:
        improvements.append("Add measurable achievements.")

    if "intern" not in lower and "experience" not in lower:
        improvements.append("Mention internship or practical experience if available.")

    if not improvements:
        improvements.append("Resume is well structured.")

    return improvements[:5]


def generate_questions(skills):

    questions = []

    for skill in skills:
        if skill in INTERVIEW_QUESTIONS:
            questions.append(INTERVIEW_QUESTIONS[skill])

    if not questions:
        questions.append("Tell me about yourself.")

    return questions[:5]


def analyze_resume(text):

    skills = extract_detected_skills(text)

    return {
        "skills": skills,
        "ai_score": calculate_score(skills),
        "ai_summary": generate_summary(skills),
        "strengths": generate_strengths(skills),
        "missing_skills": generate_missing_skills(skills),
        "improvements": generate_improvements(text),
        "interview_questions": generate_questions(skills),
    }