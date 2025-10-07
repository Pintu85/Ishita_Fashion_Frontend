import { Suspense, lazy } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";


// A simple loading component to show while the chunk is being downloaded
const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen w-full">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
    </div>
);

const AppRoutes = () => {
    return (
        <Router>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>


                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;
