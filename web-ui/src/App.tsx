import './App.css'
import { predefinedTemplates } from './lib/AgentTemplates'
import { AlphaStudio } from './pages/AlphaStudio'

function App() {

  const agent = predefinedTemplates[0].config

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'red' }}>
      <AlphaStudio agent={agent} />
    </div>
  )
}

export default App
