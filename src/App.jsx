import '../src/index.css';
import { FarmaciaBuscador } from './components/FarmaciaBuscador.jsx';
import { FarmaciaTablaCompleta } from './components/FarmaciaTablaCompleta';

function App() {
  return (
    <div className="max-w-4xl mx-auto font-montserrat">
      <FarmaciaBuscador />
    </div>
  );
}

export default App;
