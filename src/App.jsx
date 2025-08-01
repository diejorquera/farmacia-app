import '../src/index.css';
import { FarmaciaBuscador } from './assets/components/FarmaciaBuscador';
import { FarmaciaTablaCompleta } from './assets/components/FarmaciaTablaCompleta';

function App() {
  return (
    <div className="max-w-4xl mx-auto">
      <FarmaciaBuscador />
      <FarmaciaTablaCompleta />
    </div>
  );
}

export default App;
