import fetch from 'node-fetch'

const API_ENDPOINT = 'https://api.openai.com/v1/completions';
const AI_MODEL = 'text-davinci-003';
const AI_MAX_TOKENS = 1000;
const AI_TEMPERATURE = 0;

export const handler = async (event, context) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: 'Missing body request'
        };
    }

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'post',
            body: JSON.stringify({
                model: AI_MODEL,
                prompt: event.body,
                max_tokens: AI_MAX_TOKENS,
                temperature: AI_TEMPERATURE
            }),
            headers: {
                'Content-Type': 'application/json',
                'OpenAI-Organization': process.env.OPENAI_ORG,
                'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`
            }
        });

        const {
            choices
        } = await response.json();

        if (!choices || !choices.length) {
            return {
                statusCode: 404,
                body: 'No response, please retry or reformulate.'
            };
        }

        return {
            statusCode: 200,
            body: choices[0].text
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed fetching data, please retry.'
            }),
        };
    }
};