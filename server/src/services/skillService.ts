import { SkillModel } from '../models/Skill.js'
import { ApiError } from '../utils/ApiError.js'
import type { SkillInput, SkillUpdateInput } from '../validators/skillValidators.js'

export const skillService = {
  listVisible() {
    return SkillModel.find({ visible: true }).sort({ displayOrder: 1 }).lean()
  },

  listAll() {
    return SkillModel.find().sort({ displayOrder: 1 }).lean()
  },

  create(input: SkillInput) {
    return SkillModel.create(input)
  },

  async update(id: string, input: SkillUpdateInput) {
    const skill = await SkillModel.findByIdAndUpdate(id, input, { returnDocument: 'after' })
    if (!skill) {
      throw ApiError.notFound('Skill not found')
    }
    return skill
  },

  async remove(id: string) {
    const skill = await SkillModel.findByIdAndDelete(id)
    if (!skill) {
      throw ApiError.notFound('Skill not found')
    }
  },
}
