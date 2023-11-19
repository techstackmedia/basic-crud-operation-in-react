import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Cards from "./Cards"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route index element={<Cards />} />
            </Routes>
        </Router>
    )
}

export default App