const contextBuilder = require('../services/contextBuilder');
const llmClient = require('../services/llmClient');

async function chat(req, res) {
  try {
    const { message, language = 'English', conversationHistory = [], userProfile = null } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const systemPrompt = contextBuilder.buildContext(message, language, userProfile);
    const recentHistory = conversationHistory.slice(-10);
    const reply = await llmClient.generateReply(systemPrompt, recentHistory, message);

    res.json({ reply });
  } catch (err) {
    console.error('Bot chat error:', err);
    res.status(500).json({ error: 'Bot service unavailable' });
  }
}

module.exports = { chat };
