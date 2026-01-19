import { PropertyGrid } from './components/PropertyGrid';
import { PropertyDetails } from './components/PropertyDetails';


function App() {
  // Get current path and query params
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get('id');

  // Route based on URL
  // If URL contains /imovel and has an id parameter, show property details
  if (path.includes('/imovel') && propertyId) {
    return (
      <div>
        <PropertyDetails id={propertyId} />
      </div>
    );
  }

  // If URL contains /imoveis or is at root, show property grid
  if (path.includes('/imoveis') || path === '/') {
    return (
      <div>
        <PropertyGrid />
      </div>
    );
  }

  // Default: show property grid
  return (
    <div>
      <PropertyGrid />
    </div>
  );
}

export default App;
