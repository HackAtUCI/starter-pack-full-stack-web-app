"""
This file defines the FastAPI app for the API and all of its routes.
To run this API, use the FastAPI CLI
$ fastapi dev src/api.py
"""

import random

from fastapi import FastAPI
import openai_funcs as gpt

# The app which manages all of the API routes
app = FastAPI()
openai_client = gpt.initialize_connection()

@app.get("/api/issues")
async def get_ranks(user_input: str):
    print(gpt.get_ranks(openai_client, user_input))