import { 
  BrowserRouter as Router ,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { TextEditor } from "./TextEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Navigate to={`/documents/${uuidV4()}`} />}/>      
        <Route path="/documents/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
