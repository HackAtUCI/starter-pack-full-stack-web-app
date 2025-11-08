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


# The decorator declares the function as a FastAPI route on the given path.
# This route in particular is a GET route at "/hello" which returns the example
# dictionary as a JSON response with the status code 200 by default.
@app.get("/hello")
async def hello() -> dict[str, str]:
    """Get hello message."""
    return {"message": "Hello from FastAPI"}


# The route can also handle query parameters encoded in the URL after the path,
# e.g. `/random?maximum=1000`
# If the value isn't an integer, FastAPI will return an error response
# with a validation error describing the invalid input.
@app.get("/random")
async def get_random_item(maximum: int) -> dict[str, int]:
    """Get an item with a random ID."""
    return {"itemId": random.randint(0, maximum)}

@app.get("/chatgpt_haiku")
async def get_haiku():
    gpt.do_something(openai_client)

@app.get("/ask_chatgpt")
async def get_issue(user_input: str):
    print(gpt.get_issues(openai_client, user_input))