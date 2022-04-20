import React, { useState, createContext } from "react"

export const PeriodContext = createContext();

export const PeriodProvider = ({ children }) => {
	const [period, setPeriod] = useState("");
	return(
		<PeriodContext.Provider value={[period, setPeriod]}>{children}</PeriodContext.Provider>
	);
};
