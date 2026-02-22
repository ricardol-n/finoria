import { FaUsers, FaChartLine, FaHandshake, FaShieldAlt } from "react-icons/fa";

export const menuData = {
  products: {
    title: "INVESTMENT PRODUCTS",
    items: [
      {
        icon: <FaChartLine />,
        title: "Investment Plans",
        desc: "Individual & joint investments"
      },
      {
        icon: <FaHandshake />,
        title: "Shares Ownership",
        desc: "Ownership interest from $200,000+"
      },
       {
        icon: <FaChartLine />,
        title: "Long-Term Growth",
        desc: "Stable monthly performance focus"
      },
      {
        icon: <FaShieldAlt />,
        title: "Capital Protection",
        desc: "Risk-managed investment structure"
      }
      

    ],
    cta: {
      title: "Shares Plan",
      desc: "Invest in Shares from anywhere",
      button: "Start Now"
    }
  },

  solutions: {
    title: "SOLUTIONS",
    items: [
      {
        icon: <FaUsers />,
        title: "Couples Investing",
        desc: "Spouse & partner investment plans"
      },
      {
        icon: <FaShieldAlt />,
        title: "Secure Growth",
        desc: "Capital protection & long-term returns"
      }
    ],
    cta: {
      title: "Joint Plan",
      desc: "Invest together from anywhere",
      button: "Start Now"
    }
  }
};
