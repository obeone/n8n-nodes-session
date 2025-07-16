import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

export class SessionTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Session Trigger',
		name: 'sessionTrigger',
		icon: 'file:session.svg', // You'll need to create an icon file
		group: ['trigger'],
		version: 1,
		subtitle: '= {{$parameter["events"].join(", ")}}',
		description: 'Starts a workflow when a Session event is received',
		defaults: {
			name: 'Session Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				default: ['message'],
				description: 'Choose which events should trigger this workflow.',
				options: [
					{ name: 'Call', value: 'call' },
					{ name: 'Media Saved', value: 'mediaSaved' },
					{ name: 'Message', value: 'message' },
					{ name: 'Message Deleted', value: 'messageDeleted' },
					{ name: 'Message Read', value: 'messageRead' },
					{ name: 'Message Request Approved', value: 'messageRequestApproved' },
					{ name: 'Message Typing Indicator', value: 'messageTypingIndicator' },
					{ name: 'Reaction Added', value: 'reactionAdded' },
					{ name: 'Reaction Removed', value: 'reactionRemoved' },
					{ name: 'Screenshot Taken', value: 'screenshotTaken' },
					{ name: 'Sync Avatar', value: 'syncAvatar' },
					{ name: 'Sync Display Name', value: 'syncDisplayName' },
					{ name: 'Sync Message', value: 'syncMessage' },
				],
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData();
		const listenedEvents = this.getNodeParameter('events') as string[];

		// Filter events based on node settings
		if (body.event && !listenedEvents.includes(body.event as string)) {
			// Do not trigger workflow if event is not in the list
			return {};
		}

		return {
			workflowData: [this.helpers.returnJsonArray([body])],
		};
	}
}