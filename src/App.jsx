import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import BillOfQuantities from "./pages/BillofQuantities";

function PageNotFound() {
  return <div className="p-6">404 - Page Not Found</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentPageName="Dashboard">
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/Dashboard"
          element={
            <Layout currentPageName="Dashboard">
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/Analytics"
          element={
            <Layout currentPageName="Analytics">
              <Analytics />
            </Layout>
          }
        />
        <Route
          path="/Projects"
          element={
            <Layout currentPageName="Projects">
              <Projects />
            </Layout>
          }
        />
        <Route
          path="/Tasks"
          element={
            <Layout currentPageName="Tasks">
              <Tasks />
            </Layout>
          }
        />
        <Route
          path="/Calendar"
          element={
            <Layout currentPageName="Calendar">
              <Calendar />
            </Layout>
          }
        />
        <Route
          path="/BillofQuantities"
          element={
            <Layout currentPageName="BillofQuantities">
              <BillOfQuantities />
            </Layout>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;