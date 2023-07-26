import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ProfileDashboard from './pages/ProfileDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  
  return (
    <>
    
      <div className='App'>
      
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<LoginPage/>} />
            <Route index path='/' element={<ProfileDashboard/>} />
          </Routes>
        </BrowserRouter>
      </div>
      
    </>
  );
}

export default App;
