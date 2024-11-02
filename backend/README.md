# FastAPI Backend

Welcome to FastAPI! FastAPI is a modern and fast web framework for building
APIs in Python using type annotations. If you've worked with Flask before,
there are several similarities between that and FastAPI. Both involve
initializing your application, then declaring routes using decorated functions.

One of the main differences between them, and perhaps what makes FastAPI stand
out, is how much FastAPI relies on type annotations. On top of making routes
more readable for developers, FastAPI automatically validates the provided
type annotations to ensure the parameters provided to a route are correct!

This application only contains a few simple routes declared in `api.py`. We'll
be using these in our frontend!

## Running the Server

To run this application, you'll need Python and all the necessary libraries.
You should create a Python virtual environment so that the packages installed
don't conflict with the ones on your main system by running:

### Windows

```ps
> python -m venv .venv
> .\.venv\Scripts\activate
```

### macOS/Unix

```bash
$ python3 -m venv .venv
$ source .venv/bin/activate
```

Once you've created the virtual environment, install the libraries:

```bash
pip install -r requirements.txt -r requirements-dev.txt
```

Finally, start the local development server:

```bash
fastapi dev src/api.py
```

Congratulations! You've successfully started up a FastAPI backend.

To read more about FastAPI, refer to the
[FastAPI documentation](https://fastapi.tiangolo.com/).
