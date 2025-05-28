import './App.css'
import ClientDashboard from './pages/client'
import LoginPage from './pages/LoginPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Support from './pages/Support';
import TicketDetails from './pages/TicketDetails';


function App() {
  

  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/support" element={<Support />} />
      <Route path="/ticket-details" element={<TicketDetails />} />
    </Routes>
  </Router>
  )
}

export default App
