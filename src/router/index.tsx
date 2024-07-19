import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Players from "../pages/players";
import ProtectedRoute from "../auth/ProtectedRoute";
import Trainer from "../pages/Trainer";
import LoginPage from "../pages/Login";


const email = "bCk2X@example.com";
const router = createBrowserRouter(
    createRoutesFromElements(
            <Route path="/"  element={<RootLayout />} >
                    <Route  path="login" index element={<ProtectedRoute
                    isAllowed={true}
                    redirectPath="/"
                    data={email}>
                        <LoginPage/>
                </ProtectedRoute>} />

                <Route  path="/" index element={<ProtectedRoute
                    isAllowed={true}
                    redirectPath="/"
                    data={email}>
                        <Players/>
                </ProtectedRoute>} />

                <Route path="trainers"  element={<ProtectedRoute
                    isAllowed={true}
                    redirectPath="/"
                    data={email}>
                        <Trainer/>
                </ProtectedRoute>} />

                

                

            </Route>


    )
)

export default router;
