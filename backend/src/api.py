"""
This file defines the FastAPI app for the API and all of its routes.
To run this API, use the FastAPI CLI
$ fastapi dev src/api.py
"""

import random
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import openai_funcs as gpt
import webscrape 

# The app which manages all of the API routes
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers =["*"],
)
openai_client = gpt.initialize_connection()

@app.get("/api/issues")
async def get_ranks(user_input: str):
    print(gpt.get_ranks(openai_client, user_input))

@app.get("/api/actions")
async def get_actions(user_input: str):
    return webscrape.webscrape(user_input)