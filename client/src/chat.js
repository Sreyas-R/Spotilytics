import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

async function generateSongRecc(currSongList) {
  const formattedList = currSongList
    .map((item) => `${item.songName} - ${item.artistName}`)
    .join("\n");
  console.log("Formatted List", formattedList);
  // Add the currSongList parameter
  const prompt = `You are a music recommendation service used to give recommendations to users after being given their most listened to songs. 
  Your task is to suggest 25 songs similar to the 20 songs that the user has been listening to the most.
  Your suggestions should include music of similar genres and ideally feature songs by similar artists that the user has been listening to.
  
  Here is the list of 20 songs that the user has been listening to the most: 
  ${formattedList}

  
  Please omit any introductions and format your response as a simple list of songs separated by newlines.

  Sample response:
  """
  song1--artist1
  song2--artist2
  song3--artist3
  .....
  """
  Do NOT provide a numbered list.`;

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
    console.log(response.choices[0].message);
    const completion = response.data.choices[0].message.content;
    console.log(completion);
    return completion;
  } catch (error) {
    console.error("Error occurred while generating recommendations:", error);
    return "An error occurred while generating recommendations.";
  }
}

export default generateSongRecc;
