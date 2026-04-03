import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class GoalRequest(BaseModel):
    goal: str

class MilestoneStatus(BaseModel):
    completed: bool

completion_state = {}
my_paths = []

TRUSTED_RESOURCES = """
ONLY use URLs from these exact trusted sources (use real, existing pages):

DOCUMENTATION & REFERENCES:
- MDN Web Docs: https://developer.mozilla.org/en-US/docs/
- W3Schools: https://www.w3schools.com/
- DevDocs: https://devdocs.io/

FREE COURSES & LEARNING PLATFORMS:
- freeCodeCamp: https://www.freecodecamp.org/learn/
- The Odin Project: https://www.theodinproject.com/paths
- roadmap.sh: https://roadmap.sh/
- Khan Academy: https://www.khanacademy.org/computing
- MIT OpenCourseWare: https://ocw.mit.edu/
- Google's web.dev: https://web.dev/learn/

YOUTUBE CHANNELS (use channel or playlist URLs, NOT individual video URLs):
- Traversy Media: https://www.youtube.com/@TraversyMedia/videos
- The Net Ninja: https://www.youtube.com/@NetNinja/playlists
- Fireship: https://www.youtube.com/@Fireship/videos
- CS Dojo: https://www.youtube.com/@CSDojo/videos
- Programming with Mosh: https://www.youtube.com/@programmingwithmosh/videos
- Corey Schafer: https://www.youtube.com/@coreyms/playlists
- Web Dev Simplified: https://www.youtube.com/@WebDevSimplified/videos
- Tech With Tim: https://www.youtube.com/@TechWithTim/videos
- Academind: https://www.youtube.com/@Academind/playlists
- Kevin Powell: https://www.youtube.com/@KevinPowell/videos

OFFICIAL DOCS (pick based on the topic):
- Python: https://docs.python.org/3/tutorial/
- JavaScript: https://javascript.info/
- React: https://react.dev/learn
- Node.js: https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
- Git: https://git-scm.com/book/en/v2
- SQL: https://www.sqltutorial.org/
- Docker: https://docs.docker.com/get-started/
- Linux: https://linuxjourney.com/
- TypeScript: https://www.typescriptlang.org/docs/
- Vue: https://vuejs.org/guide/introduction
- Django: https://docs.djangoproject.com/en/stable/intro/tutorial01/
- FastAPI: https://fastapi.tiangolo.com/tutorial/
- Rust: https://doc.rust-lang.org/book/
- Go: https://go.dev/tour/welcome/1
- Java: https://dev.java/learn/
- C++: https://www.learncpp.com/
- Kubernetes: https://kubernetes.io/docs/tutorials/kubernetes-basics/
- TensorFlow: https://www.tensorflow.org/tutorials
- PyTorch: https://pytorch.org/tutorials/beginner/basics/intro.html

PRACTICE PLATFORMS:
- LeetCode: https://leetcode.com/explore/
- HackerRank: https://www.hackerrank.com/domains/
- Exercism: https://exercism.org/tracks
- Codecademy (free tiers): https://www.codecademy.com/catalog
"""

VALIDATION_SYSTEM_PROMPT = """You are a strict tech topic validator for a developer learning platform.

Your job is to analyze a user's learning goal and determine:
1. Is it a real, recognized technology, programming language, framework, library, tool, CS concept, or software engineering topic?
2. If it looks like a typo or misspelling of a real tech topic, identify the correct name.
3. If it is completely unrelated to technology or software learning, mark it invalid.

Rules:
- "Mojeco" → invalid, suggest "Mojo" (AI/ML language by Modular)
- "Reakt" → invalid, suggest "React"
- "Python" → valid
- "cooking recipes" → invalid, no suggestion
- "machine learning" → valid
- "fluter" → invalid, suggest "Flutter"
- "django rest" → valid
- "aws lambda" → valid
- Always return ONLY a raw JSON object, no markdown, no explanation.

Return format:
{
  "is_valid": true or false,
  "confirmed_topic": "the exact correct topic name to use for generation",
  "suggested_topic": "corrected name if typo, else same as confirmed_topic",
  "confidence": "high | medium | low",
  "reason": "one sentence explanation shown to the user"
}"""


