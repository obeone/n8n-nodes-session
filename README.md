# 🤖 n8n Nodes for Session

![NPM Version](https://img.shields.io/npm/v/n8n-nodes-session?style=flat-square)
![NPM License](https://img.shields.io/npm/l/n8n-nodes-session?style=flat-square)

This repository contains a set of n8n nodes to interact with the **Session Webhook Server**.

---

## 📦 Included Nodes

This collection includes the following nodes:

- **⚙️ Session**: A versatile node to interact with the Session API. It supports a wide range of operations for managing messages, profiles, and more.
- **⚡️ Session Trigger**: A trigger node that listens for incoming messages from the Session Webhook Server, allowing you to start workflows based on new messages.

---

## 🛠️ Installation

To install these nodes in your n8n instance:

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-session` in the **NPM package name** field.
4. Agree to the risks and click **Install**.

After installation, the nodes will be available in the n8n editor.

---

## 🔑 Configuration

To use these nodes, you need to configure the `SessionApi` credentials:

1. In n8n, go to the **Credentials** section.
2. Click **Add credential**.
3. Search for **Session API** and select it.
4. Fill in the required credentials for your Session Webhook Server.

---

## 🚀 Usage

Once installed and configured, you can use the nodes in your workflows.

### Session Node Operations

The `Session` node provides a variety of operations, grouped by category:

| Category | Operation | Description |
| :--- | :--- | :--- |
| 💬 **Messages** | `Send Message` | Send a text message to a specified Session ID. |
| | `Send Attachment` | Send a file attachment (image, document, etc.). |
| | `Delete Message` | Delete a previously sent message. |
| 👤 **Profile** | `Set Display Name` | Update the bot's display name. |
| | `Set Avatar` | Change the bot's profile picture. |
| 📸 **Notifications**| `Notify Screenshot`| Notify a contact that a screenshot has been taken. |
| | `Notify Media Saved`| Notify a contact that media has been saved. |
| 😀 **Reactions** | `Add Reaction` | Add an emoji reaction to a message. |
| | `Remove Reaction` | Remove a reaction from a message. |
| 🌐 **Other** | `Get Status` | Check the health status of the server. |

### Session Trigger Events

The `Session Trigger` node can start a workflow based on the following events:

| Event | Description |
| :--- | :--- |
| `Call` | A call is received. |
| `Media Saved` | A user saves a media file. |
| `Message` | A new message is received. |
| `Message Deleted` | A message is deleted. |
| `Message Read` | A message is marked as read. |
| `Message Request Approved` | A message request is approved. |
| `Message Typing Indicator` | A user starts or stops typing. |
| `Reaction Added` | A reaction is added to a message. |
| `Reaction Removed` | A reaction is removed from a message. |
| `Screenshot Taken` | A user takes a screenshot of the conversation. |
| `Sync Avatar` | A user's avatar is updated. |
| `Sync Display Name` | A user's display name is updated. |
| `Sync Message` | A message is synced from another device. |

---

## 💻 Development

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. **Fork the repository** on GitHub.
2. **Clone your fork** to your local machine:

    ```bash
    git clone https://github.com/YOUR_USERNAME/n8n-nodes-session.git
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Create a new branch** for your feature or bug fix:

    ```bash
    git checkout -b my-new-feature
    ```

5. **Make your changes**.
6. **Build the project** to make sure everything is working correctly:

    ```bash
    npm run build
    ```

7. **Commit your changes** and push them to your fork:

    ```bash
    git commit -m "feat: Add some amazing feature"
    git push origin my-new-feature
    ```

8. **Create a pull request** from your fork to the original repository.

---

## ☁️ Automated Publishing

This project uses GitHub Actions to automatically publish to NPM when new version tags are created. The publishing workflow is configured in [`.github/workflows/publish.yml`](.github/workflows/publish.yml).

### Setting Up Automated Publishing

To enable automated publishing for your fork of this repository:

1. **Generate an NPM Access Token**:
    - Log in to [npmjs.com](https://www.npmjs.com)
    - Go to your profile settings and select "Access Tokens".
    - Generate a new token with "Automation" type.

2. **Add the NPM Token to GitHub Secrets**:
    - Go to your GitHub repository.
    - Navigate to **Settings > Secrets and variables > Actions**.
    - Click **New repository secret**.
    - **Name**: `NPM_TOKEN`
    - **Value**: Your NPM access token from step 1.

3. **Publish a New Version**:
    - Update the version in [`package.json`](package.json).
    - Commit and push your changes.
    - Create and push a version tag:

        ```bash
        git tag v0.1.1
        git push origin v0.1.1
        ```

    - The GitHub Action will automatically build, test, publish to NPM, and create a GitHub release.

### Publishing Workflow Features

- ✅ **Automatic builds** using TypeScript and Gulp
- ✅ **Dependency caching** for faster builds
- ✅ **Test execution** (if test scripts are available)
- ✅ **Package verification** before publishing
- ✅ **Dry-run validation** to prevent publishing errors
- ✅ **GitHub release creation** with automatic changelog
- ✅ **Publication status notifications**

### Manual Publishing

If you prefer to publish manually:

```bash
# Build the project
npm run build

# Login to NPM (if not already logged in)
npm login

# Publish to NPM
npm publish
```

---

## 🆘 Support

If you have any questions, encounter any issues, or have feature requests, please open an issue on the [GitHub repository](https://github.com/obeone/n8n-nodes-session/issues).

---

## 📄 License

This project is licensed under the MIT License.
