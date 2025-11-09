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

        client = genai.Client()
        response = client.models.generate_content(
            model = "gemini-2.5-flash", contents = text
        )

        processed_result = {
            "filename": file.filename,
            "message": response.text,
            "data": text
        }
        return JSONResponse(content=processed_result, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
    finally:
        await file.close()


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
