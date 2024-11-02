# Deployment

This starter pack includes the configuration needed to deploy to some popular hosting services.

## General Notes

If any new third-party Python libraries are being used, they'll need to be added to
`requirements.txt` so they can be installed when being deployed.

The provided [Dockerfile](Dockerfile) specifies how the full-stack application can be put together
for hosting services that support building and deploying from a Dockerfile.
Specifically, the React application bundle produced by Vite is copied to a public directory
from which FastAPI serves static assets, i.e. the HTML, CSS, JS, and other images or data.

The provided deployment configurations also support client-side routing libraries such as
[React Router](https://reactrouter.com) or [TanStack Router](https://tanstack.com/router).
This is done by having the frontend app served on all non-existent URL paths so that the
single-page application (SPA) can resolve the appropriate view in the browser.

## Deploying on Render

[Render](https://render.com) is a cloud application platform for hosting web services,
static sites, databases, and more. The free Hobby tier is great for small personal projects.

1. Head over to the [Render Dashboard](https://dashboard.render.com) and create a new web service.
2. Connect your GitHub repository to use for the source code
3. Render should automatically detect the **Language** to be **Docker**
4. Update the service name and Git branch as needed
5. Select an instance type
6. Add any environment variables if needed
7. Select **Deploy Web Service** to start the deployment

## Deploying on Vercel

[Vercel](https://vercel.com) is a cloud platform for creating and deploying web applications.
The provided configuration in [`vercel.json`](vercel.json) specifies how this full-stack app
can be deployed directly to Vercel.

To deploy this project, follow the directions to
[import an existing project](https://vercel.com/docs/getting-started-with-vercel/import)
or [deploy to Vercel with Vercel CLI](https://vercel.com/docs/deployments/deploy-with-vercel-cli)
from the root directory of the repository.

```shell
vercel
```

The application bundle from the React app will be served as static assets,
and the API will be deployed as a [Vercel Function](https://vercel.com/docs/functions).

If additional data files need to be included with the API deployment,
e.g. a `configuration` folder next to `src`,
then the `excludeFiles` property in `vercel.json` will need to be updated accordingly.

```diff
-"excludeFiles": "{!(*.py),@(bin|frontend)/**,backend/{*,!(src)/**}}"
+"excludeFiles": "{!(*.py),@(bin|frontend)/**,backend/{*,!(src|configuration)/**}}"
```

## Other Platforms

If the hosting service supports deploying a Docker image, the steps should be similar to
[deploying on Render](#deploying-on-render). Otherwise, you will need to manually put together the
frontend UI and API server.

## Troubleshooting

If the container deployment fails, you can try testing the Docker image locally.
Install [Docker](https://www.docker.com) to build and run the image in a container.

```shell
docker build . -t my-app
docker run --rm -it -p 8000:8000 my-app
```

The final app should then be running and accessible at `localhost:8000`.

If there are issues with installing Python dependencies, you can try using the default
image for Python instead of the "slim" variant.

```diff
-FROM python:3.12-slim
+FROM python3:12
```
