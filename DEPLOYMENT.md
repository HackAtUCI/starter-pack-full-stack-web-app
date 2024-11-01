# Deployment

This starter pack includes the configuration needed to deploy to some popular hosting services.

## General Notes

If any new third-party Python libraries are being used, they'll need to be added to
`requirements.txt` so they can be installed when being deployed.

The provided [Dockerfile](Dockerfile) specifies how the full-stack application can be put together
for services that support building and deploying from a Dockerfile.

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

coming soon ...

## Other Platforms

If the hosting service supports deploying a Docker image, the steps should be similar to
[deploying on Render](#deploying-on-render). Otherwise, you will need to manually put together the
frontend UI and API server.
