import { deleteRelease } from '../src/controllers/releases.controller.js';
import Release from '../src/models/release.model.js';
import ReleaseArtist from '../src/models/release_artist.model.js';

jest.mock('../src/models/release.model.js', () => ({
  findByPk: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../src/models/artist.model.js', () => ({}));
jest.mock('../src/models/genre.model.js', () => ({}));

jest.mock('../src/models/release_artist.model.js', () => ({
  destroy: jest.fn(),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('deleteRelease', () => {
  test('clears the artist links before deleting the release', async () => {
    Release.findByPk.mockResolvedValue({ id: 12 });
    ReleaseArtist.destroy.mockResolvedValue(2);
    Release.destroy.mockResolvedValue(1);
    const res = mockResponse();

    await deleteRelease({ params: { id: '12' } }, res);

    expect(ReleaseArtist.destroy).toHaveBeenCalledWith({ where: { release_id: '12' } });
    expect(Release.destroy).toHaveBeenCalledWith({ where: { id: '12' } });
    expect(ReleaseArtist.destroy.mock.invocationCallOrder[0]).toBeLessThan(
      Release.destroy.mock.invocationCallOrder[0]
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('returns 404 without deleting links when the release does not exist', async () => {
    Release.findByPk.mockResolvedValue(null);
    const res = mockResponse();

    await deleteRelease({ params: { id: '404' } }, res);

    expect(ReleaseArtist.destroy).not.toHaveBeenCalled();
    expect(Release.destroy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
