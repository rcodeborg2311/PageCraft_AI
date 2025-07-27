# Backend Setup Guide

## Prerequisites

1. **Anthropic API Key**: You need an API key from Anthropic to use their AI services.

## Setup Steps

### 1. Get an Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (it starts with `sk-ant-...`)

### 2. Create Environment File

Create a `.env` file in the `be/` directory with the following content:

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
```

Replace `your_api_key_here` with your actual Anthropic API key.

### 3. Install Dependencies

```bash
cd be
npm install
```

### 4. Start the Backend

```bash
npm run dev
```

You should see:
```
🚀 Backend server running on http://localhost:3000
📊 Health check: http://localhost:3000/health
```

### 5. Test the Backend

Visit `http://localhost:3000/health` in your browser to verify the backend is running.

## Troubleshooting

- **"ANTHROPIC_API_KEY is not set"**: Make sure you created the `.env` file with your API key
- **"Credit balance is too low"**: Add credits to your Anthropic account
- **"Invalid API key"**: Double-check your API key in the `.env` file

## Frontend Integration

Once the backend is running, the frontend should be able to communicate with it. The frontend is configured to connect to `http://localhost:3000` by default. 