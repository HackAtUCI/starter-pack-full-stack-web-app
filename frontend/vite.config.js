import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			/*
			This item adds what's known as a proxy from the frontend development server
			to the backend development server. Vite will take any requests where the path
			starts with `/api` and forward them to backend running locally on port 8000.

			For example, with this setting, a request to `http://localhost:5173/api/hello`
			will be internally rerouted to `http://127.0.0.1:8000/hello`, and whatever
			response that route gives will be provided as if the request were made there.

			If you've ever dealt with CORS errors when making requests from your frontend
			to your backend, the proxy will prevent those from happening!

			Technical note: explicitly specify IPv4 since some systems have localhost
			resolve as IPv6, but the FastAPI CLI and Uvicorn serve on IPv4 by default.
			*/
			"/api": {
				target: "http://127.0.0.1:8000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
