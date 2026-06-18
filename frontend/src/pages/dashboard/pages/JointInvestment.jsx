import React, { useState } from "react";
import InvestmentCalculator from "./InvestmentCalculator";
import "./JointInvestments.css";

export default function JointInvestments() {
  const [selectedPlan, setSelectedPlan] = useState("individual");

  const plans = [
    { id: "individual", title: "Individual", min: "$100", rate: "8%" },
    { id: "joint", title: "Joint", min: "$500", rate: "10%", highlight: true },
    { id: "shares", title: "Shares", min: "$200k", rate: "12%" },
    { id: "longterm", title: "Long-Term", min: "$1,000", rate: "6%" },
  ];

  return (
    <div className="investment-page">

      {/* HERO */}
      <section className="investment-hero">
        <h1>Grow with Structured Monthly Returns</h1>
      </section>

      {/* PLANS */}
      <section className="plans-section">
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card 
                ${plan.highlight ? "featured" : ""} 
                ${selectedPlan === plan.id ? "selected" : ""}
              `}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.highlight && <div className="badge3">Popular</div>}

              <h3 className="plan-title">{plan.title}</h3>

              <p className="plan-rate">
                {plan.rate}
                <span>/month</span>
              </p>

              <p className="plan-min">Minimum {plan.min}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="calculator-section">
        <InvestmentCalculator selectedPlan={selectedPlan} />
      </section>

    </div>
  );
}