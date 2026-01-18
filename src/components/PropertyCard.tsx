import type { Property } from '../types/property';
import { navigateTo } from '../lib/navigation';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, tipo: string) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return tipo === 'aluguel' ? `${formatted}/mês` : formatted;
  };

  const handleViewDetails = () => {
    navigateTo('/imovel', { id: property.id });
  };

  return (
    <div className="property-card ma:bg-white ma:overflow-hidden ma:transition-all ma:duration-300 hover:ma:shadow-xl hover:ma:-translate-y-1 ma:flex ma:flex-col" style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
      {/* Image Container */}
      <div className="ma:relative ma:overflow-hidden ma:aspect-[4/3]">
        <img
          src={property.imagens?.[0] || property.imagem_principal || 'https://placehold.co/600x400/e2e8f0/64748b?text=Sem+Imagem'}
          alt={property.titulo}
          className="property-image ma:w-full ma:h-full ma:object-cover"
          loading="lazy"
        />
        {/* Type Badge - Dark blue, positioned on left, pill shape */}
        <span className="badge-type ma:absolute ma:top-4 ma:left-4 ma:px-3 ma:py-1 ma:font-semibold ma:text-white ma:uppercase ma:tracking-wide">
          {property.status || property.finalidade || (property.tipo === 'venda' ? 'Venda' : 'Aluguel')}
        </span>
      </div>

      {/* Content */}
      <div className="ma:p-5 ma:flex ma:flex-col ma:flex-1">
        {/* Title - Playfair Display */}
        <h3 className="property-card-title ma:text-xl ma:font-bold ma:text-gray-900 ma:mb-3 ma:line-clamp-2">
          {property.titulo}
        </h3>

        {/* Location */}
        <div className="ma:flex ma:items-center ma:gap-1.5 ma:text-gray-500 ma:text-sm ma:mb-4">
          <svg className="ma:w-4 ma:h-4 ma:flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="ma:truncate">
            {property.bairro ? `${property.bairro} • ${property.cidade}` : property.cidade}
          </span>
        </div>

        {/* Features - área total, quartos e vagas (só mostra se existir) */}
        {(property.area_total || property.dormitorios || property.vagas_garagem || property.vagas) && (
          <div className="ma:flex ma:items-center ma:gap-4 ma:text-gray-600 ma:text-sm ma:mb-4">
            {property.area_total && property.area_total > 0 && (
              <div className="ma:flex ma:items-center ma:gap-1">
                <svg className="ma:w-4 ma:h-4 feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{property.area_total}m²</span>
              </div>
            )}
            {property.dormitorios && property.dormitorios > 0 && (
              <div className="ma:flex ma:items-center ma:gap-1">
                <svg className="ma:w-4 ma:h-4 feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{property.dormitorios} {property.dormitorios === 1 ? 'quarto' : 'quartos'}</span>
              </div>
            )}
            {(property.vagas_garagem || property.vagas) && (property.vagas_garagem || property.vagas)! > 0 && (
              <div className="ma:flex ma:items-center ma:gap-1">
                <svg className="ma:w-4 ma:h-4 feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span>{property.vagas_garagem || property.vagas} {(property.vagas_garagem || property.vagas) === 1 ? 'vaga' : 'vagas'}</span>
              </div>
            )}
          </div>
        )}

        {/* Price & CTA - side by side, no divider */}
        <div className="ma:mt-auto ma:flex ma:items-center ma:justify-between ma:gap-3">
          <div className="price-display">
            <span className="ma:text-2xl ma:font-bold" style={{ color: '#1e293b' }}>
              {formatPrice(property.valor, property.tipo)}
            </span>
          </div>
          <button
            onClick={handleViewDetails}
            className="btn-primary ma:px-5 ma:py-2.5 ma:text-sm ma:font-bold ma:text-white ma:whitespace-nowrap"
            style={{ borderRadius: '8px' }}
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

