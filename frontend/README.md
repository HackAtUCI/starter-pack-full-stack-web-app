# React Front-end

Welcome to React.js! React.js is a component-based JavaScript library that allows you to easily create web applications and user interfaces with less code. We'll explain how to get started with creating your own React project!

## Getting Started

We'll begin by downloading everything we need to create a new React application. These instructions apply to both Windows and MacOs systems.

To use React, we first need to download Node.js and npm (Node Package Manager). You can download both from its [official website](https://nodejs.org/en/download/). After downloading and installing, make sure everything is up-to-date by running these commands:

```
node -v
```

```
npm -v
```

<br>
After installing Node.js, we're ready to create our first project with Vite. Vite is a front-end tool that allows developers to build web applications quickly. Compared to other tools like Create React App, Vite is designed to provide a smoother experience during both development and production stages.

For instance, during coding, Vite reflects changes in your web browser by updating only the specific parts that were changed, not the entire page. And once you've finished coding and are ready to deploy, Vite uses a tool called 'Rollup' to efficiently package your code for production. This process optimizes the code, enhancing load times and performance for users."

To use Vite, navigate to the directory you want to build your project in and run:

```
npx create-vite@latest my-app --template react
```

<br>
Now your project is created! Navigate to your current project's directory with: 
```
cd my-app
```
<br>
To begin running your project, use:
```
npm run dev
```
<br>
Open http://localhost:5173/ in your browser to view your project.
