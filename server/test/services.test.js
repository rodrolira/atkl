import { addRelease as svcAddRelease, getReleases as svcGetReleases, getReleaseById as svcGetReleaseById } from '../src/services/releaseService.js';
import { getAllGenres as svcGetAllGenres, getGenreById as svcGetGenreById } from '../src/services/genreService.js';

import Release from '../src/models/release.model.js';
import Genre from '../src/models/genre.model.js';
import Artist from '../src/models/artist.model.js';

jest.mock('../src/models/release.model.js');
jest.mock('../src/models/genre.model.js');
jest.mock('../src/models/artist.model.js');

describe('releaseService', () => {
  test('getReleases returns paginated releases', async () => {
    const mockReleases = [{ id: 1, title: 'Release 1' }];
    Release.findAndCountAll.mockResolvedValue({ count: 1, rows: mockReleases });

    const result = await svcGetReleases(1, 10);
    expect(result.releases).toEqual(mockReleases);
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
    expect(result.pagination.totalPages).toBe(1);
  });

  test('getReleaseById returns the release', async () => {
    const mockRelease = { id: 1, title: 'Release 1' };
    Release.findByPk.mockResolvedValue(mockRelease);

    const result = await svcGetReleaseById(1);
    expect(result).toEqual(mockRelease);
  });

  test('getReleaseById throws when not found', async () => {
    Release.findByPk.mockResolvedValue(null);
    await expect(svcGetReleaseById(999)).rejects.toThrow('Release not found');
  });
});

describe('genreService', () => {
  test('getAllGenres returns all genres', async () => {
    const mockGenres = [{ id: 1, name: 'Rock' }];
    Genre.findAll.mockResolvedValue(mockGenres);

    const result = await svcGetAllGenres();
    expect(result).toEqual(mockGenres);
  });

  test('getGenreById returns the genre', async () => {
    const mockGenre = { id: 1, name: 'Rock' };
    Genre.findByPk.mockResolvedValue(mockGenre);

    const result = await svcGetGenreById(1);
    expect(result).toEqual(mockGenre);
  });

  test('getGenreById throws when not found', async () => {
    Genre.findByPk.mockResolvedValue(null);
    await expect(svcGetGenreById(999)).rejects.toThrow('Genre not found');
  });
});
