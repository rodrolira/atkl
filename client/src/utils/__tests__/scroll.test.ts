import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrollearASeccion } from '../scroll';

/** Deja correr `n` frames de requestAnimationFrame. */
const avanzarFrames = async (n: number) => {
  for (let i = 0; i < n; i += 1) {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  }
};

const montarSeccion = (id: string) => {
  const seccion = document.createElement('section');
  seccion.id = id;
  // jsdom no implementa scrollIntoView: sin el stub, el intento explota.
  seccion.scrollIntoView = vi.fn();
  document.body.appendChild(seccion);
  return seccion;
};

describe('scrollearASeccion', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('scrollea enseguida si la sección ya está montada', () => {
    const seccion = montarSeccion('releases');

    scrollearASeccion('releases');

    expect(seccion.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  // El caso real: se llega desde otra ruta y el chunk lazy todavía no bajó.
  it('espera a que la sección aparezca y recién ahí scrollea', async () => {
    scrollearASeccion('releases');

    await avanzarFrames(3);
    const seccion = montarSeccion('releases');
    expect(seccion.scrollIntoView).not.toHaveBeenCalled();

    await avanzarFrames(3);
    expect(seccion.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  // Sin esto, salir del Home mientras se espera scrollearía la página nueva.
  it('no scrollea si se canceló antes de que apareciera', async () => {
    const cancelar = scrollearASeccion('releases');

    cancelar();
    const seccion = montarSeccion('releases');
    await avanzarFrames(5);

    expect(seccion.scrollIntoView).not.toHaveBeenCalled();
  });

  it('scrollea una sola vez', async () => {
    const seccion = montarSeccion('releases');

    scrollearASeccion('releases');
    await avanzarFrames(5);

    expect(seccion.scrollIntoView).toHaveBeenCalledTimes(1);
  });
});
