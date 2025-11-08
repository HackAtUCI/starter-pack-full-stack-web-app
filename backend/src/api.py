from __future__ import annotations
import io
import os
import re
import json
import textwrap
import uuid
from typing import List, Dict, Optional

from dotenv import load_dotenv
load_dotenv()  # load .env into os.environ

import google.generativeai as genai
from anyio import to_thread

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from pypdf import PdfReader
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# ----------------------------
# App + CORS
# ----------------------------
app = FastAPI(title="Resume Coach API (Gemini)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Gemini setup

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if not GEMINI_API_KEY:
    
    pass
else:
    genai.configure(api_key=GEMINI_API_KEY)

async def _gemini_generate(prompt: str) -> str:
    """
    Calls Gemini synchronously in a worker thread to avoid blocking the event loop.
    Returns raw text.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY missing")

    def _call() -> str:
        model = genai.GenerativeModel(GEMINI_MODEL)
        resp = model.generate_content(prompt)
        # concatenate all text parts
        parts = resp.candidates[0].content.parts
        return "".join(getattr(p, "text", "") for p in parts)

    return await to_thread.run_sync(_call)


# Utilities
MAX_PDF_BYTES = int(os.getenv("MAX_PDF_BYTES", str(10 * 1024 * 1024)))  # 10 MB

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    if len(pdf_bytes) > MAX_PDF_BYTES:
        raise HTTPException(status_code=413, detail="PDF too large (max 10 MB).")
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        chunks = []
        for page in reader.pages:
            txt = page.extract_text() or ""
            chunks.append(txt)
        text = "\n".join(chunks).strip()
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {e}")

def make_checklist_pdf(text: str, filename: str = "resume_todo_list.pdf") -> StreamingResponse:
    """
    Renders plain text (the Gemini checklist) into a simple, clean PDF.
    """
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    W, H = letter
    left, top = 72, H - 72
    y = top

    c.setTitle("Resume To-Do Checklist")
    c.setAuthor("Resume Coach")

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(left, y, "Resume To-Do Checklist")
    y -= 24

    c.setFont("Helvetica", 11)
    for para in text.splitlines():
        line = para.rstrip()
        # Wrap to ~95 chars per line
        wrapped = textwrap.wrap(line, 95) if line else [""]
        for w in wrapped:
            if y < 72:
                c.showPage()
                y = top
                c.setFont("Helvetica", 11)
            c.drawString(left, y, w)
            y -= 14
        # small spacing between bullets/paras
        y -= 4

    c.showPage()
    c.save()
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

# ResumeDoc model (for interactive editor)
class ResumeDocItem(BaseModel):
    id: str
    text: str
    original: Optional[str] = None

class ResumeDocSection(BaseModel):
    name: str
    items: List[ResumeDocItem]

class ResumeDoc(BaseModel):
    title: Optional[str] = None
    sections: List[ResumeDocSection]

SECTION_RX = re.compile(r"^(education|experience|projects?|skills?|summary|certifications?)$", re.I)
BULLET_RX  = re.compile(r"^([-•*]|\u2022)\s+")

def naive_pdf_text_to_doc(resume_text: str) -> ResumeDoc:
    """
    Lightweight heuristic splitter: sections by common headers, bullets by leading symbols,
    otherwise synthesize bullets from sentence-ish lines.
    """
    lines = [ln.strip() for ln in resume_text.splitlines() if ln.strip()]
    sections: List[ResumeDocSection] = []
    cur_name = "Experience"
    cur_items: List[ResumeDocItem] = []
    buf: List[str] = []

    def flush_section():
        nonlocal cur_items
        if cur_items:
            sections.append(ResumeDocSection(name=cur_name, items=cur_items.copy()))
            cur_items.clear()

    for ln in lines:
        if SECTION_RX.match(ln):

            if buf:
                cur_items.append(ResumeDocItem(id=str(uuid.uuid4()), text=" ".join(buf)))
                buf = []
            flush_section()
            cur_name = ln.title()
            continue

        if BULLET_RX.match(ln):
            if buf:
                cur_items.append(ResumeDocItem(id=str(uuid.uuid4()), text=" ".join(buf)))
                buf = []
            cur_items.append(ResumeDocItem(id=str(uuid.uuid4()), text=BULLET_RX.sub("", ln)))
        else:
            buf.append(ln)
            if len(" ".join(buf)) > 120 or ln.endswith("."):
                cur_items.append(ResumeDocItem(id=str(uuid.uuid4()), text=" ".join(buf)))
                buf = []

    if buf:
        cur_items.append(ResumeDocItem(id=str(uuid.uuid4()), text=" ".join(buf)))
    flush_section()

    if not sections:
        sections = [ResumeDocSection(name="Profile", items=[
            ResumeDocItem(id=str(uuid.uuid4()), text=resume_text[:300])
        ])]

    return ResumeDoc(title=None, sections=sections)

# JSON helpers for rewrite endpoint 
JSON_BLOCK_RX = re.compile(r"\{.*\}", re.DOTALL)

def extract_json_block(s: str) -> Dict:
    """
    Gemini may wrap JSON in prose or code fences. Try to recover the first JSON object.
    """
    s = s.strip()
   
    if s.startswith("```"):
        s = s.strip("`")
    
    try:
        return json.loads(s)
    except Exception:
        pass
    m = JSON_BLOCK_RX.search(s)
    if not m:
        raise HTTPException(status_code=500, detail="LLM did not return JSON.")
    block = m.group(0)
    try:
        return json.loads(block)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse LLM JSON: {e}")

# ----------------------------
# Endpoints
# ----------------------------
@app.post("/analyze-resume")
async def analyze_resume(pdf: UploadFile = File(...), job_text: str = Form("")):
    """
    Upload a resume PDF (and optional job description text); returns a To-Do checklist PDF from Gemini.
    """
    if pdf.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload a PDF.")
    pdf_bytes = await pdf.read()
    resume_text = extract_text_from_pdf(pdf_bytes)
    if not resume_text:
        raise HTTPException(status_code=400, detail="No text found in PDF (scanned image PDFs need OCR).")

    prompt = f"""
You are a professional résumé coach.

TASK:
- Read the résumé text.
- Read the job description (if provided).
- Return a numbered checklist of 8–15 concrete improvements.
- Focus on action verbs, measurable impact, ATS-friendly structure, and tailoring to the role.
- Keep each item ≤ 25 words.

FORMAT:
Return plain text bullets only (no JSON).

JOB DESCRIPTION (optional):
{job_text or "N/A"}

RESUMÉ TEXT:
{resume_text}
""".strip()

    advice_text = await _gemini_generate(prompt)
    return make_checklist_pdf(advice_text)

@app.post("/extract-structure", response_model=ResumeDoc)
async def extract_structure(pdf: UploadFile = File(...)):
    """
    Returns a naive structured document model from a PDF (sections + bullet items with IDs).
    """
    if pdf.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload a PDF.")
    pdf_bytes = await pdf.read()
    resume_text = extract_text_from_pdf(pdf_bytes)
    if not resume_text:
        raise HTTPException(status_code=400, detail="No text found in PDF (scanned image PDFs need OCR).")
    return naive_pdf_text_to_doc(resume_text)

class RewriteRequest(BaseModel):
    bullets: List[str]
    role_context: Optional[str] = None
    style: Optional[str] = "concise, action-verb first, metric-forward, ≤ 25 words"

class RewriteSuggestion(BaseModel):
    original: str
    variants: List[str]

class RewriteResponse(BaseModel):
    suggestions: List[RewriteSuggestion]

@app.post("/rewrite-bullets", response_model=RewriteResponse)
async def rewrite_bullets(req: RewriteRequest):
    """
    Uses Gemini to propose 1–3 improved variants per bullet. Returns STRICT JSON.
    """
    if not req.bullets:
        raise HTTPException(status_code=400, detail="No bullets provided.")

    prompt = f"""
You rephrase résumé bullets to be sharper for ATS and recruiters.

Return STRICT JSON only (no prose), with this schema:
{{"suggestions":[{{"original":"...","variants":["v1","v2","v3"]}}...]}}

Rules:
- Start with a strong action verb; put impact and metrics early.
- Mirror relevant keywords from the target role when appropriate.
- Keep each variant ≤ 25 words, no first-person pronouns.

Target role (optional): {req.role_context or "N/A"}
Style guide: {req.style or "concise"}

Bullets to rewrite:
{os.linesep.join(f"- {b}" for b in req.bullets)}
""".strip()

    raw = await _gemini_generate(prompt)
    data = extract_json_block(raw)

    #
    if "suggestions" not in data or not isinstance(data["suggestions"], list):
        raise HTTPException(status_code=500, detail="LLM JSON missing 'suggestions' list.")

 
    return RewriteResponse(**data)

class ExportRequest(BaseModel):
    doc: ResumeDoc
    filename: Optional[str] = "resume_updated.pdf"

@app.post("/export-pdf")
async def export_pdf(req: ExportRequest):
    """
    Renders a ResumeDoc into a clean PDF with sections and bullets.
    """
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    W, H = letter
    left, top = 72, H - 72
    y = top

    title = req.doc.title or "Updated Résumé"
    c.setTitle(title)
    c.setAuthor("Resume Coach")

    c.setFont("Helvetica-Bold", 14)
    c.drawString(left, y, title)
    y -= 24

    for sec in req.doc.sections:
        c.setFont("Helvetica-Bold", 11)
        c.drawString(left, y, sec.name)
        y -= 16
        c.setFont("Helvetica", 10)
        for it in sec.items:
            wrapped = textwrap.wrap(it.text, 95) if it.text else [""]
            for i, line in enumerate(wrapped):
                prefix = "• " if i == 0 else "  "
                if y < 72:
                    c.showPage()
                    y = top
                    c.setFont("Helvetica", 10)
                c.drawString(left, y, prefix + line)
                y -= 12
            y -= 4
        y -= 6

    c.showPage()
    c.save()
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{req.filename or "resume_updated.pdf"}"'}
    )
