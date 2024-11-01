import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			/*
      This block adds what's known as a proxy from your frontend to your
      backend. Vite will take any requests that start with `/api` and forward
      them to your backend. For example, with this setting in place, if you
      try to access

      `http://localhost:5173/api`

      then your request will be sent to `http://127.0.0.1:5000/` and you'll see
      the response returned by that route. (Note that that the URL in your
      browser's address will remain `http://localhost:5173/api`.)
      */
			"/api": {
				target: "http://127.0.0.1:5000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
