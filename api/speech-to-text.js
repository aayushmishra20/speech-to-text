const { SpeechClient } = require('@google-cloud/speech');

const client = new SpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const audioContent = req.body.audioContent;
  const languageCode = req.body.languageCode || 'hi-IN';  // Default to Hindi if no languageCode provided

  // You can allow for languages like 'hi-IN' (Hindi), 'ta-IN' (Tamil), or others.
  const supportedLanguages = ['hi-IN', 'ta-IN', 'en-IN'];  // You can add more languages if needed

  // Validate language code
  if (!supportedLanguages.includes(languageCode)) {
    return res.status(400).json({ error: 'Unsupported language code. Please use "hi-IN" for Hindi or "ta-IN" for Tamil.' });
  }

  const request = {
    audio: {
      content: audioContent,
    },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: languageCode,  // Use the provided language code
    },
  };

  try {
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    res.status(200).json({ text: transcription });
  } catch (error) {
    console.error("Error during speech recognition:", error);
    res.status(500).json({ error: "Speech-to-text failed" });
  }
};
