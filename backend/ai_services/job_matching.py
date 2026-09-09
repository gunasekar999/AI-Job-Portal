from jobs.models import Job


def calculate_match_score(candidate_skills, job):
    score = 0

    job_text = (
        f"{job.title} "
        f"{job.description}"
    ).lower()

    matched_skills = []

    for skill in candidate_skills:
        if skill.lower() in job_text:
            score += 10
            matched_skills.append(skill)

    score = min(score, 100)

    return {
        "score": score,
        "matched_skills": matched_skills,
    }


def get_recommended_jobs(candidate_skills):
    recommendations = []

    jobs = Job.objects.filter(
        is_active=True
    ).select_related("company")

    for job in jobs:
        result = calculate_match_score(
            candidate_skills,
            job,
        )

        if result["score"] > 0:
            recommendations.append(
                {
                    "job_id": job.id,
                    "title": job.title,
                    "company": job.company.company_name,
                    "location": job.location,
                    "score": result["score"],
                    "matched_skills": result["matched_skills"],
                }
            )

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True,
    )

    return recommendations