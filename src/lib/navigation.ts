// Utilitário para gerenciar URLs base entre desenvolvimento e produção
// Em dev: usa rotas locais
// Em prod: redireciona para o domínio do cliente

const PRODUCTION_BASE_URL = 'https://marioaragao.com';

/**
 * Retorna a URL base apropriada para o ambiente atual.
 * Em desenvolvimento, retorna string vazia (rotas locais).
 * Em produção, retorna o domínio do cliente.
 */
export function getBaseUrl(): string {
  return import.meta.env.DEV ? '' : PRODUCTION_BASE_URL;
}

/**
 * Constrói uma URL completa para navegação.
 * @param path - O caminho da rota (ex: '/imoveis', '/imovel')
 * @param params - Parâmetros de query string opcionais
 */
export function buildUrl(path: string, params?: Record<string, string>): string {
  const baseUrl = getBaseUrl();
  const url = new URL(path, baseUrl || window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return baseUrl ? url.toString() : url.pathname + url.search;
}

/**
 * Navega para uma rota interna do widget.
 * @param path - O caminho da rota
 * @param params - Parâmetros de query string opcionais
 */
export function navigateTo(path: string, params?: Record<string, string>): void {
  window.location.href = buildUrl(path, params);
}
