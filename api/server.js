import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send({
        message:
            "This is ChatGPT AI APP ",
    });
});
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        // text return by api
        prompt: req.body.input,
        // ACCURACY
        temperature: 0,
        // maximum length of the response by bot
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
    //   if text passed by client reached to api it will console passed
        console.log("PASSED: ", req.body.input);

        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    } catch (error) {
        // if api got some error 500 code will be returned
        console.log("FAILED:", req.body.input);
        console.error(error);
        res.status(500).send(error);
    }
});

app.listen(4000, () => console.log("Server is running on port 4000"));