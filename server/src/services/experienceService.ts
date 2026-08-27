import { ExperienceModel } from '../models/Experience.js'
import { ApiError } from '../utils/ApiError.js'
import type {
  ExperienceInput,
  ExperienceUpdateInput,
} from '../validators/experienceValidators.js'

export const experienceService = {
  listVisible() {
    return ExperienceModel.find({ visible: true }).sort({ displayOrder: 1 }).lean()
  },

  listAll() {
    return ExperienceModel.find().sort({ displayOrder: 1 }).lean()
  },

  create(input: ExperienceInput) {
    return ExperienceModel.create(input)
  },

  async update(id: string, input: ExperienceUpdateInput) {
    const experience = await ExperienceModel.findByIdAndUpdate(id, input, { returnDocument: 'after' })
    if (!experience) {
      throw ApiError.notFound('Experience entry not found')
    }
    return experience
  },

  async remove(id: string) {
    const experience = await ExperienceModel.findByIdAndDelete(id)
    if (!experience) {
      throw ApiError.notFound('Experience entry not found')
    }
  },
}
