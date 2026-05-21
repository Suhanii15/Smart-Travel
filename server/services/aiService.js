const { GoogleGenAI } = require("@google/genai");

// Pass it inside an options configuration object instead of a raw string
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const generateItinerary = async ({
  destination,
  totalDays,
  travelStyle,
  peopleCount,
  companions,
  preferences,
  interests
}) => {
  try {
    const prompt = `Create a highly tailored travel guide and full financial breakdown for a trip to ${destination} lasting exactly ${totalDays} days.
    
    PERSONALIZATION PARAMETERS:
    - Travel Style Vibe: ${travelStyle}
    - Companion Setup: ${companions}
    - Total Group Headcount: ${peopleCount} person/people
    - Budget Level Preference: ${preferences}
    - Key Interests: ${interests}

    1. Provide engaging timeline events categorized into morning, afternoon, and evening slots for every single day.
    2. Provide a realistic cost prediction breakdown for the entire group duration including housing, transport, meals, and activities. Return all costs as standard numbers in local currency.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            itinerary: {
              type: "OBJECT",
              description: "A map where keys are string day numbers (e.g., '1', '2') containing day slices.",
              additionalProperties: {
                type: "OBJECT",
                properties: {
                  morning: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        time: { type: "STRING" },
                        task: { type: "STRING" },
                        location: { type: "STRING" },
                        estimatedcost: { type: "NUMBER" }
                      },
                      required: ["time", "task"]
                    }
                  },
                  afternoon: { type: "ARRAY", items: { type: "OBJECT", properties: { time: { type: "STRING" }, task: { type: "STRING" }, location: { type: "STRING" }, estimatedcost: { type: "NUMBER" } }, required: ["time", "task"] } },
                  evening: { type: "ARRAY", items: { type: "OBJECT", properties: { time: { type: "STRING" }, task: { type: "STRING" }, location: { type: "STRING" }, estimatedcost: { type: "NUMBER" } }, required: ["time", "task"] } }
                },
                required: ["morning", "afternoon", "evening"]
              }
            },
            // FIX: Changed from budgetEstimation to estimatedBudget to match your schema perfectly
            estimatedBudget: {
              type: "OBJECT",
              properties: {
                accommodationTotal: { type: "NUMBER" },
                transportationTotal: { type: "NUMBER" },
                foodAndDiningTotal: { type: "NUMBER" },
                activitiesTotal: { type: "NUMBER" },
                miscellaneousTotal: { type: "NUMBER" },
                grandTotal: { type: "NUMBER" },
                currency: { type: "STRING", description: "3 letter ISO Currency code matching destination (e.g., INR)" }
              },
              required: ["accommodationTotal", "transportationTotal", "foodAndDiningTotal", "activitiesTotal", "grandTotal", "currency"]
            }
          },
          required: ["itinerary", "estimatedBudget"] // FIX: Also updated the required array key
        }
      }
    });

    return JSON.parse(response.text);

  } catch (error) {
    console.error("Gemini Multi-Extraction Failure:", error);
    throw new Error("Failed to compile AI data models.");
  }
};

module.exports = { generateItinerary };