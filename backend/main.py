"""
app.py

This one file is all you need to start off with your FastAPI server!
"""

from typing import Optional

import uvicorn
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware


# Initializing and setting configurations for your FastAPI application is one 
# of the first things you should do in your code. In this example, we
# initialize this application and then set up cross origin resource sharing,
# so that your frontend can send requests to your backend.
app = FastAPI()
app.add_middleware(CORSMiddleware)


# The line starting with "@" is a Python decorator. For this tutorial, you
# don't need to know exactly how they work, but if you'd like to read more on
# them, see https://pythonbasics.org/decorators/.
#
# In short, the decorator declares the function it decorates as a FastAPI route
# with the path of the provided route. This line declares that a new GET route
# called "/home" so that if you access "http://localhost:5000/home", the below
# dictionary will be returned with the status code 200.
@app.get("/home", status_code=status.HTTP_200_OK)
def read_root():
    return {"Hello": "World"}

# The routes that you specify can also be dynamic, which means that any path
# from "http://localhost:5000/items/1" to "http://localhost:5000/items/65536"
# are valid. When providing such dynamic arguments, you'll need to follow this
# specific syntax and state the type of this argument.
# 
# This path also includes an optional GET parameter called "q". By accessing he
# URL "http://localhost:5000/items/123456?q=testparam", the dictionary:
# 
# { "item_id": 123456, "q": "testparam"}
# 
# will be returned. Note that if `item_id` isn't an integer, FastAPI will
# return a dictionary containing an error statement instead of our result.
@app.get("/items/{item_id}", status_code=status.HTTP_200_OK)
def read_item(item_id: int, q: Optional[str]):
    return {"item_id": item_id, "q": q}


# TODO: Add POST route for demo


if __name__ == "__main__":
    uvicorn.run("main:app", port=5000)
