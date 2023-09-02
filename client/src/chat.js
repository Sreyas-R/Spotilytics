import OpenAI from "openai";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

async function generateSongRecc(currSongList) {
  const formattedList = currSongList
    .map((item) => `${item.songName} - ${item.artistName}`)
    .join("\n");

  const prompt = `You are a music recommendation service. Given a list of the user's most listened to songs, your task is to suggest 25 songs that are similar in genre or feature similar artists. Here is the list of 20 songs that the user has been listening to the most:\n${formattedList}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides music recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const completion = response["choices"][0]["message"]["content"];
    return completion;
  } catch (error) {
    console.error("Error occurred while generating recommendations:", error);
    return "An error occurred while generating recommendations.";
  }
}

async function generateSongInsights(currSongList) {
  const formattedList = currSongList
    .map((item) => `${item.songName} - ${item.artistName}`)
    .join("/\n");
  const prompt = `You are a music recommendation service. Given a list of the user's most listened to songs, your task is to give insights into the users taste, do this by analyzing each song ,its genre and give insights such as favorite genre , artist , etc. Your response  needs to be judgemental and humorous and satirical be quirky but not too childish. Here is the list of 20 songs that the user has been listening to the most.Dont go through each song and write something instead find trends , patterns among the users genre , music type etc and write witty remarks. LIMIT TO 20 WORDS \n${formattedList}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You provide witty insights based on a users music playlist.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const completion = response["choices"][0]["message"]["content"];
    console.log(completion);
    return completion;
  } catch (error) {
    const errMessage = "Error Occured while communicating with OpenAi";
    console.error(errMessage);
    return errMessage;
  }
}
export { generateSongRecc, generateSongInsights };
