const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callGemini = async (prompt, schema, retries = 3) => {
  let delay = 2000;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema }
      });
      return JSON.parse(response.text);
    } catch (error) {
      const busy = error.status === 503 || error.message?.includes("high demand");
      if (busy && attempt < retries) {
        console.warn(`Gemini busy. Retrying in ${delay}ms... (${attempt}/${retries})`);
        await sleep(delay);
        delay *= 2;
        continue;
      }
      throw new Error("Gemini API call failed: " + error.message);
    }
  }
};

const generateItinerary = async ({
  destination, totalDays, travelStyle, peopleCount,
  companions, preferences, interests
}) => {

  // --- Call 1: Itinerary only ---
  const itineraryPrompt = `
    Create a detailed day-by-day travel itinerary for a trip to ${destination} for exactly ${totalDays} days.
    Travel style: ${travelStyle}. Group: ${companions}, ${peopleCount} people.
    Budget: ${preferences}. Interests: ${interests}.

    STRICT RULES:
    - You MUST generate ALL ${totalDays} days. Do NOT leave any day empty.
    - Every day MUST have exactly 2 activities in morning, 2 in afternoon, 2 in evening.
    - Return ONLY the JSON object. No explanation.
  `;

  // Build explicit day keys instead of additionalProperties
  // Gemini handles fixed keys far more reliably
  const dayProperties = {};
  for (let i = 1; i <= totalDays; i++) {
    dayProperties[String(i)] = {
      type: "OBJECT",
      properties: {
        morning:   { type: "ARRAY", items: activityItem() },
        afternoon: { type: "ARRAY", items: activityItem() },
        evening:   { type: "ARRAY", items: activityItem() }
      },
      required: ["morning", "afternoon", "evening"]
    };
  }

  const itinerarySchema = {
    type: "OBJECT",
    properties: { itinerary: { type: "OBJECT", properties: dayProperties, required: Object.keys(dayProperties) } },
    required: ["itinerary"]
  };

  // --- Call 2: Budget only ---
  const budgetPrompt = `
    Provide a realistic cost breakdown in local currency for a trip to ${destination}.
    Duration: ${totalDays} days. Group: ${companions}, ${peopleCount} people.
    Budget preference: ${preferences}. Travel style: ${travelStyle}.
    Return ONLY the JSON. All values must be numbers, not strings.
  `;

  const budgetSchema = {
    type: "OBJECT",
    properties: {
      estimatedBudget: {
        type: "OBJECT",
        properties: {
          accommodationTotal:  { type: "NUMBER" },
          transportationTotal: { type: "NUMBER" },
          foodAndDiningTotal:  { type: "NUMBER" },
          activitiesTotal:     { type: "NUMBER" },
          miscellaneousTotal:  { type: "NUMBER" },
          grandTotal:          { type: "NUMBER" },
          currency:            { type: "STRING" }
        },
        required: ["accommodationTotal","transportationTotal","foodAndDiningTotal",
                   "activitiesTotal","grandTotal","currency"]
      }
    },
    required: ["estimatedBudget"]
  };

  console.log(`Calling Gemini for itinerary (${totalDays} days)...`);
  const itineraryData = await callGemini(itineraryPrompt, itinerarySchema);
  console.log("Itinerary keys:", Object.keys(itineraryData.itinerary || {}));

  console.log("Calling Gemini for budget...");
  const budgetData = await callGemini(budgetPrompt, budgetSchema);
  console.log("Budget:", budgetData.estimatedBudget);

  return {
    itinerary: itineraryData.itinerary || {},
    estimatedBudget: budgetData.estimatedBudget || {}
  };
};

// Helper to keep schema DRY
const activityItem = () => ({
  type: "OBJECT",
  properties: {
    time:          { type: "STRING" },
    task:          { type: "STRING" },
    location:      { type: "STRING" },
    estimatedcost: { type: "NUMBER" }
  },
  required: ["time", "task", "location", "estimatedcost"]
});

module.exports = { generateItinerary };