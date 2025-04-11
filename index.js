// index.js
const express = require('express');  // Import Express
const fetch = require('node-fetch'); // Or use global fetch if on Node.js 18+

// Create an instance of Express
const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

// Define your webhook endpoint (example: /webhook)
app.post('/webhook', async (req, res) => {
  // Example: Extract parameter from the incoming Dialogflow request
  const airportName = req.body.sessionInfo.parameters.destination_airport;

  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/airports?name=${encodeURIComponent(airportName)}`, {
      headers: { 'X-Api-Key': '8ROzg+wu73IprZRljrM+rA==zoBfzP4FEv1NmUnL' }
    });
    const data = await response.json();

    if (data.length > 0) {
      // Send back a successful response to Dialogflow
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
            text: { text: [`Got it: ${data[0].name} located in ${data[0].city}, ${data[0].country}.`] }
          }]
        }
      });
    } else {
      // No matching airport found
      res.json({
        fulfillment_response: {
          messages: [{ text: { text: ["I couldn't find that airport. Could you re-enter the name?"] } }]
        },
        session_info: {
          parameters: {
            destination_airport: null
          }
        }
      });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Server error');
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
