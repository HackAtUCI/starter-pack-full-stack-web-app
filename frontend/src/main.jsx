import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Search from "./pages/search.jsx"
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import {Results} from "./pages/results.jsx"
/*
This code renders our project so it can be viewed in a browser. 
*/
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path = '/' element={<Search />} />
				<Route path = '/results' element={<Results />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
