import { useEffect } from "react";

export default function TradingChart() {
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "BINANCE:BTCUSDT",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      save_image: false,
      studies: [],
      container_id: "tradingview_chart",
    });

    document.getElementById("tradingview_chart").appendChild(script);
  }, []);

  return (
    <div
      id="tradingview_chart"
      style={{
        height: "520px",
        width: "100%",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    />
  );
}