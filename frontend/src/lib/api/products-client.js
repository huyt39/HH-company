import { BaseApiClient } from './base-client'

/** Product groups. */
class ProductsApiClient extends BaseApiClient {
  getProducts(options) {
    return this.get('/products', undefined, options)
  }

  getProduct(slug, options) {
    return this.get(`/products/${slug}`, undefined, options)
  }
}

export const productsApi = new ProductsApiClient()
