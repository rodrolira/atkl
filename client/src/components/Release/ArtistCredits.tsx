import React, { useMemo } from 'react';
import { Autocomplete, Chip, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Artist } from '@/types/interfaces/Artist';
import { creditosSinFicha, unirCreditos } from '@/utils/creditos';

interface ArtistCreditsProps {
  artists: Artist[];
  artistIds: number[];
  credit: string;
  setFieldValue: (campo: string, valor: unknown) => void;
}

/**
 * Un solo campo para los dos tipos de artista de un lanzamiento.
 *
 * Las opciones son las fichas que hay en la base (las que dan el link en la
 * tarjeta) y además se puede escribir cualquier nombre y apretar Enter: 13 de
 * los 15 lanzamientos del catálogo son de invitados que no son parte de ATKL y
 * no corresponde crearles ficha. Antes el campo era un desplegable cerrado:
 * solo se podía elegir entre las fichas existentes.
 *
 * Mantiene dos campos del formulario a la vez: `artist_id` con las fichas
 * elegidas y `artist_credit` con la línea de crédito completa.
 */
const ArtistCredits: React.FC<ArtistCreditsProps> = ({
  artists,
  artistIds,
  credit,
  setFieldValue,
}) => {
  const { t } = useTranslation();

  const seleccion = useMemo(() => {
    const conFicha = artists.filter((artista) => artistIds.includes(artista.id));
    return [...conFicha, ...creditosSinFicha(credit, conFicha)];
  }, [artists, artistIds, credit]);

  const aplicar = (valores: (Artist | string)[]) => {
    // Un nombre tipeado que coincide con una ficha se guarda como esa ficha: de
    // lo contrario el artista quedaba acreditado pero sin link y nada avisaba.
    const normalizados = valores.map((valor) => {
      if (typeof valor !== 'string') return valor;
      const nombre = valor.trim().toLowerCase();
      return artists.find((a) => a.artist_name.trim().toLowerCase() === nombre) ?? valor.trim();
    });

    const fichas = normalizados.filter((valor): valor is Artist => typeof valor !== 'string');
    const libres = normalizados.filter((valor): valor is string => typeof valor === 'string');

    setFieldValue('artist_id', fichas.map((artista) => artista.id));
    setFieldValue(
      'artist_credit',
      unirCreditos([...fichas.map((artista) => artista.artist_name), ...libres])
    );
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      id="artist_credit"
      options={artists}
      value={seleccion}
      onChange={(_, valores) => aplicar(valores as (Artist | string)[])}
      getOptionLabel={(opcion) => (typeof opcion === 'string' ? opcion : opcion.artist_name)}
      isOptionEqualToValue={(opcion, valor) =>
        typeof opcion !== 'string' && typeof valor !== 'string' && opcion.id === valor.id
      }
      filterSelectedOptions
      renderTags={(valores, getTagProps) =>
        valores.map((valor, index) => {
          const sinFicha = typeof valor === 'string';
          return (
            <Chip
              {...getTagProps({ index })}
              key={sinFicha ? valor : valor.id}
              label={sinFicha ? valor : valor.artist_name}
              size="small"
              // El invitado se distingue a simple vista del artista del sello:
              // su nombre no tiene página a la que enlazar.
              variant={sinFicha ? 'outlined' : 'filled'}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('editRelease.artists')}
          placeholder={t('editRelease.artistsPlaceholder')}
          helperText={t('editRelease.artistsHelp')}
          variant="outlined"
        />
      )}
    />
  );
};

export default ArtistCredits;
