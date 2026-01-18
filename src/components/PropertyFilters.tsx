import type { PropertyFilters } from '../types/property';

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
  cities: string[];
}

const priceRanges = [
  { label: 'Qualquer preço', min: undefined, max: undefined },
  { label: 'Até R$ 200.000', min: undefined, max: 200000 },
  { label: 'R$ 200.000 - R$ 500.000', min: 200000, max: 500000 },
  { label: 'R$ 500.000 - R$ 1.000.000', min: 500000, max: 1000000 },
  { label: 'R$ 1.000.000 - R$ 2.000.000', min: 1000000, max: 2000000 },
  { label: 'Acima de R$ 2.000.000', min: 2000000, max: undefined },
];

export function PropertyFiltersComponent({ filters, onFilterChange, cities }: PropertyFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, busca: e.target.value || undefined });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, tipo: e.target.value as PropertyFilters['tipo'] });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, cidade: e.target.value || undefined });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    const range = priceRanges[index];
    onFilterChange({
      ...filters,
      precoMin: range.min,
      precoMax: range.max
    });
  };

  const getCurrentPriceIndex = () => {
    return priceRanges.findIndex(
      range => range.min === filters.precoMin && range.max === filters.precoMax
    );
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  // O botão "Limpar" externo só aparece se outros filtros estiverem ativos (não inclui busca, pois ela tem X próprio)
  const hasActiveFilters = filters.tipo || filters.cidade || filters.precoMin || filters.precoMax;

  return (
    <div className="ma:bg-white ma:rounded-xl ma:shadow-md ma:p-4 ma:mb-8">
      <div className="ma:flex ma:flex-wrap ma:items-center ma:gap-3">
        {/* Search Input - grows to fill available space */}
        <div className="ma:flex-1 ma:min-w-[200px]">
          <div className="ma:relative">
            <svg className="ma:absolute ma:left-3 ma:top-1/2 ma:-translate-y-1/2 ma:w-4 ma:h-4 ma:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filters.busca || ''}
              onChange={handleSearchChange}
              placeholder="Buscar imóveis..."
              className="ma:w-full ma:pl-10 ma:pr-10 ma:py-2.5 ma:border ma:border-gray-200 ma:rounded-lg ma:bg-gray-50 ma:text-gray-700 ma:text-sm focus:ma:outline-none focus:ma:ring-2 focus:ma:ring-blue-500 focus:ma:border-transparent ma:transition-all"
            />
            {/* Clear search button inside input */}
            {filters.busca && (
              <button
                onClick={() => onFilterChange({ ...filters, busca: undefined })}
                className="ma:absolute ma:right-2 ma:top-1/2 ma:-translate-y-1/2 ma:px-2 ma:py-1 ma:text-xs ma:font-medium ma:text-gray-500 hover:ma:text-gray-700 ma:bg-gray-200 hover:ma:bg-gray-300 ma:rounded ma:transition-all ma:cursor-pointer hover:ma:scale-105"
                type="button"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <select
          value={filters.tipo || ''}
          onChange={handleTypeChange}
          className="filter-select ma:px-4 ma:py-2.5 ma:border ma:border-gray-200 ma:rounded-lg ma:bg-gray-50 ma:text-gray-700 ma:text-sm focus:ma:outline-none focus:ma:ring-2 focus:ma:ring-blue-500 focus:ma:border-transparent ma:transition-all"
        >
          <option value="">Todos os tipos</option>
          <option value="venda">Venda</option>
          <option value="aluguel">Aluguel</option>
        </select>

        {/* City Filter */}
        <select
          value={filters.cidade || ''}
          onChange={handleCityChange}
          className="filter-select ma:px-4 ma:py-2.5 ma:border ma:border-gray-200 ma:rounded-lg ma:bg-gray-50 ma:text-gray-700 ma:text-sm focus:ma:outline-none focus:ma:ring-2 focus:ma:ring-blue-500 focus:ma:border-transparent ma:transition-all"
        >
          <option value="">Todas as cidades</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          value={getCurrentPriceIndex()}
          onChange={handlePriceChange}
          className="filter-select ma:px-4 ma:py-2.5 ma:border ma:border-gray-200 ma:rounded-lg ma:bg-gray-50 ma:text-gray-700 ma:text-sm focus:ma:outline-none focus:ma:ring-2 focus:ma:ring-blue-500 focus:ma:border-transparent ma:transition-all"
        >
          {priceRanges.map((range, index) => (
            <option key={index} value={index}>{range.label}</option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ma:px-4 ma:py-2.5 ma:text-sm ma:font-medium ma:text-gray-600 ma:bg-gray-100 ma:rounded-lg hover:ma:bg-gray-200 ma:transition-colors ma:flex ma:items-center ma:gap-2"
          >
            <svg className="ma:w-4 ma:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
