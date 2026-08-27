import { CertificationModel } from '../models/Certification.js'
import { ApiError } from '../utils/ApiError.js'
import type {
  CertificationInput,
  CertificationUpdateInput,
} from '../validators/certificationValidators.js'

export const certificationService = {
  listVisible() {
    return CertificationModel.find({ visible: true }).sort({ displayOrder: 1 }).lean()
  },

  listAll() {
    return CertificationModel.find().sort({ displayOrder: 1 }).lean()
  },

  create(input: CertificationInput) {
    return CertificationModel.create(input)
  },

  async update(id: string, input: CertificationUpdateInput) {
    const certification = await CertificationModel.findByIdAndUpdate(id, input, {
      returnDocument: 'after',
    })
    if (!certification) {
      throw ApiError.notFound('Certification not found')
    }
    return certification
  },

  async remove(id: string) {
    const certification = await CertificationModel.findByIdAndDelete(id)
    if (!certification) {
      throw ApiError.notFound('Certification not found')
    }
  },
}
