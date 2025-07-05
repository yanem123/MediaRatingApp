import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from './pages/NoPage';
import Profile from './pages/Profile';
import Header from './components/Header';
import Home from './pages/Home';
import { UserProvider }from './context/UserContext';


function App() {
    return (
      <UserProvider>
        <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />}/>
            <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
      </UserProvider>
  );
}

export default App;