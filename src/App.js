import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ImageUploader from './components/ImageUploader/ImageUploader';
import RealTimeDetection from './components/RealtTimeDetection/RealTimeDetection';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RealTimeDetection/>}/>
          <Route path='/image' element={<ImageUploader/>}/>
          <Route path='/drone_detection' element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
