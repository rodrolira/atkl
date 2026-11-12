import { addArtist, updateArtist, deleteArtist } from '../src/controllers/artists.controller.js';
import Artist from '../src/models/artist.model.js';
import User from '../src/models/user.model.js';
import Role from '../src/models/role.model.js';
import ArtistRoles from '../src/models/artist_role.model.js';
import ReleaseArtist from '../src/models/release_artist.model.js';
import sequelize from '../db/sequelize.js';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

jest.mock('../src/models/artist.model.js', () => ({
  create: jest.fn(),
  update: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../src/models/user.model.js', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../src/models/role.model.js', () => ({}));

jest.mock('../src/models/release.model.js', () => ({}), { virtual: true });

jest.mock('../src/models/artist_role.model.js', () => ({
  destroy: jest.fn(),
  bulkCreate: jest.fn(),
}));

jest.mock('../src/models/release_artist.model.js', () => ({
  destroy: jest.fn(),
}));

jest.mock('../db/sequelize.js', () => ({
  __esModule: true,
  default: {
    transaction: jest.fn(),
  },
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('addArtist', () => {
  beforeEach(() => {
    sequelize.transaction.mockImplementation((callback) => callback('tx'));
    bcrypt.hash.mockResolvedValue('hashed-password');
  });

  test('rejects when artist_name or email is missing', async () => {
    await expect(addArtist({ artist_name: 'No mail' })).rejects.toMatchObject({
      status: 400,
      message: 'artist_name y email son obligatorios',
    });

    expect(User.findOne).not.toHaveBeenCalled();
    expect(Artist.create).not.toHaveBeenCalled();
  });

  test('rejects with 409 when the email already has an account', async () => {
    User.findOne.mockResolvedValue({ id: 9, email: 'taken@example.com' });

    await expect(
      addArtist({
        artist_name: 'Taken',
        email: 'taken@example.com',
        username: 'taken',
        password: 'secret123',
      })
    ).rejects.toMatchObject({ status: 409 });

    expect(User.create).not.toHaveBeenCalled();
    expect(Artist.create).not.toHaveBeenCalled();
  });

  test('creates the user, the artist and its roles', async () => {
    const savedArtist = { id: 3, artist_name: 'Nova', Roles: [{ id: 1, label: 'DJ' }] };
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 7 });
    Artist.create.mockResolvedValue({ id: 3 });
    ArtistRoles.bulkCreate.mockResolvedValue([]);
    Artist.findByPk.mockResolvedValue(savedArtist);

    const result = await addArtist({
      artist_name: 'Nova',
      email: 'nova@example.com',
      username: 'nova',
      password: 'secret123',
      roleIds: '1,2',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
    expect(User.create).toHaveBeenCalledWith(
      {
        username: 'nova',
        email: 'nova@example.com',
        password: 'hashed-password',
      },
      { transaction: 'tx' }
    );
    expect(Artist.create).toHaveBeenCalledWith(
      expect.objectContaining({ artist_name: 'Nova', user_id: 7 }),
      { transaction: 'tx' }
    );
    expect(ArtistRoles.destroy).toHaveBeenCalledWith({
      where: { artist_id: 3 },
      transaction: 'tx',
    });
    expect(ArtistRoles.bulkCreate).toHaveBeenCalledWith(
      [
        { artist_id: 3, role_id: 1 },
        { artist_id: 3, role_id: 2 },
      ],
      { transaction: 'tx' }
    );
    expect(result).toBe(savedArtist);
  });

  test('creates the artist without a login account when no password is sent', async () => {
    Artist.create.mockResolvedValue({ id: 4 });
    Artist.findByPk.mockResolvedValue({ id: 4, artist_name: 'Solo' });

    await addArtist({ artist_name: 'Solo', email: 'solo@example.com' });

    expect(User.create).not.toHaveBeenCalled();
    expect(Artist.create).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: null }),
      { transaction: 'tx' }
    );
    expect(ArtistRoles.bulkCreate).not.toHaveBeenCalled();
  });
});

describe('updateArtist', () => {
  test('updates the fields and replaces the roles', async () => {
    Artist.update.mockResolvedValue([1]);
    ArtistRoles.bulkCreate.mockResolvedValue([]);
    Artist.findByPk.mockResolvedValue({ id: 5, artist_name: 'Renamed' });

    const result = await updateArtist(5, { artist_name: 'Renamed', roleIds: [2] });

    expect(Artist.update).toHaveBeenCalledWith({ artist_name: 'Renamed' }, { where: { id: 5 } });
    expect(ArtistRoles.destroy).toHaveBeenCalledWith({ where: { artist_id: 5 }, transaction: undefined });
    expect(ArtistRoles.bulkCreate).toHaveBeenCalledWith(
      [{ artist_id: 5, role_id: 2 }],
      { transaction: undefined }
    );
    expect(result).toEqual({ id: 5, artist_name: 'Renamed' });
  });
});

describe('deleteArtist', () => {
  test('removes the artist, its links and its user account', async () => {
    Artist.findOne.mockResolvedValue({ id: 5, user_id: 9 });
    ArtistRoles.destroy.mockResolvedValue(1);
    ReleaseArtist.destroy.mockResolvedValue(2);
    Artist.destroy.mockResolvedValue(1);
    User.destroy.mockResolvedValue(1);
    const res = mockResponse();

    await deleteArtist({ params: { id: '5' } }, res);

    expect(ArtistRoles.destroy).toHaveBeenCalledWith({ where: { artist_id: 5 } });
    expect(ReleaseArtist.destroy).toHaveBeenCalledWith({ where: { artist_id: 5 } });
    expect(Artist.destroy).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: 9 } });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('keeps unrelated users when the artist has no account', async () => {
    Artist.findOne.mockResolvedValue({ id: 6, user_id: null });
    ArtistRoles.destroy.mockResolvedValue(0);
    ReleaseArtist.destroy.mockResolvedValue(0);
    Artist.destroy.mockResolvedValue(1);
    const res = mockResponse();

    await deleteArtist({ params: { id: '6' } }, res);

    expect(User.destroy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('returns 404 when the artist does not exist', async () => {
    Artist.findOne.mockResolvedValue(null);
    const res = mockResponse();

    await deleteArtist({ params: { id: '404' } }, res);

    expect(Artist.destroy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
