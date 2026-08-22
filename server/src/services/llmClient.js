const https = require('https');

// Uses Groq API — fast, free, OpenAI-compatible
// Set in server/.env:
//   LLM_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
//   LLM_MODEL=groq/compound-mini   (optional, this is the default)

async function generateReply(systemPrompt, conversationHistory, userMessage) {
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return 'AI assistant is not configured. Please set LLM_API_KEY to your Groq API key in server/.env';
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  const model = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';
  const body = JSON.stringify({ model, messages, max_tokens: 512, temperature: 0.7 });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.message?.content;
            if (!content) {
              const errMsg = parsed.error?.message || 'No response from AI.';
              console.error('Groq error:', errMsg);
              resolve(`Sorry, I couldn't get a response: ${errMsg}`);
            } else {
              resolve(content);
            }
          } catch {
            resolve('Error parsing AI response.');
          }
        });
      }
    );

    req.on('error', (err) => {
      console.error('Groq request error:', err.message);
      resolve('AI service is currently unavailable. Please try again.');
    });

    req.write(body);
    req.end();
  });
}

module.exports = { generateReply };
