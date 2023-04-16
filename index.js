const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("Client is ready");
});

client.initialize();

const configuration = new Configuration({
    apiKey: process.env.SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion(message) {
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: message,
            max_tokens: 200,
        });
        return completion.data.choices[0].text;
    } catch (error) {
        // console.log(error);
        return "Sorry, there was an error processing your request.";
    }
}


client.on('message', message => {
    console.log(message.body);
    runCompletion(message.body).then(result => message.reply(result));
})