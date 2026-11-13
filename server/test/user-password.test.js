import bcrypt from 'bcryptjs'
import { esHashBcrypt, hashearPassword } from '../src/models/user.model.js'

// Doble de un modelo de Sequelize: solo necesitamos password y changed().
const fakeUser = (password, cambio = true) => ({
  password,
  changed: (campo) => campo === 'password' && cambio,
})

describe('hash de password en el modelo User', () => {
  // El bug original: seedAdminUser.js dejo una fila con la password en texto
  // plano porque este modelo no hasheaba (admin.model.js si).
  it('hashea una password nueva', async () => {
    const u = fakeUser('secreta123')
    await hashearPassword(u)

    expect(u.password).not.toBe('secreta123')
    expect(esHashBcrypt(u.password)).toBe(true)
    expect(await bcrypt.compare('secreta123', u.password)).toBe(true)
  })

  it('no re-hashea un valor que ya es hash', async () => {
    const yaHasheada = await bcrypt.hash('secreta123', 10)
    const u = fakeUser(yaHasheada)
    await hashearPassword(u)

    // Re-hashear invalidaria la password: bcrypt.compare fallaria despues.
    expect(u.password).toBe(yaHasheada)
    expect(await bcrypt.compare('secreta123', u.password)).toBe(true)
  })

  it('no toca la password si no cambio', async () => {
    const u = fakeUser('intacta', false)
    await hashearPassword(u)
    expect(u.password).toBe('intacta')
  })

  it('reconoce los prefijos de bcrypt y descarta el resto', () => {
    expect(esHashBcrypt('$2a$10$' + 'x'.repeat(53))).toBe(true)
    expect(esHashBcrypt('$2b$10$' + 'x'.repeat(53))).toBe(true)
    expect(esHashBcrypt('$2y$10$' + 'x'.repeat(53))).toBe(true)
    expect(esHashBcrypt('texto plano')).toBe(false)
    expect(esHashBcrypt('')).toBe(false)
    expect(esHashBcrypt(undefined)).toBe(false)
    expect(esHashBcrypt(null)).toBe(false)
  })
})
