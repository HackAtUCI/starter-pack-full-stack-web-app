import { useState, useEffect } from "react";

/**
 * This is a custom hook which abstracts the data fetching away from rendering in a component.
 * The hook maintains a state value which is updated on initial render with a value from the API.
 * @param {number} maximum The maximum allowed value
 * @returns {number} A random value from the API
 */
function useRandomItem(maximum) {
	// This hook keeps track of a state value that remains the same across calls
	// as long as the parent component stays mounted
	const [randomItem, setRandomItem] = useState(null);

	// This hook will be called when the parent component mounts and also
	// whenever the maximum value changes because it's in the dependencies array.
	// With Strict Mode enabled, when developing locally, the hook will actually run twice on mount
	useEffect(() => {
		// Get the desired data and store it in the state variable to be rendered by the caller
		const value = getRandomItem(maximum);
		setRandomItem(value);
	}, [maximum]);

	return randomItem;
}

async function getRandomItem(maximum) {
	// Always a good idea to encode any query parameters to handle special characters
	const params = new URLSearchParams({ maximum });
	// Because of the server proxy set up in the Vite config, there's no
	// need to specify localhost for the backend! Just use `/api/<path>`
	const res = await fetch(`/api/random?${params}`);
	// Extract the JSON data from the response
	const data = await res.json();

	return data.itemId;
}

export default useRandomItem;
