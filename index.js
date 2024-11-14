const express = require("express");
const multer = require("multer");
const { SpeechClient } = require("@google-cloud/speech").v1p1beta1;
const { Translate } = require("@google-cloud/translate").v2;
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// Speech-to-Text transcription function
async function transcribeAudio(filePath) {
    const client = new SpeechClient();

    const audio = {
        content: fs.readFileSync(filePath).toString("base64"),
    };

    const config = {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "ta-IN", // Tamil as the primary language
        alternativeLanguageCodes: ["hi-IN", "pa-IN", "te-IN", "kn-IN", "ml-IN"], // Telugu, Kannada, Malayalam
    };

    const request = {
        audio: audio,
        config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join(" ");

    return transcription;
}

// Translation function
async function translateToEnglish(text) {
    const translateClient = new Translate();
    const [detection] = await translateClient.detect(text);
    const sourceLanguage = detection.language;

    if (sourceLanguage === "en") {
        return { text, sourceLanguage };
    } else {
        const [translation] = await translateClient.translate(text, "en");
        return { text: translation, sourceLanguage };
    }
}

app.post("/upload", upload.single("audio"), async (req, res) => {
    try {
        const filePath = req.file.path;

        // Transcribe audio to text
        const transcription = await transcribeAudio(filePath);

        // Translate to English if needed
        const { text: translatedText, sourceLanguage } = await translateToEnglish(transcription);

        fs.unlinkSync(filePath); // Clean up uploaded file

        res.json({
            transcription,
            translatedText,
            sourceLanguage,
        });
    } catch (error) {
        console.error("Error processing audio:", error);
        res.status(500).json({ error: "Failed to process audio." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
