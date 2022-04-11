import React, { useState, createContext } from "react"

export const AddonContext = createContext();

export const AddonProvider = ({ children }) => {
	const [addon, setAddon] = useState("");
	return(
		<AddonContext.Provider value={[addon, setAddon]}>{children}</AddonContext.Provider>
	);
};
