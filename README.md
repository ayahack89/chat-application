# mooncafé.space

If you enjoy this little chatroom and appreciate the effort behind keeping it online, you can support the project here<br>
Every contribution goes directly into hosting, server upgrades, and improving mooncafé

<a href="https://www.buymeacoffee.com/ayanabha88" target="_blank">
  <img 
    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
    alt="Buy Me A Coffee" 
    height="50" />
</a>

> This project currently runs on a very limited server plan. With rising traffic, it may hit request limits or downtime.  
> Your support helps keep the chat fast, stable, and alive for everyone.

---

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

![mooncafé.space Screenshot](https://raw.githubusercontent.com/ayahack89/mooncafe.space/main/chat-room-previews/chat-room-pic-one.jpg)

**mooncafé.space** is a nostalgic, ephemeral chat application inspired by the simple, anonymous chatrooms of the early 2000s. No accounts, no profiles, no history. Just a quiet corner of the web for transient conversations.

> "A small, old-school café on the internet where conversations come and go like passing clouds."

## The Story

I built mooncafé.space because I missed the simplicity of the early internet those small, no-pressure chatrooms from the 2000s where anyone could drop in, choose a nickname, talk for a while, and disappear again without leaving a trail. No accounts, no profiles, no algorithms watching over you. Just a quiet corner of the web where people could speak freely.

This project is a love letter to that era. It's intentionally lightweight, with a focus on ephemerality and user privacy.

## Features

- **Anonymous & Ephemeral:** No accounts required. Chat history is not stored on the server. All data is held in memory and disappears forever once you leave.
- **Circles (Chat Rooms):** Users can create their own private circles and share a link to chat with friends.
- **Real-Time Communication:** Live messaging powered by WebSockets.
- **Rich Text Formatting:** Style your messages with bold, italics, underline, and different fonts.
- **Message Replies:** Easily reply to specific messages.
- **User Presence:** See who’s currently in your circle.
- **Sound Notifications:** Get audible alerts for new messages or when users join/leave.
- **Retro UI:** A user interface inspired by old-school desktop chat applications.
- **Self-Hostable:** The entire application can be run on your own machine for maximum privacy.

## Tech Stack

- **Backend:** Node.js, Express.js, Socket.IO  
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3  
- **No Database:** All chat data is stored in-memory on the server  
- **Hosting:** Render  

## Getting Started

You can run mooncafé.space on your local machine. This is the recommended approach for the best privacy.

### Prerequisites

- Node.js (version 18 or higher)  
- npm (comes with Node.js)

### Installation & Running

1. **Clone the repository:**
    ```bash
    git clone https://github.com/ayahack89/mooncafe.space.git
    cd mooncafe.space
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the server:**
    ```bash
    npm start
    ```

4. **Open in your browser:**
    Navigate to `http://localhost:3000`

The app will now be running.  
You can create a new circle by clicking **"Create/Share Circle"** and sending the generated link to your friends.

## Privacy & Security

The application is intentionally lightweight.  
There is **no database**, **no stored history**, **no logging of messages**, and nothing is written to disk.  

Everything exists only in memory while you're connected.  
When the circle is empty, the data is gone.

The public instance is hosted on a platform that may keep standard access logs on *their* end, but the chat application itself stores nothing.

### For Maximum Privacy (Run Over Tor)

You can run mooncafé.space as a Tor onion service for full anonymity.

1. **Install Tor**
2. **Configure a Tor Onion Service**
    - Edit your `torrc` file:
        ```
        HiddenServiceDir /var/lib/tor/hidden_service/
        HiddenServicePort 80 127.0.0.1:3000
        ```
    - Restart Tor
3. **Get Your Onion Address**
    - Read the `hostname` file inside `HiddenServiceDir`
4. **Run the app locally**
5. **Visit through Tor Browser**


### Friendly reminder:
Please do not use this chatroom for illegal or harmful activities.  
Each person is responsible for what they post.  
mooncafé.space is **not** meant to be a secure or end-to-end encrypted messaging platform.

## Contributing

Contributions are welcome!  
Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Now grab a cup of coffee and enjoy :)
