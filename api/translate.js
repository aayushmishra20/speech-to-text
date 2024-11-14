const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate({
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

  const { text } = req.body;

  try {
    const [detection] = await translate.detect(text);
    const detectedLanguage = detection.language;

    if (detectedLanguage !== 'en') {
      const [translation] = await translate.translate(text, 'en');
      res.status(200).json({ translatedText: translation });
    } else {
      res.status(200).json({ translatedText: text });
    }
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: "Translation failed" });
  }
};
