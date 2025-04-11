app.post('/webhook', async (req, res) => {
  const airportName = req.body.sessionInfo.parameters.destination_airport;

  const response = await fetch(`https://api.api-ninjas.com/v1/airports?name=${encodeURIComponent(airportName)}`, {
    headers: { 'X-Api-Key': 'YOUR_API_KEY' }
  });
  const data = await response.json();

  if (data.length > 0) {
    // Valid airport found
    res.json({
      session_info: {
        parameters: {
          destination_airport: data[0].name,
          airport_city: data[0].city,
          airport_country: data[0].country
        }
      },
      fulfillment_response: {
        messages: [{
          text: { text: [`Got it — flying into ${data[0].name}, ${data[0].city}, ${data[0].country}`] }
        }]
      }
    });
  } else {
    // Invalid airport
    res.json({
      fulfillment_response: {
        messages: [{ text: { text: ["Hmm, I couldn't find that airport. Can you try a different one?"] } }],
      },
      session_info: {
        parameters: {
          destination_airport: null // Clear invalid input
        }
      }
    });
  }
});
