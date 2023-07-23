import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ProfileDashboard from './pages/ProfileDashboard';

function App() {
  return (
    <>
      <div className='App'>
        <BrowserRouter>
          <Routes>
            <Route index path='/' element={<ProfileDashboard/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
