import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import BottomNav from "./components/BottomNav"
import "./DashboardLayout.css";

export default function DashboardLayout() {

   const [drawerOpen, setDrawerOpen] = useState(false);
   
  return (
    <div className="layout">

      <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      
      <div className="main-area">
        <Topbar setDrawerOpen={setDrawerOpen} />
        <div className="page">
          <Outlet />
        </div>
      </div>

      <BottomNav/>
    </div>
  );
}