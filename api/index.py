"""
This is only if you are deploying on Vercel.
If you are not deploying on Vercel, you can delete this file.
"""

from fastapi import FastAPI

from api import app as api

# This ASGI app is used by Vercel as a Serverless Function
app = FastAPI()
app.mount("/api", api)
