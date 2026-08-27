import { UserModel } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { verifyPassword } from '../utils/password.js'
import { signAdminToken } from '../utils/jwt.js'
import type { LoginInput } from '../validators/authValidators.js'

// A bcrypt hash of a random value, compared against when no user is found so that
// login timing does not reveal whether an email address is registered.
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO7NRD5nyy2E4wDkA8pE9zJRPP5s2vHUu'

export const authService = {
  async login({ email, password }: LoginInput) {
    const user = await UserModel.findOne({ email: email.toLowerCase() })
    const isValid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH)

    if (!user || !isValid) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    user.lastLoginAt = new Date()
    await user.save()

    const token = signAdminToken({ sub: user.id, email: user.email })
    return { token, user: { id: user.id, email: user.email, role: user.role } }
  },

  async getById(id: string) {
    const user = await UserModel.findById(id).lean()
    if (!user) {
      throw ApiError.unauthorized()
    }
    return { id: user._id.toString(), email: user.email, role: user.role }
  },
}
