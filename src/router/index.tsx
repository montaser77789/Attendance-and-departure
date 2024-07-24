import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Players from "../pages/players";
import ProtectedRoute from "../auth/ProtectedRoute";
import Trainer from "../pages/Trainer";
import LoginPage from "../pages/Login";
import PlayerDetails from "../pages/PlayerDeatels"; // Import the new component
import Cvilizedregion from "../pages/Cvilizedregion";
import DaysPage from "../pages/DaysPage";
import Cookies from "js-cookie";
import TrainerDeatels from "../pages/TrainerSeatels";
import PlayerAttendance from "../pages/PlayerAttendance";
import TrainerAttendance from "../pages/TrainerAttendance";
import Reports from "../pages/Audience";

const token = Cookies.get("access_token");
const Admin = Cookies.get("Admin") === "true"; // Convert to boolean
const isAuthenticated = !!token;
console.log(token, isAuthenticated, Admin);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route
        index
        path="/"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
            {Admin ? <Players /> : <Cvilizedregion />}
          </ProtectedRoute>
        }
      />
      <Route
        path="login"
        element={
          <ProtectedRoute isAllowed={!isAuthenticated} redirectPath="/">
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="trainers"
        element={
          <ProtectedRoute isAllowed={isAuthenticated && Admin} redirectPath="/civilizedregion">
            <Trainer />
          </ProtectedRoute>
        }
      />
      <Route
        path="civilizedregion"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
            <Cvilizedregion />
          </ProtectedRoute>
        }
      />
      <Route
        path="players/:playerId"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
            <PlayerDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="trainers/:trainerId"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
            <TrainerDeatels />
          </ProtectedRoute>
        }
      />
      <Route
        path="days/:monthId"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
            <DaysPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="dayes/:dayId/:monthId"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
            <PlayerAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="attendance/:dayId/:monthId"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
            <TrainerAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="Reports/:dayId/:monthId"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
            <Reports />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

export default router;
