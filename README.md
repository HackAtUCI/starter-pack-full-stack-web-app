# Starter Pack Series: Full-Stack Web Application

A single-page React application backed by FastAPI, ready to deploy on Render or Vercel.

[Create a new repository using this template](https://github.com/new?template_name=starter-pack-full-stack-web-app&template_owner=HackAtUCI)
to get started.

## Introduction

Welcome to the starter-pack series on full-stack web applications! This
repository serves as an introduction to how full-stack web applications work
and how to leverage frameworks to make it easier to build one.

## What are Frontends and Backends?

A frontend is the software visible to a user such as what appears on a webpage,
while a backend is the software running behind the scenes such as an endpoint
providing the data that will eventually be shown on the webpage.

Frontends for webpages generally consist of HTML, CSS, and JavaScript that come
together to provide the user interface (UI) along with other visual assets.
While you can code directly in those languages, JavaScript libraries such as React
allow you to do the same faster and more efficiently.

Backends are much more flexible since all you need is a web server listening for
different types of [HTTP requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
on various routes (e.g. /user/info), each of which can perform its own action
such as modifying a database or triggering another action.
There are many libraries, such as FastAPI (Python) and Express (JavaScript) that make
it easy to build special servers known as APIs which interact with a frontend client.

## What is a Full-Stack Web App?

With the rising popularity of single-page applications (SPAs), simple webpages can be
made by keeping the frontend and backend in separate layers. This allows constructing
a full-stack web application with a frontend UI client and a backend API server.

For example, let's say you're trying to access a profile page on some website, and the
data is stored on a database somewhere. When the page loads, the client sends a request
to the server which, in turn, retrieves the corresponding data from the database.
The server then returns the data back to the client for the UI to display on the page.
This interaction is just one example of how a frontend and backend can work together to
provide a great and scalable experience for its users.

**Important:** You might be wondering why you couldn't just query the database directly
from the frontend. Databases require sensitive credentials for access, and if you store
those on the frontend, they _will_ be found no matter where you put them. Keeping them
on the server is much more secure because they won't be visible to the frontend.
This is relevant mainly for purely client-rendered applications: newer React frameworks
such as [Next.js](https://nextjs.org) promote a model of server rendering which unifies
the data fetching and rendering into one place for improved security and performance.

## This Application

This starter pack consists of a frontend UI made with [React](https://react.dev) and a
backend API made with [FastAPI](https://fastapi.tiangolo.com).

React is a JavaScript library for building composable and interactive components through
JSX which is markup similar to HTML. These components can be efficiently rendered to the
browser even as the data provided changes.

FastAPI is a Python framework for building APIs with simple functions and decorators.
The framework is easy to use and also, as the name implies, very fast.

For a deeper explanation on how the app is put together, please view the corresponding
`README` files for the [frontend](frontend/README.md) and [backend](backend/README.md).

For deploying this app to the internet, see [DEPLOYMENT.md](DEPLOYMENT.md).
