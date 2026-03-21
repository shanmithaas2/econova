import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CitizenDashboard from "./pages/CitizenDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import MunicipalDashboard from "./pages/MunicipalDashboard"
import RecyclerDashboard from "./pages/RecyclerDashboard"
import WasteGuide from "./pages/WasteGuide"
import SchedulePickup from "./pages/SchedulePickup"
import Complaints from "./pages/Complaints"
import CarbonCalculator from "./pages/CarbonCalculator"
import Rewards from "./pages/Rewards"
import NearbyPlaces from "./pages/NearbyPlaces"
import RouteOptimizer from "./pages/RouteOptimizer"
import ManagePickups from "./pages/ManagePickups"
import ManageComplaints from "./pages/ManageComplaints"
import ManageUsers from "./pages/ManageUsers"
import RecyclerRoutes from "./pages/RecyclerRoutes"
import Chatbot from "./components/Chatbot"
import Marketplace from "./pages/Marketplace"
import BinDashboard from "./pages/BinDashboard"

function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role")
  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/login" />
  if (role && userRole !== role) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/citizen-dashboard" element={<ProtectedRoute role="citizen"><CitizenDashboard /></ProtectedRoute>} />
        <Route path="/report-waste" element={<ProtectedRoute role="citizen"><WasteGuide /></ProtectedRoute>} />
        <Route path="/schedule-pickup" element={<ProtectedRoute role="citizen"><SchedulePickup /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute role="citizen"><Complaints /></ProtectedRoute>} />
        <Route path="/carbon-calculator" element={<ProtectedRoute role="citizen"><CarbonCalculator /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute role="citizen"><Rewards /></ProtectedRoute>} />
        <Route path="/nearby" element={<ProtectedRoute role="citizen"><NearbyPlaces /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/manage-users" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
        <Route path="/municipal-dashboard" element={<ProtectedRoute role="municipal"><MunicipalDashboard /></ProtectedRoute>} />
        <Route path="/route-optimizer" element={<ProtectedRoute role="municipal"><RouteOptimizer /></ProtectedRoute>} />
        <Route path="/manage-pickups" element={<ProtectedRoute role="municipal"><ManagePickups /></ProtectedRoute>} />
        <Route path="/manage-complaints" element={<ProtectedRoute role="municipal"><ManageComplaints /></ProtectedRoute>} />
        <Route path="/recycler-dashboard" element={<ProtectedRoute role="recycler"><RecyclerDashboard /></ProtectedRoute>} />
        <Route path="/recycler-routes" element={<ProtectedRoute role="recycler"><RecyclerRoutes /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute role="citizen"><Marketplace /></ProtectedRoute>} />
        <Route path="/bin-dashboard" element={<ProtectedRoute role="municipal"><BinDashboard /></ProtectedRoute>} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  )
}