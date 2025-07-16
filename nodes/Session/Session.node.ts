import {
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IExecuteFunctions,
	NodeOperationError,
} from 'n8n-workflow';

export class Session implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Session',
		name: 'session',
		icon: 'file:session.svg',
		group: ['communication'],
		version: 1,
		subtitle: '= {{$parameter["operation"]}}',
		description: 'Interact with the Session API',
		defaults: {
			name: 'Session',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'sessionApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					// Messages
					{ name: 'Send Message', value: 'sendMessage', action: 'Send a text message' },
					{ name: 'Send Attachment', value: 'sendAttachment', action: 'Send a file attachment' },
					{ name: 'Delete Message', value: 'deleteMessage', action: 'Delete a message' },
					// Profile
					{ name: 'Set Display Name', value: 'setDisplayName', action: 'Set the profile display name' },
					{ name: 'Set Avatar', value: 'setAvatar', action: 'Set the profile avatar' },
					// Notifications
					{ name: 'Notify Screenshot', value: 'notifyScreenshot', action: 'Notify contact of a screenshot' },
					{ name: 'Notify Media Saved', value: 'notifyMediaSaved', action: 'Notify contact that media was saved' },
					// Reactions
					{ name: 'Add Reaction', value: 'addReaction', action: 'Add a reaction to a message' },
					{ name: 'Remove Reaction', value: 'removeReaction', action: 'Remove a reaction from a message' },
					// Other
					{ name: 'Get Status', value: 'getStatus', action: 'Get the server health status' },
				],
				default: 'sendMessage',
			},

			// Fields for: Send Message
			{
				displayName: 'To (Session ID)',
				name: 'to',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['sendMessage', 'sendAttachment', 'deleteMessage', 'notifyScreenshot', 'notifyMediaSaved', 'addReaction', 'removeReaction'] } },
				description: 'The recipient\'s Session ID',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: { stringBox: true },
				required: true,
				default: '',
				displayOptions: { show: { operation: ['sendMessage'] } },
				description: 'The content of the message',
			},

			// Fields for: Send Attachment
			{
				displayName: 'Input Binary Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: { show: { operation: ['sendAttachment', 'setAvatar'] } },
				description: 'Name of the binary property from which to get the data for the file or avatar',
			},
			{
				displayName: 'Filename',
				name: 'filename',
				type: 'string',
				default: 'file.dat',
				displayOptions: { show: { operation: ['sendAttachment'] } },
				description: 'The name of the file being sent',
			},
			{
				displayName: 'MIME Type',
				name: 'mimeType',
				type: 'string',
				default: 'application/octet-stream',
				displayOptions: { show: { operation: ['sendAttachment'] } },
				description: 'The MIME type of the attachment',
			},

			// Fields for: Delete Message / Reactions / Media Saved
			{
				displayName: 'Message Timestamp',
				name: 'timestamp',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: { show: { operation: ['deleteMessage', 'addReaction', 'removeReaction', 'notifyMediaSaved'] } },
				description: 'The timestamp of the target message',
			},
			{
				displayName: 'Message Hash',
				name: 'hash',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['deleteMessage'] } },
				description: 'The hash of the message to delete (optional but recommended)',
			},

			// Fields for: Profile
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['setDisplayName'] } },
				description: 'The new display name for the bot',
			},

			// Fields for: Reactions
			{
				displayName: 'Emoji',
				name: 'emoji',
				type: 'string',
				required: true,
				default: '👍',
				displayOptions: { show: { operation: ['addReaction', 'removeReaction'] } },
				description: 'The emoji to use for the reaction',
			},
			{
				displayName: 'Author (Session ID)',
				name: 'author',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['addReaction', 'removeReaction'] } },
				description: 'The Session ID of the user who is reacting',
			},
		],

		async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			const items = this.getInputData();
			const returnData: INodeExecutionData[] = [];

			for (let i = 0; i < items.length; i++) {
				try {
					const operation = this.getNodeParameter('operation', i) as string;
					const credentials = await this.getCredentials('sessionApi');
					const baseUrl = credentials.baseUrl as string;
					let endpoint = '';
					let method: 'GET' | 'POST' = 'POST';
					const body: any = {};

					switch (operation) {
						case 'getStatus':
							endpoint = '/status';
							method = 'GET';
							break;

						case 'sendMessage':
							endpoint = '/sendMessage';
							body.to = this.getNodeParameter('to', i) as string;
							body.text = this.getNodeParameter('text', i) as string;
							break;

						case 'sendAttachment':
							endpoint = '/sendAttachment';
							body.to = this.getNodeParameter('to', i) as string;
							body.filename = this.getNodeParameter('filename', i) as string;
							body.mimeType = this.getNodeParameter('mimeType', i) as string;
							const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
							const binaryData = items[i].binary?.[binaryPropertyName];
							if (binaryData === undefined) {
								throw new NodeOperationError(this.getNode(), `No binary data found on property '${binaryPropertyName}'`);
							}
							body.data = binaryData.data; // n8n binary data is already base64 encoded
							break;
						
						case 'setAvatar':
							endpoint = '/setAvatar';
							const avatarPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
							const avatarData = items[i].binary?.[avatarPropertyName];
							if (avatarData === undefined) {
								throw new NodeOperationError(this.getNode(), `No binary data found on property '${avatarPropertyName}' for avatar`);
							}
							body.avatar = avatarData.data;
							break;

						// Cases for other operations
						case 'deleteMessage':
							endpoint = '/deleteMessage';
							body.to = this.getNodeParameter('to', i) as string;
							body.timestamp = this.getNodeParameter('timestamp', i) as number;
							body.hash = this.getNodeParameter('hash', i) as string;
							break;

						case 'setDisplayName':
							endpoint = '/setDisplayName';
							body.displayName = this.getNodeParameter('displayName', i) as string;
							break;
						
						case 'notifyScreenshot':
							endpoint = '/notifyScreenshot';
							body.to = this.getNodeParameter('to', i) as string;
							break;

						case 'notifyMediaSaved':
							endpoint = '/notifyMediaSaved';
							body.to = this.getNodeParameter('to', i) as string;
							body.timestamp = this.getNodeParameter('timestamp', i) as number;
							break;

						case 'addReaction':
						case 'removeReaction':
							endpoint = operation === 'addReaction' ? '/addReaction' : '/removeReaction';
							body.to = this.getNodeParameter('to', i) as string;
							body.timestamp = this.getNodeParameter('timestamp', i) as number;
							body.emoji = this.getNodeParameter('emoji', i) as string;
							body.author = this.getNodeParameter('author', i) as string;
							break;

						default:
							throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported.`);
					}

					const options = {
						headers: { 'Content-Type': 'application/json' },
						method,
						body,
						url: `${baseUrl}${endpoint}`,
						json: true,
					};

					const responseData = await this.helpers.requestWithAuthentication.call(this, 'sessionApi', options);
					returnData.push({ json: responseData });

				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({ json: this.getInputData(i)[0].json, error: error });
						continue;
					}
					throw error;
				}
			}

			return [this.helpers.returnJsonArray(returnData)];
		}
	};
}