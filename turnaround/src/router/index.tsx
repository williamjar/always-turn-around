import {createBrowserRouter} from "react-router-dom";
import HomePage from "../pages/Home/Home";
import SlotPage from "../pages/Slot/Slot";

export default createBrowserRouter([
    {path: "/", element: <HomePage/>},
    {path: "/spinner", element: <SlotPage/>}
])
