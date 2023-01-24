import {createBrowserRouter} from "react-router-dom";
import HomePage from "../pages/Home";
import SlotPage from "../pages/Slot";

export default createBrowserRouter([
    {path: "/", element: <HomePage/>},
    {path: "/spinner", element: <SlotPage/>}
])
