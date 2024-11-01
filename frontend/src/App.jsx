import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

/*
This is the starting point of our application. Here, we can begin coding 
and transforming this page into whatever best suits our needs. 
For example, we can start by creating a login page, home page, or an about section; 
there are many ways to get your application up and running. 
With App.jsx, we can also define global variables and routes to store information as well as page navigation.
*/
function App() {
	const [count, setCount] = useState(0);
	const [randomItem, setRandomItem] = useState(null);

	async function getRandomItem() {
		/*
		You can access 
		*/

		const randInt = Math.floor(Math.random() * 1000);
		const res = await fetch(`/api/items/${randInt}`);
		const json = await res.json();
		setRandomItem(json["item_id"]);
	}

	useEffect(() => {
		getRandomItem();
	}, []);

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
				{randomItem && (
					<p>The item retrieved from the backend has an ID of {randomItem}</p>
				)}
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
}

export default App;
