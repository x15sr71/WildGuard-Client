// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/ui/layout";
import { HomePage } from "./components/ui/homePage";
import { ResultView } from "./components/ui/resultView"
import { VolunteerLoginForm } from "./components/ui/volunteerLoginForm";
import VolunteerDashboard from "./components/ui/volunteerDashboard";
import { VolunteerSignupForm } from "./components/ui/signup";
import { VolunteerCompleteProfilePage } from "./components/ui/completeYourProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultView />} />
          <Route path="/volunteer-login" element={<VolunteerLoginForm />} />
          <Route path="/complete-profile" element={<VolunteerCompleteProfilePage />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard/>} />
          <Route path="/signup" element={<VolunteerSignupForm/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
