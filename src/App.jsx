import '../src/index.css';
import { FarmaciaBuscador } from './components/FarmaciaBuscador.jsx';
import { FarmaciaTablaCompleta } from './components/FarmaciaTablaCompleta';
import { RegionesGrid } from './components/RegionesGrid.jsx';

function App() {
  return (
    <div className="max-w-4xl mx-auto font-montserrat">
      <FarmaciaBuscador />
      <RegionesGrid />
    </div>
  );
}

export default App;
