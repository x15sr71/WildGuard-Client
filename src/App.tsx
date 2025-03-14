import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
//import { VolunteerLoginForm } from "./components/ui/volunteerLoginForm"; // Ensure correct import
import { HomePage } from "./components/ui/homePage"; // A placeholder for your home page
import VolunteerDashboard from "./components/ui/volunteerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/volunteer-login" element={<VolunteerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
