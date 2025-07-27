
# PageCraft\_AI

PageCraft AI is a developer tool that generates and deploys full-stack web applications directly in the browser from natural language prompts.

## 🚀 Overview

PageCraft AI transforms natural-language prompts into deployable React/Node.js apps by integrating GPT APIs (Claude/OpenAI) with WebContainers. It enables instant, browser-based development without requiring local setup.

## 🔧 Key Features

* **Prompt-to-code**: Generate React/Node.js projects from plain text instructions
* **In-browser execution**: Powered by WebContainers (StackBlitz), no local setup needed
* **Live Preview**: Instantly run `npm install` and `npm run dev` in-browser
* **Real-time Editing**: Modify files via Monaco Editor and apply follow-up prompts
* **Custom Parser**: Translates LLM responses (XML-like) into files, folders, and shell commands
* **Supports Iteration**: Add features like dark mode through natural-language prompts

## ⚙️ Tech Stack

* **Frontend**: React, TypeScript, TailwindCSS, Monaco Editor
* **Backend**: Node.js, Express.js (for prompt enrichment and GPT API handling)
* **AI**: OpenAI GPT-4, Anthropic Claude
* **Infra**: StackBlitz WebContainers

## 🧠 How It Works

1. User enters a prompt: e.g., "Create a landing page with a navbar and contact form"
2. Backend enriches the prompt and sends it to the GPT API
3. GPT returns structured XML-like output describing files and commands
4. Custom parser converts it to files/folders/shell commands
5. WebContainer executes commands like `npm install` and starts a dev server
6. Monaco Editor allows real-time edits; users can send follow-up prompts

## 📦 Project Structure

```
PageCraft_AI/
├── backend/                # Express server & LLM routing
│   ├── prompts.ts          # Prompt enrichment logic
│   └── parser.ts           # XML parser and shell command extractor
├── frontend/               # React UI
│   ├── components/         # Editor, explorer, preview
│   ├── containers/         # WebContainer logic
│   └── pages/              # Main views
├── public/                 # Static assets
├── .env                    # API keys (excluded in .gitignore)
├── README.md
└── package.json
```

## 🛠️ Setup

### Prerequisites

* Node.js 18+
* OpenAI or Anthropic API key

### Installation

```bash
git clone https://github.com/rcodeborg2311/PageCraft_AI.git
cd PageCraft_AI
npm install
touch .env
```

Add your API keys to `.env`:

```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key
```

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`


## 📜 License

MIT License. WebContainers used under StackBlitz's terms.

## 🙌 Credits

* [StackBlitz WebContainers](https://webcontainers.io)
* [OpenAI](https://openai.com)
* [Anthropic Claude](https://www.anthropic.com)
* Inspired by Bolt.new and Vercel Design
