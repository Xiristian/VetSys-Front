export function convertBackendDateToFrontend(backendDate) {
    if (!backendDate) return null;
    return `${backendDate[0]}-${backendDate[1].toString().padStart(2, '0')}-${backendDate[2].toString().padStart(2, '0')}`;
}