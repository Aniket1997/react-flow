
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Flow from './flow/Flow';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/create-roadmap' element={<Flow/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
