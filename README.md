# Starter Pack Series: Full-Stack Web Application

## Introduction

Welcome to the starter-pack series on full-stack web applications! This
repository serves as an introduction to how full-stack web applications work
and how to leverage frameworks to make it easier to build one.

## What are Frontends and Backends?

A frontend is what appears on a webpage, while a backend is what happens
behind the scenes, like providing the data that will eventually be shown on the
webpage.

Frontends generally consist of HTML, CSS, and JavaScript. While you can code
directly using these languages, there are other frameworks such as React that
allow you to do the same faster and more efficiently.

Backends are much more flexible in that all you need is an HTTP server that the
client can send
[different types of requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
to, along with your own custom routes (e.g. http://localhost:5000/my-route), each
of which can perform its own action, such as inserting to a database versus
deleting a record from a database. That being said, there are many libraries,
such as FastAPI (Python) and Express (JavaScript) that have different ways of
doing this.

## What is a Full Stack Web App?

A full-stack web application generally consists of a frontend client and a
backend server. For example, let's say you're trying to access a profile page
on some web application and the data is stored on a database somewhere. When
the page loads, the client sends a request to the backend which, in turn,
retrieves the data from the database. The server will then send the data back to
the frontend so that the frontend can display it to the user. This interaction
is just one example of how a frontend and backend can work together to provide
a great and scalable experience for its users.

**Important:** You might be wondering why you can't just query the database
directly from the frontend. Databases require sensitive credentials for access and
if you store those credentials on the frontend, they _will_ be found no matter
where you put them. Storing them on the backend is much more secure because fewer
people can access them. Specifically, it is possible to configure your backend
so that only your frontend can access it.

## This Application

This application consists of a [React](https://react.dev/) frontend and
[FastAPI](https://fastapi.tiangolo.com/) backend. React is a JavaScript
framework that allows you to create and reuse HTML-like snippets, known as
components, in your application and is able to efficiently render them on the
browser even as the data it renders changes. FastAPI is a Python framework that
is very similar to Flask in terms of how you declare backend routes, and is also,
as the name implies, very fast.

For a deeper explanation on these two frameworks, please view the `README.md`s in
`frontend/` and `backend/`.
