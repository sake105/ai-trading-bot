
import { GoogleGenAI } from "@google/genai";
import { SystemStatus, AssetSignal, NewsItem, ShippingRoute, EconomicEvent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMarketContext = async (
  status: SystemStatus,
  topSignals: AssetSignal[],
  latestNews: NewsItem[],
  logistics: ShippingRoute[]
): Promise<string> => {

  try {
    const prompt = `
    You are the 'Assembled Trading AI' Master Analyst. 
    Analyze the current system status, signals, and intelligence feeds.
    
    1. MARKET TELEMETRY:
    - Regime: ${status.regime}
    - VIX: ${status.vix}
    - Sentiment: ${status.sentimentScore}
    - Geopolitics (GPR): ${status.gprIndex}
    
    2. TOP SIGNALS (Includes Volume & Insider Activity):
    ${topSignals.slice(0, 3).map(s => `- ${s.ticker}: Trend ${s.trendScore}, RSI ${s.rsi.toFixed(0)}, News Impact: ${s.newsSentimentImpact}, Vol ${(s.volume/1000000).toFixed(1)}M, Insider Score ${s.insiderActivity}`).join('\n')}
    
    3. INTELLIGENCE FEED (Reuters, Bloomberg, Telegram, Insiders):
    ${latestNews.slice(0, 5).map(n => `- [${n.source}] ${n.author ? `(${n.author})` : ''} ${n.title} (Affects: ${n.relatedTicker || 'Market'})`).join('\n')}

    4. ALTERNATIVE DATA (Logistics/Shipping):
    ${logistics.filter(l => l.status !== 'Normal').map(l => `- Route ${l.name}: ${l.status}`).join('\n') || "Supply chains normal."}

    TASK:
    Provide a professional executive summary (max 150 words). 
    - Explicitly mention if a stock's signal (Buy/Sell) is being driven by a specific news headline (e.g. "NVDA Buy signal confirmed by Telegram momentum from Andreas Grassl...").
    - Validate if the "Reuters/Bloomberg" headlines support the technical trend.
    - Mention if supply chain issues (shipping routes) pose a risk to specific sectors.
    - Recommend an aggressive or defensive stance.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI Analyst. Please check your API Key configuration.";
  }
};

export const askStrategyAgent = async (
  query: string,
  status: SystemStatus,
  signals: AssetSignal[],
  news: NewsItem[],
  macro: EconomicEvent[]
): Promise<string> => {
  try {
    const prompt = `
      You are the Chief Investment Officer (CIO) of a Quantitative Hedge Fund running the 'Assembled v32' system.
      Your goal is to provide deep, strategic advice using second-order thinking.

      CURRENT SYSTEM STATE:
      - Market Regime: ${status.regime} (VIX: ${status.vix})
      - Active Watchlist: ${signals.map(s => s.ticker).join(', ')}
      - Top News: ${news.slice(0,3).map(n => n.title).join(' | ')}
      - Upcoming Events: ${macro.slice(0,3).map(e => `${e.event} (${e.impact})`).join(', ')}

      USER QUERY: "${query}"

      INSTRUCTIONS:
      1. Think deeply about correlations, macro risks, and sector rotation.
      2. Do not just give a simple answer. Simulate scenarios (e.g., "If CPI comes in hot, Tech will drop, so rotate into X...").
      3. Be decisive. Recommend "Risk On", "Risk Off", or "Hedging".
      4. Provide a structured response with "Analysis", "Risks", and "Action Plan".
    `;

    // Use Gemini 3 Pro with Thinking Mode for complex reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking for deep strategy
      }
    });

    return response.text || "Strategy formulation failed.";
  } catch (error) {
    console.error("Strategy Agent Error:", error);
    return "The Strategy Agent is currently overloaded or disconnected. Please try again later.";
  }
};

export const analyzeScreenshot = async (base64Image: string): Promise<{
  summary: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  tickers: string[];
  confidence: number;
}> => {
  try {
    const prompt = `
      Analyze this trading-related screenshot (e.g., Instagram Story, Telegram Chart, Bloomberg Terminal).
      
      1. Identify the main topic or asset (e.g., NVDA, Crypto, Oil).
      2. Determine the sentiment (Bullish/Positive, Bearish/Negative, Neutral).
      3. Extract specific tickers mentioned.
      4. Summarize the key insight in 1 sentence.
      
      Return JSON ONLY:
      {
        "summary": "string",
        "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
        "tickers": ["string"],
        "confidence": number (0-100)
      }
    `;

    // Remove header if present (e.g., data:image/png;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/png",
            data: cleanBase64
          }
        },
        { text: prompt }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Screenshot Analysis Error:", error);
    return {
      summary: "Failed to analyze image.",
      sentiment: "NEUTRAL",
      tickers: [],
      confidence: 0
    };
  }
};
