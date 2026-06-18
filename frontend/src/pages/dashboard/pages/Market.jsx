import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import api from "../../../api/axios";
import "./Market.css";

export default function Market() {

  const navigate = useNavigate();

  const [crypto,setCrypto] = useState([]);
  const [stocks,setStocks] = useState([]);
  const [loading,setLoading] = useState(true);

  const [tab,setTab] = useState("crypto");
  const [search,setSearch] = useState("");
  const [sort,setSort] = useState("marketcap");

  /* ======================
      FETCH MARKET DATA
  ====================== */

  const fetchMarket = useCallback(async () => {

    try{

      const [cryptoRes,stockRes] = await Promise.all([
        api.get("/market/crypto"),
        api.get("/market/stocks")
      ]);

      setCrypto(cryptoRes.data || []);
      setStocks(stockRes.data || []);

    }catch(err){
      console.error("Market fetch error:",err);
    }finally{
      setLoading(false);
    }

  },[]);

  useEffect(()=>{

    fetchMarket();

    const interval = setInterval(fetchMarket,20000);

    return () => clearInterval(interval);

  },[fetchMarket]);

  /* ======================
      FILTER SEARCH
  ====================== */

  const filteredCrypto = useMemo(()=>{

    return crypto.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    );

  },[crypto,search]);

  const filteredStocks = useMemo(()=>{

    return stocks.filter(s =>
      s.symbol.toLowerCase().includes(search.toLowerCase())
    );

  },[stocks,search]);

  /* ======================
      SORTING
  ====================== */

  const sortedCrypto = useMemo(()=>{

    const arr = [...filteredCrypto];

    if(sort === "price"){
      arr.sort((a,b)=>b.current_price - a.current_price);
    }

    if(sort === "change"){
      arr.sort((a,b)=>b.price_change_percentage_24h - a.price_change_percentage_24h);
    }

    if(sort === "marketcap"){
      arr.sort((a,b)=>b.market_cap - a.market_cap);
    }

    return arr;

  },[filteredCrypto,sort]);

  /* ======================
      TOP GAINERS / LOSERS
  ====================== */

  const topGainers = [...crypto]
    .sort((a,b)=>b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0,3);

  const topLosers = [...crypto]
    .sort((a,b)=>a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0,3);

  /* ======================
      NAVIGATE
  ====================== */

  const openAsset = (type,id)=>{
    navigate(`/dashboard/market/${type}/${id}`);
  };

  if(loading){
    return <div className="market-loading">Loading market...</div>;
  }

  return (

    <div className="market-container">

      {/* HEADER */}

      <div className="market-header">

        <h1>Market</h1>

        <input
          type="text"
          placeholder="Search BTC, ETH, AAPL..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

      {/* TRENDING */}

      <div className="market-highlights">

        <div className="highlight-box">

          <h3>Top Gainers 🚀</h3>

          {topGainers.map(c=>(

            <div
              key={c.id}
              className="highlight-row"
              onClick={()=>openAsset("crypto",c.id)}
            >

              <img src={c.image} alt={c.name}/>

              <span>{c.symbol.toUpperCase()}</span>

              <span className="green">
                {c.price_change_percentage_24h.toFixed(2)}%
              </span>

            </div>

          ))}

        </div>

        <div className="highlight-box">

          <h3>Top Losers 📉</h3>

          {topLosers.map(c=>(

            <div
              key={c.id}
              className="highlight-row"
              onClick={()=>openAsset("crypto",c.id)}
            >

              <img src={c.image} alt={c.name}/>

              <span>{c.symbol.toUpperCase()}</span>

              <span className="red">
                {c.price_change_percentage_24h.toFixed(2)}%
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* TABS */}

      <div className="market-tabs">

        <button
          className={tab==="crypto" ? "active" : ""}
          onClick={()=>setTab("crypto")}
        >
          Crypto
        </button>

        <button
          className={tab==="stocks" ? "active" : ""}
          onClick={()=>setTab("stocks")}
        >
          Stocks
        </button>

      </div>

      {/* SORT */}

      {tab === "crypto" && (

        <div className="market-sort">

          <span>Sort by:</span>

          <button onClick={()=>setSort("marketcap")}>Market Cap</button>
          <button onClick={()=>setSort("price")}>Price</button>
          <button onClick={()=>setSort("change")}>24h Change</button>

        </div>

      )}

      {/* CRYPTO TABLE */}

      {tab === "crypto" && (

        <div className="market-table1">

          <div className="table-head">

            <span>Asset</span>
            <span>Price</span>
            <span>24h</span>
            <span>Market Cap</span>
            <span>Chart</span>

          </div>

          {sortedCrypto.map((coin)=>{

            const sparkData =
              coin.sparkline_in_7d?.price?.map(p=>({price:p})) || [];

            return(

              <div
                key={coin.id}
                className="table-row"
                onClick={()=>openAsset("crypto",coin.id)}
              >

                <div className="asset-info">

                  <img src={coin.image} alt={coin.name}/>

                  <div>
                    <strong>{coin.name}</strong>
                    <p>{coin.symbol.toUpperCase()}</p>
                  </div>

                </div>

                <span>${coin.current_price?.toLocaleString()}</span>

                <span className={coin.price_change_percentage_24h >=0 ? "green":"red"}>
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>

                <span>${coin.market_cap?.toLocaleString()}</span>

                <div className="sparkline">

                  {sparkData.length > 0 && (

                    <ResponsiveContainer width={100} height={40}>

                      <LineChart data={sparkData}>

                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={coin.price_change_percentage_24h >=0 ? "#16c784":"#ea3943"}
                          dot={false}
                          strokeWidth={2}
                        />

                      </LineChart>

                    </ResponsiveContainer>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      )}

      {/* STOCKS */}

      {tab === "stocks" && (

        <div className="market-grid">

          {filteredStocks.map(stock=>{

            const change = Number(stock.change || 0);

            return(

              <div
                key={stock.symbol}
                className="stock-card"
                onClick={()=>openAsset("stock",stock.symbol)}
              >

                <h3>{stock.symbol}</h3>

                <p>${Number(stock.price).toFixed(2)}</p>

                <span className={change >=0 ? "green":"red"}>
                  {change.toFixed(2)}%
                </span>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );

}