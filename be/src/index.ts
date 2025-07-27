require("dotenv").config();
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { ContentBlock, TextBlock } from "@anthropic-ai/sdk/resources";
import {basePrompt as nodeBasePrompt} from "./defaults/node";
import {basePrompt as reactBasePrompt} from "./defaults/react";
import cors from "cors";

// Check if API key is configured
if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY is not set in environment variables');
    console.error('Please create a .env file in the be/ directory with:');
    console.error('ANTHROPIC_API_KEY=your_api_key_here');
    process.exit(1);
}

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
const app = express();
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        message: "Backend is running",
        timestamp: new Date().toISOString()
    });
});

app.post("/template", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        
        const response = await anthropic.messages.create({
            messages: [{
                role: 'user', content: prompt
            }],
            model: 'claude-opus-4-20250514',
            max_tokens: 200,
            system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
        })

        const answer = (response.content[0] as TextBlock).text; // react or node
    if (answer == "react") {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    }

    if (answer === "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }

    res.status(403).json({message: "You cant access this"})
    return;
    } catch (error) {
        console.error('Error in /template endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to process template request',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})

app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages;
        const response = await anthropic.messages.create({
            messages: messages,
            model: 'claude-opus-4-20250514',
            max_tokens: 8000,
            system: getSystemPrompt()
        })

        console.log(response);

        res.json({
            response: (response.content[0] as TextBlock)?.text
        });
    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to process chat request',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});