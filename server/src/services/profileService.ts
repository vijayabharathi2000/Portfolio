import { ProfileModel } from '../models/Profile.js'
import { ApiError } from '../utils/ApiError.js'
import type { ProfileUpdateInput } from '../validators/profileValidators.js'

export const profileService = {
  async get() {
    const profile = await ProfileModel.findOne().lean()
    if (!profile) {
      throw ApiError.notFound('Profile not found')
    }
    return profile
  },

  update(input: ProfileUpdateInput) {
    return ProfileModel.findOneAndUpdate({}, input, {
      returnDocument: 'after',
      upsert: true,
      setDefaultsOnInsert: true,
    })
  },
}
