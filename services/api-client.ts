import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error(
        '[api-client] NEXT_PUBLIC_API_URL não está definida ou está vazia. ' +
        'Configure NEXT_PUBLIC_API_URL=https://api.engenhariasenac.com.br no ambiente antes do build.'
    );
}

let httpsAgent: import('https').Agent | undefined;
if (typeof window === 'undefined') {
    const https = require('https') as typeof import('https');
    httpsAgent = new https.Agent({ rejectUnauthorized: false });
}

const apiClient = axios.create({
    baseURL: apiUrl,
    ...(httpsAgent ? { httpsAgent } : {}),
});

export default apiClient;
