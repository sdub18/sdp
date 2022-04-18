import React, { useState, createContext } from "react"

export const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
	const [views, setViews] = useState(false);
	return(
		<ViewContext.Provider value={[views, setViews]}>{children}</ViewContext.Provider>
	);
};
