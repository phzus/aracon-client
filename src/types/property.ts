// Property type definition based on common real estate database structure
export interface Property {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'venda' | 'aluguel';
  status?: string;
  finalidade?: string;
  cidade: string;
  estado?: string;
  bairro?: string;
  logradouro?: string;
  endereco?: string;
  valor: number;
  area_util?: number;
  area_total?: number;
  dormitorios?: number;
  suites?: number;
  banheiros?: number;
  vagas?: number;
  vagas_garagem?: number;
  pavimentos?: number;
  ano_construcao?: number;
  imagens?: string[];
  imagem_principal?: string;
  galeria_imagens?: string[];
  caracteristicas?: string[];
  caracteristicas_detalhadas?: { icone: string; texto: string }[];
  localizacao?: string;
  sobre_o_imovel?: string;
  resumo_caracteristicas?: string;
  financeiro?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFilters {
  tipo?: 'venda' | 'aluguel' | '';
  cidade?: string;
  precoMin?: number;
  precoMax?: number;
  busca?: string;
}
