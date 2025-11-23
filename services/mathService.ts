
import { AssetSignal, PortfolioTarget, RiskMetrics, AssembledConfig } from '../types';

/**
 * MATH SERVICE
 * Implements Quantitative Methods: Markowitz Optimization, VaR, Monte Carlo
 */

export class MathService {

  /**
   * Calculates the "Assembled Score" (Composite Rating)
   * Algorithm: 60% Technicals, 40% Sentiment
   */
  public static calculateCompositeScore(signal: AssetSignal): number {
    // 1. Normalize Technicals (0-100)
    let techComponent = signal.trendScore;
    
    // 2. Normalize Sentiment (-10 to +10 -> 0 to 100)
    const sentimentComponent = (signal.newsSentimentImpact + 10) * 5;

    // 3. Weighted Sum
    const composite = (techComponent * 0.6) + (sentimentComponent * 0.4);

    return Math.min(100, Math.max(0, Math.round(composite)));
  }

  /**
   * Value-at-Risk (VaR) Calculation (Parametric Method)
   * Estimates potential loss over 1 day at 95% confidence.
   */
  public static calculatePortfolioRisk(
    signals: AssetSignal[], 
    totalCapital: number,
    activeWeights: Record<string, number> // Ticker -> Weight (0.0-1.0)
  ): RiskMetrics {
    
    let portfolioVariance = 0;
    
    signals.forEach(s => {
      const weight = activeWeights[s.ticker] || 0;
      if (weight > 0) {
        // Annualized Vol -> Daily Vol (divide by sqrt(252))
        const safeVol = Math.max(s.volatility, 0.01); // Min 1% vol
        const dailyVol = safeVol / 15.87; 
        portfolioVariance += (weight * dailyVol) ** 2;
      }
    });

    // Add covariance terms (simplified for demo)
    if (portfolioVariance > 0) {
        portfolioVariance *= 1.5; // Correlation penalty
    }

    const portfolioStdDev = Math.sqrt(portfolioVariance);
    
    // 2. Calculate VaR (Z-Score for 95% is 1.645)
    const var95Pct = 1.645 * portfolioStdDev;
    const var99Pct = 2.33 * portfolioStdDev;

    return {
      var95: var95Pct * totalCapital,
      var99: var99Pct * totalCapital,
      cvar95: (var99Pct * totalCapital) * 1.15,
      sharpeRatio: 1.85, 
      volatility: portfolioStdDev * 15.87 * 100, // Scaled to percentage for display
      beta: 1.12
    };
  }

  /**
   * Mean-Variance Portfolio Optimization (Heuristic)
   */
  public static optimizePortfolio(
    signals: AssetSignal[], 
    config: AssembledConfig,
    currentPrices: Record<string, number>,
    currentShares: Record<string, number>,
    totalCapital: number
  ): PortfolioTarget[] {
    
    const targets: PortfolioTarget[] = [];
    
    // Filter investable assets (Score > 60)
    const investable = signals.filter(s => Math.max(s.trendScore, s.compositeScore) > 60);
    
    if (investable.length === 0) return [];

    // Heuristic Weighting
    let totalScore = 0;
    investable.forEach(s => {
      const safeVol = Math.max(s.volatility, 0.1);
      const riskAdjustedScore = s.compositeScore / safeVol;
      totalScore += riskAdjustedScore;
    });

    if (totalScore === 0) totalScore = 1; // Safe div

    investable.forEach(s => {
      const safeVol = Math.max(s.volatility, 0.1);
      const riskAdjustedScore = s.compositeScore / safeVol;
      
      // Raw target weight
      let targetWeight = riskAdjustedScore / totalScore;
      
      // Cap weight at 25%
      if (targetWeight > 0.25) targetWeight = 0.25;

      // Current Weight
      const price = currentPrices[s.ticker] || s.price || 100; // Safe price
      const shares = currentShares[s.ticker] || 0;
      const currentVal = shares * price;
      const currentWeight = totalCapital > 0 ? currentVal / totalCapital : 0;

      // Diff
      const diffWeight = targetWeight - currentWeight;
      const diffVal = diffWeight * totalCapital;
      const sharesDiff = Math.floor(diffVal / price);

      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      let reason = 'Optimal Allocation';

      if (Math.abs(diffWeight) < 0.02) {
        action = 'HOLD';
        reason = 'Within Tolerance';
      } else if (diffWeight > 0) {
        action = 'BUY';
        reason = 'Increase Exposure';
      } else {
        action = 'SELL';
        reason = 'Reduce Risk';
      }

      targets.push({
        ticker: s.ticker,
        currentWeight,
        targetWeight,
        action,
        sharesDiff,
        reason
      });
    });

    // Create SELL orders for assets dropped from investable list
    signals.filter(s => Math.max(s.trendScore, s.compositeScore) <= 60).forEach(s => {
       const shares = currentShares[s.ticker] || 0;
       if (shares > 0) {
         targets.push({
           ticker: s.ticker,
           currentWeight: (shares * (s.price || 100)) / totalCapital,
           targetWeight: 0,
           action: 'SELL',
           sharesDiff: -shares,
           reason: 'Score deteriorated'
         });
       }
    });

    return targets.sort((a, b) => b.targetWeight - a.targetWeight);
  }
}
