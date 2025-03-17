// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/ui/layout";
import { HomePage } from "./components/ui/homePage";
import { ResultView } from "./components/ui/resultView"
import { VolunteerLoginForm } from "./components/ui/volunteerLoginForm";
import VolunteerDashboard from "./components/ui/volunteerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultView />} />
          <Route path="/volunteer-login" element={<VolunteerLoginForm />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
