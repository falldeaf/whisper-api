require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Configuration, OpenAIApi } = require("openai");
var fs = require('fs');

const app = express();
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '.mp3') //Appending .jpg
	}
})

//const upload = multer({dest: 'uploads/'});
const upload = multer({storage: storage});

const configuration = new Configuration({
	apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/transcribe', upload.single('mp3'), async (req, res) => {
	let stream = fs.createReadStream(req.file.path);
	const transcription = await openai.createTranscription(stream, 'whisper-1');
	console.log(transcription);
	fs.unlink(req.file.path, (err) => {
		if (err) {
			console.error(err);
			return;
		}
	});
	res.send(transcription.data.text);
});

app.listen(3500, () => {
	console.log('Server listening on port 3500');
});