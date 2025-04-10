const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const API_KEY = process.env.API_KEY;

app.post("/webhook", async (req, res) => {
  const country = req.body.sessionInfo?.parameters?.country || "India";

  try {
    const response = await axios.get("https://api.api-ninjas.com/v1/city", {
      params: {
        country: country,
        limit: 5,
      },
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    const cities = response.data.map((city) => city.name);

    res.json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: [
                `Here are some cities in ${country}: ${cities.join(", ")}. Which one would you like to choose?`,
              ],
            },
          },
        ],
      },
      sessionInfo: {
        parameters: {
          cities: cities,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching cities:", error.response?.data || error.message);

    res.json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: [
                `Sorry, I couldn't fetch the cities for ${country}. Please try again later.`,
              ],
            },
          },
        ],
      },
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
