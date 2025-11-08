import useRandomItem from "@/services/useRandomItem";

/**
 * This is a component which encapsulates a small portion of the UI.
 * The component accepts props which should be specified when the component is used
 * e.g. `<RandomItem maximum={1000} />
 *
 * Components allow for reusing pieces of layout without duplicating code,
 * but they are also useful for organizing logical portions of the app.
 */
function RandomItem({ maximum }) {
	const randomItem = useRandomItem(maximum);

	return (
		<div>
			<h2>Random Item Picker</h2>
			<p>The item retrieved from the backend has an ID of {randomItem}</p>
		</div>
	);
}

export default RandomItem;
