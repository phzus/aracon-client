import { useState } from 'react';
import { useProperty } from '../hooks/useProperties';
import { navigateTo } from '../lib/navigation';
import * as LucideIcons from 'lucide-react';
import SyncedGallery from './SyncedGallery';

interface PropertyDetailsProps {
  id: string;
}

type TabType = 'descricao' | 'localizacao' | 'resumo';

// Helper function to safely render any value as a string
// Prevents React crash when Supabase returns objects/arrays instead of strings
// Returns empty string for empty objects {}, empty arrays [], or zero/empty values
const safeString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    // Treat '0', '00', or whitespace-only strings as empty
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === '0' || trimmed === '00') return '';
    return trimmed;
  }
  if (typeof value === 'number') {
    // Treat 0 as empty (indicates no data)
    if (value === 0) return '';
    return String(value);
  }
  if (typeof value === 'object') {
    // Check if it's an empty object or empty array
    if (Array.isArray(value) && value.length === 0) return '';
    if (Object.keys(value as object).length === 0) return '';
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }
  return String(value);
};

// Helper to check if a JSONB value has real content (not empty object/array)
const hasContent = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as object).length > 0;
  return Boolean(value);
};

export function PropertyDetails({ id }: PropertyDetailsProps) {
  const { property, loading, error } = useProperty(id);
  const [activeTab, setActiveTab] = useState<TabType>('descricao');

  const formatPrice = (price: number, tipo: string) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return tipo === 'aluguel' ? `${formatted}/mês` : formatted;
  };

  const goBack = () => {
    navigateTo('/imoveis');
  };

  // Get all images from property
  const getAllImages = () => {
    const images: string[] = [];
    if (property?.imagens && property.imagens.length > 0) {
      images.push(...property.imagens);
    } else if (property?.imagem_principal) {
      images.push(property.imagem_principal);
    }
    if (property?.galeria_imagens) {
      images.push(...property.galeria_imagens.filter(img => !images.includes(img)));
    }
    return images.length > 0 ? images : ['https://placehold.co/800x600/e2e8f0/64748b?text=Sem+Imagem'];
  };

  // Loading State
  if (loading) {
    return (
      <div className="main-container">
        <div className="skeleton ma:h-8 ma:w-32 ma:rounded ma:mb-6"></div>
        <div className="ma:grid ma:grid-cols-1 lg:ma:grid-cols-[2fr_1fr] ma:gap-8">
          <div className="ma:space-y-6">
            <div className="skeleton ma:aspect-[16/10] ma:rounded-2xl"></div>
            <div className="ma:flex ma:gap-2">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="skeleton ma:w-20 ma:h-16 ma:rounded-lg"></div>
              ))}
            </div>
            <div className="skeleton ma:h-12 ma:rounded-lg"></div>
            <div className="skeleton ma:h-32 ma:rounded-lg"></div>
          </div>
          <div className="skeleton ma:h-96 ma:rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !property) {
    return (
      <div className="main-container">
        <div className="ma:min-h-[400px] ma:flex ma:flex-col ma:items-center ma:justify-center ma:text-center ma:p-8 ma:bg-white ma:rounded-2xl ma:shadow-md">
          <div className="ma:w-16 ma:h-16 ma:mb-4 ma:text-red-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="ma:text-lg ma:font-semibold ma:text-gray-900 ma:mb-2">
            Imóvel não encontrado
          </h3>
          <p className="ma:text-gray-500 ma:mb-4">
            {error || 'O imóvel que você está procurando não existe ou foi removido.'}
          </p>
          <button
            onClick={goBack}
            className="btn-primary ma:px-6 ma:py-2 ma:text-sm ma:font-medium ma:text-white ma:rounded-lg"
          >
            Ver todos os imóveis
          </button>
        </div>
      </div>
    );
  }

  const images = getAllImages();

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'descricao':
        return (
          <div className="ma:text-gray-600 ma:leading-relaxed ma:whitespace-pre-line">
            {safeString(property.descricao) || safeString(property.sobre_o_imovel) || 'Descrição não disponível para este imóvel.'}
          </div>
        );
      case 'localizacao':
        const hasLocationData = property.logradouro || property.bairro || property.cidade || property.localizacao;
        return (
          <div className="ma:space-y-3">
            {property.logradouro && (
              <div className="ma:flex ma:items-start ma:gap-3">
                <span className="ma:font-medium ma:text-gray-700 ma:min-w-[100px]">Endereço:</span>
                <span className="ma:text-gray-600">{safeString(property.logradouro)}</span>
              </div>
            )}
            {property.bairro && (
              <div className="ma:flex ma:items-start ma:gap-3">
                <span className="ma:font-medium ma:text-gray-700 ma:min-w-[100px]">Bairro:</span>
                <span className="ma:text-gray-600">{safeString(property.bairro)}</span>
              </div>
            )}
            {property.cidade && (
              <div className="ma:flex ma:items-start ma:gap-3">
                <span className="ma:font-medium ma:text-gray-700 ma:min-w-[100px]">Cidade:</span>
                <span className="ma:text-gray-600">{safeString(property.cidade)}{property.estado ? ` - ${safeString(property.estado)}` : ''}</span>
              </div>
            )}
            {hasContent(property.localizacao) && typeof property.localizacao === 'object' && (
              <div className="ma:mt-4 ma:p-4 ma:bg-gray-50 ma:rounded-lg ma:space-y-2">
                {Object.entries(property.localizacao as Record<string, unknown>)
                  .filter(([, val]) => val && safeString(val))
                  .map(([key, val]) => (
                    <div key={key} className="ma:flex ma:items-start ma:gap-3">
                      <span className="ma:font-medium ma:text-gray-700 ma:min-w-[100px] ma:capitalize">{key}:</span>
                      <span className="ma:text-gray-600">{safeString(val)}</span>
                    </div>
                  ))}
              </div>
            )}
            {!hasLocationData && (
              <p className="ma:text-gray-500 ma:italic">Informações de localização não disponíveis.</p>
            )}
          </div>
        );
      case 'resumo':
        // Build array of characteristics that have values
        const caracteristicasResumo: { label: string; value: string }[] = [];

        if (property.area_util && property.area_util > 0) {
          caracteristicasResumo.push({ label: 'Área Útil', value: `${property.area_util}m²` });
        }
        if (property.area_total && property.area_total > 0) {
          caracteristicasResumo.push({ label: 'Área Total', value: `${property.area_total}m²` });
        }
        if (property.dormitorios && property.dormitorios > 0) {
          caracteristicasResumo.push({ label: 'Dormitórios', value: String(property.dormitorios) });
        }
        if (property.suites && property.suites > 0) {
          caracteristicasResumo.push({ label: 'Suítes', value: String(property.suites) });
        }
        if (property.banheiros && property.banheiros > 0) {
          caracteristicasResumo.push({ label: 'Banheiros', value: String(property.banheiros) });
        }
        const vagasTotal = property.vagas_garagem ?? property.vagas ?? 0;
        if (vagasTotal > 0) {
          caracteristicasResumo.push({ label: 'Vagas Garagem', value: String(vagasTotal) });
        }
        if (property.pavimentos && property.pavimentos > 0) {
          caracteristicasResumo.push({ label: 'Pavimentos', value: String(property.pavimentos) });
        }
        if (property.ano_construcao && property.ano_construcao > 0) {
          caracteristicasResumo.push({ label: 'Ano Construção', value: String(property.ano_construcao) });
        }

        // If no characteristics have values, return empty/nothing
        if (caracteristicasResumo.length === 0) {
          return null;
        }

        return (
          <div className="ma:grid ma:grid-cols-2 sm:ma:grid-cols-3 lg:ma:grid-cols-4 ma:gap-4">
            {caracteristicasResumo.map((item, index) => (
              <div key={index} className="ma:bg-gray-50 ma:rounded-lg ma:p-4 ma:text-center">
                <div className="ma:text-xl ma:font-bold ma:text-gray-900">{item.value}</div>
                <div className="ma:text-sm ma:text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Render Lucide icon dynamically by name from Supabase
  const renderLucideIcon = (iconName: string) => {
    // Get the icon component from lucide-react by name
    const IconComponent = (LucideIcons as any)[iconName];

    if (IconComponent) {
      return <IconComponent className="ma:w-5 ma:h-5" />;
    }

    // Fallback to Circle if icon not found
    return <LucideIcons.Circle className="ma:w-5 ma:h-5" />;
  };

  return (
    <div className="main-container">
      {/* Back Button */}
      <div className="ma:px-5 lg:ma:px-0">
        <button
          onClick={goBack}
          className="ma:flex ma:items-center ma:gap-2 ma:text-gray-600 hover:ma:text-gray-900 ma:mb-5 ma:transition-colors ma:cursor-pointer"
        >
          <svg className="ma:w-5 ma:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="ma:font-medium">Voltar</span>
        </button>
      </div>

      {/* Main Content - Two Columns */}
      <div className="property-details-layout">

        {/* LEFT COLUMN - Gallery, Tabs, Features */}
        <div className="property-details-left ma:space-y-8">

          {/* Section 1: Dynamic Gallery */}
          <SyncedGallery images={images} title={property.titulo} />

          {/* Mobile Info Card - Oculto no desktop */}
          <div className="mobile-info-card ma:px-5 lg:ma:px-0">
            <div className="property-details-sticky ma:space-y-5">
              {/* Status Badge */}
              <span className="ma:inline-block ma:px-3 ma:py-1 ma:font-regular ma:text-gray-800 ma:uppercase ma:tracking-wide ma:text-[13px] ma:rounded-sm" style={{ backgroundColor: '#e5e7eb' }}>
                {property.status || property.finalidade || (property.tipo === 'venda' ? 'Venda' : 'Aluguel')}
              </span>
              {/* Title */}
              <h1 className="sidebar-title ma:font-bold ma:text-gray-900">
                {property.titulo}
              </h1>
              {/* Location */}
              <div className="ma:flex ma:items-center ma:gap-2 ma:text-gray-600">
                <svg className="ma:w-4 ma:h-4 ma:flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="ma:text-base">{property.cidade}{property.estado ? ` - ${property.estado}` : ''}</span>
              </div>
              {/* Divider */}
              <div className="ma:border-t ma:border-gray-200"></div>
              {/* Price */}
              <div style={{ marginBottom: '32px' }}>
                <span style={{ marginBottom: '10px', display: 'block' }} className="ma:text-[13px] ma:text-gray-500 ma:uppercase ma:tracking-wider ma:font-medium">Valor do imóvel</span>
                <div className="price-display ma:text-4xl ma:font-bold" style={{ color: '#000000' }}>
                  {formatPrice(property.valor, property.tipo)}
                </div>
              </div>
              {/* CTA Buttons */}
              <div className="ma:space-y-3">
                <a
                  href={`https://wa.me/5511999339979?text=Olá! Tenho interesse no imóvel: ${property.titulo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp ma:w-full ma:flex ma:items-center ma:justify-center ma:gap-2 ma:px-6 ma:py-5 ma:text-white ma:font-semibold ma:rounded-lg ma:transition-all ma:cursor-pointer ma:uppercase"
                >
                  <svg className="ma:w-5 ma:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Tabs "Sobre o Imóvel" */}
          <div className="ma:px-5 lg:ma:px-0">
            <h2 className="section-title ma:mb-6">Sobre o Imóvel</h2>
            {/* Tab Headers */}
            <div className="ma:flex ma:border-b ma:border-gray-300">
              {[
                { id: 'descricao', label: 'Descrição' },
                { id: 'localizacao', label: 'Localização' },
                { id: 'resumo', label: 'Resumo' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`ma:flex-1 ma:px-4 ma:py-4 ma:text-sm ma:font-medium ma:transition-all ma:cursor-pointer ${
                    activeTab === tab.id
                      ? 'ma:text-blue-600 ma:border-b-2 ma:border-blue-600 ma:bg-blue-50'
                      : 'ma:text-gray-500 hover:ma:text-gray-700 hover:ma:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="ma:py-6">
              {renderTabContent()}
            </div>
          </div>

          {/* Section 3: Detailed Features Grid */}
          {property.caracteristicas_detalhadas && property.caracteristicas_detalhadas.length > 0 && (
            <div className="ma:px-5 lg:ma:px-0">
              <h2 className="section-title ma:mb-6">Características do Imóvel</h2>
              <div className="features-grid">
                {property.caracteristicas_detalhadas.map((feature, index) => (
                  <div
                    key={index}
                    className="ma:flex ma:items-center ma:gap-4 ma:p-3 ma:bg-white ma:rounded-xl ma:shadow-sm"
                  >
                    <div className="feature-icon-container ma:flex-shrink-0 ma:w-11 ma:h-11 ma:flex ma:items-center ma:justify-center ma:rounded-lg">
                      {renderLucideIcon(feature.icone)}
                    </div>
                    <span className="ma:text-md ma:font-medium ma:text-gray-700">{feature.texto}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Sticky Info Card (Desktop only) */}
        <div className="property-details-right">
          <div className="property-details-sticky ma:space-y-5">
            {/* Status Badge - cinza claro com texto preto */}
            <span className="ma:inline-block ma:px-3 ma:py-1 ma:font-regular ma:text-gray-800 ma:uppercase ma:tracking-wide ma:text-[13px] ma:rounded-sm" style={{ backgroundColor: '#e5e7eb' }}>
              {property.status || property.finalidade || (property.tipo === 'venda' ? 'Venda' : 'Aluguel')}
            </span>

            {/* Title - aumentado 4px */}
            <h1 className="sidebar-title ma:font-bold ma:text-gray-900">
              {property.titulo}
            </h1>

            {/* Location - cidade - UF, ícone menor */}
            <div className="ma:flex ma:items-center ma:gap-2 ma:text-gray-600">
              <svg className="ma:w-4 ma:h-4 ma:flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="ma:text-base">
                {property.cidade}{property.estado ? ` - ${property.estado}` : ''}
              </span>
            </div>

            {/* Divider */}
            <div className="ma:border-t ma:border-gray-200"></div>

            {/* Price - label uppercase, valor preto */}
            <div style={{ marginBottom: '32px' }}>
              <span style={{ marginBottom: '10px', display: 'block' }} className="ma:text-[13px] ma:text-gray-500 ma:uppercase ma:tracking-wider ma:font-medium">Valor do imóvel</span>
              <div className="price-display ma:text-4xl ma:font-bold" style={{ color: '#000000' }}>
                {formatPrice(property.valor, property.tipo)}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="ma:space-y-3">
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/5511999339979?text=Olá! Tenho interesse no imóvel: ${property.titulo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp ma:w-full ma:flex ma:items-center ma:justify-center ma:gap-2 ma:px-6 ma:py-[18px] ma:text-white ma:font-semibold ma:rounded-lg ma:transition-all ma:cursor-pointer ma:uppercase"
              >
                <svg className="ma:w-5 ma:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
