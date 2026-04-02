import { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../utils/api';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
	const [settings, setSettings] = useState(null);
	const [whatsapp, setWhatsapp] = useState('919103489268'); // fallback to current real number

	useEffect(() => {
		settingsAPI.get()
			.then(res => {
				const data = res.data?.data || res.data;
				setSettings(data);
				if (data?.whatsapp) setWhatsapp(data.whatsapp.replace(/\D/g, ''));
			})
			.catch(() => { /* use fallback */ });
	}, []);

	return (
		<SettingsContext.Provider value={{ settings, whatsapp }}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	return useContext(SettingsContext);
}
