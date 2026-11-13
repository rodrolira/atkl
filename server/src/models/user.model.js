// models/user.model.js
import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import sequelize from '../../db/sequelize.js'

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: 'users',
  }
)

// Este modelo guardaba la password tal cual: seedAdminUser.js dejo una fila
// con la password en texto plano, legible para cualquiera con acceso a la
// base. admin.model.js ya hasheaba; aca faltaba.
//
// El guardia sobre el prefijo $2 evita el doble hasheo: si el valor ya es un
// hash de bcrypt (por ejemplo al actualizar otro campo del usuario), se deja
// como esta, porque re-hashearlo invalidaria la password del usuario.
export const esHashBcrypt = (valor) =>
  typeof valor === 'string' && /^\$2[aby]?\$/.test(valor)

export const hashearPassword = async (user) => {
  if (!user.changed('password') || esHashBcrypt(user.password)) return
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
}

User.beforeCreate(hashearPassword)
User.beforeUpdate(hashearPassword)

export default User