async def validate_topic(goal: str) -> dict:
    """Step 1: Validate if the goal is a real tech topic using Groq."""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": VALIDATION_SYSTEM_PROMPT},
                {"role": "user", "content": f'User wants to learn: "{goal}"'}
            ],
            temperature=0.1,
            max_tokens=300,
            response_format={"type": "json_object"}
        )
        raw = response.choices[0].message.content
        return json.loads(raw)
    except Exception as e:
        # If validation itself fails, be permissive and allow generation
        return {
            "is_valid": True,
            "confirmed_topic": goal,
            "suggested_topic": goal,
            "confidence": "low",
            "reason": "Validation check skipped due to an error."
        }


async def generate_roadmap(confirmed_topic: str) -> dict:
    """Step 2: Generate the learning path for a validated topic."""
    prompt = f"""
You are a learning roadmap expert. The user wants to learn: "{confirmed_topic}"

CRITICAL RULES FOR URLs:
1. NEVER invent or fabricate URLs. Every URL must exist and be publicly accessible.
2. Use ONLY URLs from the trusted sources listed below — do not use any other domain.
3. For YouTube, always link to a channel's /videos or /playlists page — NEVER link to individual videos (those change).
4. For documentation, link to the actual section page, not just the homepage.
5. Provide 2–3 resources per milestone, each from a different source type (e.g. one docs, one video, one course).
6. Double-check: if you are not 100% sure a URL exists, use the channel/section root instead.

{TRUSTED_RESOURCES}

Return ONLY valid JSON, no extra text, no markdown, no explanation:
{{
  "title": "Path title",
  "total_weeks": 8,
  "milestones": [
    {{
      "title": "Milestone title (e.g. Week 1: Foundations)",
      "duration": "Estimated time (e.g. 5h)",
      "difficulty": "Beginner | Intermediate | Expert",
      "subtopics": ["Subtopic 1", "Subtopic 2"],
      "description": "Short description of what they learn in this milestone",
      "resources": [
        {{
          "title": "Resource name",
          "url": "https://exact-valid-url-from-trusted-list.com/specific-page",
          "type": "video | article | course | docs"
        }}
      ],
      "mentor_skill_tag": "skill name for mentor search"
    }}
  ]
}}
"""

    for attempt in range(2):
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )
            raw = response.choices[0].message.content
            data = json.loads(raw)

            path_id = f"path-{len(my_paths) + 1}"
            data["id"] = path_id

            for i, milestone in enumerate(data.get("milestones", [])):
                m_id = f"m-{path_id}-{i}"
                milestone["id"] = m_id
                milestone["completed"] = False

            my_paths.append(data)
            return data

        except Exception as e:
            if attempt == 1:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to generate path. Engine may be overloaded. " + str(e)
                )
    
    # Fallback return to satisfy type checker (though raise above should cover it)
    return {}


@app.post("/api/learning-path/generate")
async def generate_path(req: GoalRequest):
    goal = req.goal.strip()

    if not goal:
        raise HTTPException(status_code=400, detail="Goal cannot be empty.")

    # Step 1: Validate the topic
    validation = await validate_topic(goal)

    # If invalid or low-confidence typo — return suggestion to frontend
    if not validation.get("is_valid", True):
        suggested = validation.get("suggested_topic", "").strip()
        reason = validation.get("reason", f"'{goal}' doesn't appear to be a recognized tech topic.")

        # Has a suggestion (typo case like "Mojeco" → "Mojo")
        if suggested and suggested.lower() != goal.lower():
            raise HTTPException(
                status_code=422,
                detail={
                    "type": "suggestion",
                    "original_goal": goal,
                    "suggested_topic": suggested,
                    "message": reason
                }
            )
        else:
            # Completely unrelated (e.g. "cooking recipes")
            raise HTTPException(
                status_code=400,
                detail={
                    "type": "unrelated",
                    "original_goal": goal,
                    "message": f"'{goal}' doesn't seem to be a tech or software learning topic. Try something like 'React', 'Python', or 'Machine Learning'."
                }
            )

    # Step 2: Use confirmed/corrected topic name for generation
    confirmed_topic = validation.get("confirmed_topic", goal)
    return await generate_roadmap(confirmed_topic)


@app.get("/api/learning-path/my-paths")
async def get_my_paths():
    return my_paths


@app.patch("/api/learning-path/milestone/{id}/complete")
async def complete_milestone(id: str, status: MilestoneStatus):
    global completion_state
    completion_state[id] = status.completed

    for path in my_paths:
        for milestone in path.get("milestones", []):
            if milestone.get("id") == id:
                milestone["completed"] = status.completed

    return {"status": "success", "completed": status.completed}


@app.delete("/api/learning-path/{id}")
async def delete_path(id: str):
    global my_paths
    my_paths = [p for p in my_paths if p.get("id") != id]
    return {"status": "success"}