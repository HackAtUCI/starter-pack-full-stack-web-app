import { useState } from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import RandomItem from "@/components/RandomItem";

/*
This is the starting point of our application. Here, we can begin coding 
and transforming this page into whatever best suits our needs. 
For example, we can start by creating a login page, home page, or an about section; 
there are many ways to get your application up and running. 
With App.jsx, we can also define global variables and routes to store information as well as page navigation.
*/
function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1>hello world</h1>
		</>
	);
}

export default App;
