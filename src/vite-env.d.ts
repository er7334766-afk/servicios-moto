/// <reference types="vite/client" />

interface MotoPartsDesktopApi {
	isElectron: boolean;
	databaseHealth: () => boolean;
	databaseSummary: () => {
		clientes: number;
		motos: number;
		recomendados: number;
	};
	databaseRequest: (operation: string, payload?: unknown) => unknown;
}

interface Window {
	motoPartsDesktop?: MotoPartsDesktopApi;
}
