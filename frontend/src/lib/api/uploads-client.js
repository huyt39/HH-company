import { BaseApiClient } from './base-client'

/** Admin image library. */
class UploadsApiClient extends BaseApiClient {
  constructor() {
    super({ requireAuth: true })
  }

  /** @param {File} file @returns optimised image: { url, thumb, width, height, size, saved_percent } */
  uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return this.postFormData('/admin/uploads', formData)
  }

  /** @param {File} file @returns uploaded file info: { url, filename, size } */
  uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return this.postFormData('/admin/uploads/file', formData)
  }


  listImages() {
    return this.get('/admin/uploads')
  }

  deleteImage(filename) {
    return this.delete(`/admin/uploads/${filename}`)
  }
}

export const uploadsApi = new UploadsApiClient()
