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

  // Redirect /imovel (without ID) to /imoveis
  // Since this is a widget, we'll just render the grid, but technically we should treat it as 'imoveis'
  // The user specifically asked to "redirect", but simple rendering context switch is safer than window.location.href which might reload page
  // However, to strictly follow "redirect", we can use history.replaceState if we wanted to change URL,
  // but for now, ensuring it explicitly falls through to Grid logic or handling it explicitly is key.

  if (path.endsWith('/imovel') && !propertyId) {
    // If exact match (or ends with), and no ID, user wants 'imoveis' behavior
    // We can just fall through, BUT checking previous logic:
    // It was falling through to default.
    // User says "hoje o /imovel se comporta como o imoveis [...] isso teoricamente esta errado".
    // "então faça essa alteração" -> change check to be strict?

    // Actually, if the user wants it to NOT behave like imoveis, they might mean "redirect to correct URL"
    // OR "show error".
    // "hoje o /imovel se comporta como o imoveis [...] isso teoricamente esta errado"
    // "faça essa alteração" -> implies they WANT it to redirect.

    if (path.endsWith('/imovel')) {
        // Change URL to /imoveis without reload
        const newUrl = window.location.href.replace('/imovel', '/imoveis');
        window.history.replaceState({}, '', newUrl);
    }
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
