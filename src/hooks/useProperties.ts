import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Property, PropertyFilters } from '../types/property';

// Hook to fetch all properties with optional filters
export function useProperties(filters?: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('imoveis')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.tipo) {
        query = query.eq('tipo', filters.tipo);
      }
      if (filters?.cidade) {
        query = query.eq('cidade', filters.cidade);
      }
      if (filters?.precoMin) {
        query = query.gte('valor', filters.precoMin);
      }
      if (filters?.precoMax) {
        query = query.lte('valor', filters.precoMax);
      }
      // Text search - busca no título
      if (filters?.busca) {
        query = query.ilike('titulo', `%${filters.busca}%`);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      setProperties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  }, [filters?.tipo, filters?.cidade, filters?.precoMin, filters?.precoMax, filters?.busca]);

  // Fetch distinct cities for filter dropdown
  const fetchCities = useCallback(async () => {
    try {
      const { data, error: queryError } = await supabase
        .from('imoveis')
        .select('cidade')
        .order('cidade');

      if (queryError) throw queryError;

      const uniqueCities = [...new Set(data?.map(item => item.cidade).filter(Boolean))] as string[];
      setCities(uniqueCities);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    fetchCities();
  }, [fetchProperties, fetchCities]);

  return {
    properties,
    loading,
    error,
    cities,
    refetch: fetchProperties
  };
}

// Hook to fetch a single property by ID
export function useProperty(id: string | null) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('ID do imóvel não fornecido');
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from('imoveis')
          .select('*')
          .eq('id', id)
          .single();

        if (queryError) {
          throw queryError;
        }

        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar imóvel');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
}
