import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ImageUploader from './components/ImageUploader/ImageUploader';
import RealTimeDetection from './components/RealtTimeDetection/RealTimeDetection';

function App() {
  return (
    <div className="App">
      <Header/>
      {/* <ImageUploader/> */}
      <RealTimeDetection/>
    </div>
  );
}

export default App;
