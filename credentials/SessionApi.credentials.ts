import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SessionApi implements ICredentialType {
	name = 'sessionApi';
	displayName = 'Session API';
	documentationUrl = 'https://github.com/obeone/n8n-nodes-session'; // Replace with your actual repo URL
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:8080',
			placeholder: 'http://your-session-webhook-server-url:8080',
			description: 'The URL of your Session Webhook Server',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The API key to authenticate with the Session Webhook Server',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		generic: {
			// Add the API key to the header of every request
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};
}