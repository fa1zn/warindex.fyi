# War Index

[![GitHub](https://img.shields.io/github/stars/fa1zn/warindex.fyi?style=social)](https://github.com/fa1zn/warindex.fyi)

An information aggregator for war markets. Track geopolitical conflicts, prediction markets, and defense stocks in one place.

**Live:** [warindex.fyi](https://warindex.fyi)

## What It Does

War Index visualizes the intersection of geopolitical risk and capital markets:

- **Interactive World Map** — Dark choropleth showing risk levels by country
- **Live Stock Data** — Defense contractors, energy companies, and conflict-exposed equities
- **Prediction Markets** — Real-time odds from Polymarket and Kalshi on geopolitical events
- **Congressional Trades** — Track what politicians are buying and selling
- **Active Conflicts** — Monitor ongoing situations and their market implications

## Features

### Country Analysis
Click any country to see:
- GDP and economic overview
- Conflict exposure assessment
- Relevant stocks with live prices
- Prediction market odds for that region

### Watchlist
Save countries and stocks to track. Persisted locally.

### Alerts Panel
Active conflicts ranked by severity (critical/high/medium/low) with affected countries and related predictions.

### Smart Money
Links to institutional data sources:
- 13F filings (hedge fund holdings)
- Options flow (unusual activity)
- Short interest data
- Insider trading disclosures

## Data Sources

| Data | Source |
|------|--------|
| Stock prices | Yahoo Finance API |
| Prediction markets | Polymarket CLOB, Kalshi API |
| Congressional trades | House Stock Watcher |
| News | Finnhub, NewsAPI |
| Conflict data | ACLED |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Map**: React Leaflet with custom choropleth
- **State**: React hooks + localStorage

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local`:

```
FINNHUB_API_KEY=your_key
NEWS_API_KEY=your_key
```

## Disclaimer

This is an information aggregator for educational purposes. Not financial advice. Do your own research before making investment decisions.

---

Built by [@faaborz](https://x.com/faaborz)
