from __future__ import annotations
import io
import os
import re
import json
import textwrap
import uuid
from typing import List, Dict, Optional
import fitz

from dotenv import load_dotenv
load_dotenv()  # load .env into os.environ

#import google.generativeai as genai
from anyio import to_thread
from google import genai

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from pypdf import PdfReader
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

import uvicorn


# App + CORS
app = FastAPI(title="Resume Coach API (Gemini)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],  # Change as needed for prod!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Gemini & Resume Endpoints

'''GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)'''






@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # This function checks and validates the file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    try:
        contents = await file.read()
        # PDF processing function could go here
        doc = fitz.open(stream=contents, filetype= "pdf")
        text = ""
        for page in doc:
            text += page.get_text()

        #print(text)
        job_description = "Software Engineer"
        prompt = f"""You are an expert resume reviewer with extensive experience in recruitment and career coaching. You will receive the text content extracted from a resume. Analyze this text and provide detailed, actionable critiques focusing on content quality, language, and structure.
                    Evaluate the following aspects:
                    Action Verbs and Language Strength: Assess the use of strong action verbs vs. passive or weak language
                    Quantifiable Achievements: Identify where metrics and numbers should be added to demonstrate impact
                    Keyword Optimization: Evaluate the presence of industry-relevant keywords and ATS-friendly terminology
                    Clarity and Conciseness: Check for verbose descriptions, unclear statements, or redundant information
                    Professional Tone: Assess grammar, punctuation, spelling, and overall professionalism
                    Content Structure: Evaluate the logical flow and organization of information
                    Experience Descriptions: Analyze how effectively accomplishments are communicated
                    Skills Relevance: Review whether skills listed are specific and marketable
                    Gaps and Missing Information: Identify where important details or context may be missing
                    Provide each critique as a separate, specific, actionable suggestion. Format your response as follows:
                    Each piece of feedback must be on its own line
                    Separate each feedback item with the pipe symbol "|"
                    Be specific and actionable in your critiques
                    Focus only on content, language, and text-based elements
                    Limit each critique to one clear point
                    Do not include the pipe symbol at the beginning or end of your response
                    Example format:
                    Replace "responsible for" with strong action verbs like "Led," "Developed," or "Implemented"|Add quantifiable metrics to "improved sales" - specify percentage increase or dollar amount|Remove generic phrase "team player" and replace with specific examples of collaboration|Spell out acronyms on first use to ensure ATS compatibility
                    Now analyze the resume text and provide your critiques. Here is the resume in text form: {text}. This is the job title: {job_description}"""

        client = genai.Client()
        response = client.models.generate_content(
            model = "gemini-2.5-flash", contents = prompt
        )

        processed_result = {
            "message": response.text,
        }
        return JSONResponse(content=processed_result, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
    finally:
        await file.close()


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
