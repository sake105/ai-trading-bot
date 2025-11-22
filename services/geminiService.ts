import { GoogleGenAI } from "@google/genai";
import { SystemStatus, AssetSignal, NewsItem, ShippingRoute } from '../types';

export const analyzeMarketContext = async (
  apiKey: string,
  status: SystemStatus,
  topSignals: AssetSignal[],
  latestNews: NewsItem[],
  logistics: ShippingRoute[]
): Promise<string> => {
  if (!apiKey) {
    return "Please provide a valid Gemini API Key in the Settings tab to enable AI analysis.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
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
    ${latestNews.slice(0, 5).map(n => `- [${n.source}] ${n.title} (Affects: ${n.relatedTicker || 'Market'})`).join('\n')}

    4. ALTERNATIVE DATA (Logistics/Shipping):
    ${logistics.filter(l => l.status !== 'Normal').map(l => `- Route ${l.name}: ${l.status}`).join('\n') || "Supply chains normal."}

    TASK:
    Provide a professional executive summary (max 150 words). 
    - Explicitly mention if a stock's signal (Buy/Sell) is being driven by a specific news headline (e.g. "NVDA Buy signal confirmed by Telegram momentum...").
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
    return "Error connecting to AI Analyst. Please check your API Key.";
  }
};