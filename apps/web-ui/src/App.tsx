import './App.css'
import { AlphaStudio } from './pages/AlphaStudio'
import { ToastContainer } from 'react-toastify'
import { Routes, Route } from 'react-router'
import { ModelManager } from './pages/ModelManager'

function NotFound() {
  return <div style={{
    alignSelf: 'center'
  }}>Page not found</div>
}

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Routes>
        <Route path="/agent/:uuid" element={<AlphaStudio />} />
        <Route path="/" element={<AlphaStudio />} />
        <Route path="/models" element={<ModelManager />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
