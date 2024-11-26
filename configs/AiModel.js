const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "New York/ NY/ USA, for 4 Day and 3 Night for Family with \na Cheap budget with Flight details, Flight Price with Booking URL, Hotels options list with Hotel Name, Hotel address, Price, hotel image URL, geo-coordinates, rating, descriptions and Places to visit nearby with place Name, Place Details, Place Image URL, Geo Coordinates, ticket Pricing, Time to travel each of the location for 1 Day and 1 Night with each day plan with best time to visit in JSON."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"tripDetails\": {\n    \"destination\": \"New York, NY, USA\",\n    \"duration\": \"4 Days, 3 Nights\",\n    \"budget\": \"Cheap\",\n    \"travelers\": \"Family\"\n  },\n  \"flights\": {\n    \"details\": \"Flight details are highly variable based on your origin city and time of year. Please use a flight comparison website like Google Flights, Skyscanner, or Kayak for the most up-to-date and cheapest options.\",\n    \"sampleFlight\": {\n      \"origin\": \"Your Origin City\", \n      \"destination\": \"JFK (New York)\",\n      \"estimatedPrice\": \"$300 - $600 (round trip, estimate only)\",\n      \"bookingURL\": \"https://www.google.com/flights\",\n      \"note\": \"This is an estimated price.  Actual prices may vary significantly.\"\n    }\n  },\n  \"hotels\": [\n    {\n      \"name\": \"The Jane Hotel\",\n      \"address\": \"113 Jane St, New York, NY 10014\",\n      \"price\": \"$100 - $150/night (estimate, varies by season)\",\n      \"image\": \"https://example.com/jane_hotel.jpg\", // Replace with actual image URL\n      \"geoCoordinates\": {\n        \"latitude\": 40.7359,\n        \"longitude\": -74.0087\n      },\n      \"rating\": 3.5,\n      \"description\": \"Budget-friendly hotel in West Village.\",\n      \"nearbyPlaces\": [\n        {\n          \"name\": \"High Line\",\n          \"details\": \"Elevated park built on former railway lines.\",\n          \"image\": \"https://example.com/highline.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 40.7479,\n            \"longitude\": -74.0060\n          },\n          \"ticketPrice\": \"Free\",\n        },\n        { \n          \"name\": \"Whitney Museum of American Art\",\n          \"details\": \"Museum of 20th and 21st-century American art.\",\n          \"image\": \"https://example.com/whitney.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 40.7396,\n            \"longitude\": -74.0089\n          },\n          \"ticketPrice\": \"$25\"\n        }\n      ]\n    },\n    { // Add more hotel options here following the same structure }\n  ],\n  \"itinerary\": {\n    \"day1\": {\n      \"bestTimeToVisit\": \"Morning\",\n      \"plan\": \"Arrive at JFK, check into hotel. Visit Times Square, grab a cheap meal.\",\n      \"travelTime\": \"Flight + travel to hotel + 2-3 hours at Times Square\"\n    },\n    \"night1\": {\n      \"bestTimeToVisit\": \"Evening\",\n      \"plan\": \"Enjoy a Broadway show (consider rush tickets for discounts) or explore a night market.\",\n      \"travelTime\": \"2-3 hours\"\n    },\n    \"day2\": {\n      \"bestTimeToVisit\": \"Morning\",\n      \"plan\": \"Visit the Statue of Liberty and Ellis Island (ferry required). Explore Battery Park.\",\n      \"travelTime\": \"4-5 hours (including ferry travel time)\"\n    },\n    \"night2\": {\n      \"bestTimeToVisit\": \"Evening\",\n      \"plan\": \"Free activities like walking the Brooklyn Bridge or enjoying a picnic in Central Park.\",\n      \"travelTime\": \"2-3 hours\"\n    },\n    \"day3\": {\n      \"bestTimeToVisit\": \"Daytime\",\n      \"plan\": \"Visit a museum (e.g., Natural History Museum, Metropolitan Museum of Art - consider purchasing a CityPASS for discounts).\",\n      \"travelTime\": \"3-4 hours per museum\"\n    },\n    \"night3\": {\n      \"bestTimeToVisit\": \"Evening\",\n      \"plan\": \"Explore a different neighborhood like Greenwich Village or the East Village for dinner and local experiences.\",\n      \"travelTime\": \"2-3 hours\"\n    },\n    \"day4\": {\n      \"bestTimeToVisit\": \"Morning\",\n      \"plan\": \"Depending on your flight schedule, visit a remaining attraction or revisit a favorite. Depart from JFK.\",\n      \"travelTime\": \"Flexible, based on flight schedule\"\n    }\n  }\n}\n```\n\n\n**Key improvements and explanations in this JSON:**\n\n* **Structured Data:**  The information is organized with clear categories (trip details, flights, hotels, itinerary).  This makes it much easier to parse and use programmatically.\n* **Placeholders for Dynamic Data:** I've included placeholders for flight prices and hotel image URLs. You'll need to replace these with real data using APIs or web scraping techniques.  Flight prices especially are highly volatile.\n* **Realistic Estimates:** I've provided realistic (but still generalized) cost estimates.  NYC can be expensive, so a \"cheap\" trip still requires careful budgeting.  \n* **Detailed Hotel Information:**  The hotel section now includes more relevant details like addresses, estimated prices, geo-coordinates (essential for mapping), ratings, descriptions, and importantly, nearby places of interest.\n* **Itinerary with Time Estimates:** The itinerary now includes suggestions for the best time to visit each attraction and realistic estimates for travel time.\n* **Day and Night Plans:** The itinerary is separated into day and night activities, making it easier to plan.\n* **More Specific Suggestions:** The suggested activities are more specific, including options for different interests.  \n* **Cost-Saving Tips:**  I've included tips for saving money, such as using flight comparison websites, considering rush tickets for Broadway, and exploring free activities.\n\n**Next Steps to Make This Production-Ready:**\n\n1. **Dynamic Data Integration:**  You would need to integrate with flight and hotel APIs (e.g., Amadeus, Skyscanner, Booking.com) to fetch real-time prices, availability, and images.\n2. **Image URLs:** Replace the example image URLs with actual image URLs.\n3. **User Input:**  Design an interface (e.g., a web form) to get the user's origin city, travel dates, and budget.  This would allow you to personalize the flight and hotel search results.\n4. **More Hotel Options:** Add more hotels to the list to give users a better choice.\n5. **Error Handling and Robustness:** Add error handling to your code to manage API connection issues, data inconsistencies, and other potential problems.\n6. **User Reviews:** Integrate with review platforms to provide user ratings and reviews for hotels and attractions.\n\n\nThis improved JSON and these steps will help you create a much more useful and practical travel planning tool."},
          ],
        },
      ],
    });  
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
