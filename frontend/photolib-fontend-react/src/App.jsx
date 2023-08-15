import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ProfileDashboard from './pages/ProfileDashboard';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';

function App() {
  
  return (
    <>
      <div className='App'>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/register' element={<RegistrationPage/>} />
            <Route index path='/' element={<ProfileDashboard/>} />
          </Routes>
        </BrowserRouter>
      </div>
      
    </>
  );
}

export default App;
