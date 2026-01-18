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
  banheiros?: number;
  vagas?: number;
  vagas_garagem?: number;
  imagens?: string[];
  imagem_principal?: string; // Mantendo para compatibilidade, mas o correto é usar imagens[0]
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
