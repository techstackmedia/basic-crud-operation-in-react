import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cards from './Cards';
import { CardContextProvider } from './context';

const App = () => {
    return (
        <CardContextProvider>
            <Router>
                <Routes>
                    <Route index element={<Cards />} />
                </Routes>
            </Router>
        </CardContextProvider>
    );
};

export default App;
