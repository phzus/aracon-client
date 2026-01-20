import { useState } from 'react';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from './PropertyCard';
import { PropertyFiltersComponent } from './PropertyFilters';
import type { PropertyFilters } from '../types/property';

export function PropertyGrid() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { properties, loading, error, cities } = useProperties(filters);

  if (error) {
    return (
      <div className="ma:min-h-[400px] ma:flex ma:flex-col ma:items-center ma:justify-center ma:text-center ma:p-8">
        <div className="ma:w-16 ma:h-16 ma:mb-4 ma:text-red-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="ma:text-lg ma:font-semibold ma:text-gray-900 ma:mb-2">
          Erro ao carregar imóveis
        </h3>
        <p className="ma:text-gray-500 ma:mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary ma:px-6 ma:py-2 ma:text-sm ma:font-medium ma:text-white ma:rounded-lg"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="main-container ma:px-5 sm:ma:px-0">
      {/* Header */}


      {/* Filters */}
      <PropertyFiltersComponent
        filters={filters}
        onFilterChange={setFilters}
        cities={cities}
      />

      {/* Loading State */}
      {loading && (
        <div className="property-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="ma:bg-white ma:rounded-2xl ma:shadow-lg ma:overflow-hidden">
              <div className="skeleton ma:aspect-[4/3]"></div>
              <div className="ma:p-5">
                <div className="skeleton ma:h-6 ma:rounded ma:mb-3"></div>
                <div className="skeleton ma:h-4 ma:w-2/3 ma:rounded ma:mb-3"></div>
                <div className="ma:flex ma:gap-3 ma:mb-4">
                  <div className="skeleton ma:h-4 ma:w-16 ma:rounded"></div>
                  <div className="skeleton ma:h-4 ma:w-16 ma:rounded"></div>
                </div>
                <div className="ma:flex ma:justify-between ma:items-center">
                  <div className="skeleton ma:h-8 ma:w-28 ma:rounded"></div>
                  <div className="skeleton ma:h-10 ma:w-24 ma:rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Properties Grid */}
      {!loading && properties.length > 0 && (
        <>
          <p className="ma:text-sm ma:text-gray-500 ma:mb-4">
            {properties.length} {properties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>
          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && properties.length === 0 && (
        <div className="ma:min-h-[400px] ma:flex ma:flex-col ma:items-center ma:justify-center ma:text-center ma:p-8 ma:bg-white ma:rounded-2xl ma:shadow-md">
          <div className="ma:w-20 ma:h-20 ma:mb-6 ma:text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="ma:text-xl ma:font-semibold ma:text-gray-900 ma:mb-2">
            Nenhum imóvel encontrado
          </h3>
          <p className="ma:text-gray-500 ma:mb-4 ma:max-w-md">
            Não encontramos imóveis com os filtros selecionados. Tente ajustar os critérios de busca.
          </p>
          <button
            onClick={() => setFilters({})}
            className="ma:px-6 ma:py-2 ma:text-sm ma:font-medium ma:text-blue-600 ma:border ma:border-blue-600 ma:rounded-lg hover:ma:bg-blue-50 ma:transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
