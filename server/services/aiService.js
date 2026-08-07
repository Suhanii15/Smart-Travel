const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callGemini = async (prompt, schema, retries = 3) => {
  let delay = 2000;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
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
  origin,
  destination,
   totalDays, travelStyle, peopleCount,
  companions, preferences, interests
}) => {

   console.log("=== GEMINI SERVICE RECEIVED ===");
  console.log({ origin, destination, totalDays, preferences });
  // --- Call 1: Itinerary only ---
  const itineraryPrompt = `
    Create a detailed day-by-day travel itinerary for a trip from ${origin} 
  to ${destination} for exactly ${totalDays} days.
  Travel style: ${travelStyle}. Group: ${companions}, ${peopleCount} people.
  Budget preference: ${preferences}. Interests: ${interests}.

  TRANSPORT ROUTING RULES:
  - Determine the best route from ${origin} to ${destination} based on 
    preference: ${preferences}
    (cheapest = lowest cost, fastest = least time, comfortable = best comfort,
    balanced = best value for time — flight only if saves 6+ hrs and costs 
    less than 2x train)
  - If multiple transport modes exist (train + flight), select based on 
    preference and explain why
  - If destination requires transport changes (e.g. flight then ferry), 
    include ALL legs
  - If any transport leg exceeds 4 hours, dedicate that as a travel day 
    with no activities
  - Day 1 MUST start with transport from ${origin} to ${destination}
  -You may also inmclude the return plans on the last day of the trip after all the activities that could be done are completed
  STRICT RULES:
  - You MUST generate ALL ${totalDays} days. Do NOT leave any day empty.
  - Every non-travel day MUST have atleast 2 activities and atmost 4 activities in morning, 
    afternoon, evening.
  - Travel days should describe the journey as the activity.
  - Return ONLY the JSON object. No explanation.

    IMPORTANT FOR ROUTING:
  - If no direct flight exists from ${origin} to ${destination}, 
    plan via the most logical connecting hub
  - Show each connection as a separate morning/afternoon/evening 
    slot on Day 1
  - If journey crosses midnight, use Day 1 evening for departure 
    and Day 2 morning for arrival
  - Always mention the specific transport mode and approximate 
    duration for each leg in the task description

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
  Provide a realistic cost breakdown in INR for a trip 
  from ${origin} to ${destination}.
  Duration: ${totalDays} days. 
  Group: ${companions}, ${peopleCount} people.
  Budget preference: ${preferences}. 
  Travel style: ${travelStyle}.

  RULES:
  - Determine whether this is a local, domestic, or international trip 
    based on the origin and destination yourself
  - Calculate transport cost based on realistic distance and available 
    modes between ${origin} and ${destination}
  - Apply preference "${preferences}" to select the appropriate transport 
    mode (cheapest/fastest/comfortable/balanced)
  - If multiple transport modes exist, pick based on preference and 
    mention the alternative
  - If the journey requires multiple legs (e.g. flight + ferry, 
    train + cab), include total cost of all legs
  - transportationTotal must include BOTH origin-to-destination cost 
    AND local transport within ${destination} for ${totalDays} days
  - All costs must be realistic for the actual distance, destination 
    type, and number of people (${peopleCount})
  - accommodationTotal must reflect real prices at ${destination} 
    for ${totalDays} nights
  - grandTotal must equal the sum of all category totals
   - All totals must be for the ENTIRE GROUP of ${peopleCount} people combined,
    NOT per person
  - Do NOT multiply per-person cost by people count twice
  - Transport from ${origin} to ${destination}:
    calculate realistic flight/train cost for ${peopleCount} people total
  - Accommodation: realistic hotel cost per night × ${totalDays} nights,
    assuming shared rooms where applicable for ${peopleCount} people
  - Food: realistic daily food budget × ${totalDays} days 
    for ${peopleCount} people total
  -Determine yourself if this is domestic or international based on
  ${origin} and ${destination} and price accordingly.


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