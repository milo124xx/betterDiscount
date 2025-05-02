import { api } from 'src/boot/axios'

export const productApi = {
  /**
   * 获取商品列表
   * @param {Object} params 查询参数 (category, platform, status, sort, limit, offset, search)
   * @returns {Promise<Object|Array>} 商品列表及分页信息
   */
  getProducts(params = {}) {
    console.log('调用getProducts，参数:', params);
    return api.get('/api/products', { params })
      .then(data => {
        console.log('API服务器响应数据:', data);
        // 保留原始响应格式，可能是对象（包含data和total字段）或直接是数组
        return data;
      })
      .catch(error => {
        console.error('API请求失败:', error);
        return { data: [], total: 0 }; // 返回一致的对象格式
      });
  },

  /**
   * 搜索商品
   * @param {string} searchQuery 搜索关键词
   * @param {Object} options 其他过滤选项 (platform, sort)
   * @returns {Promise<Array>} 搜索结果商品列表
   */
  searchProducts(searchQuery, options = {}) {
    console.log('调用searchProducts，关键词:', searchQuery, '选项:', options);
    return this.getProducts({
      search: searchQuery,
      ...options,
      status: 'active'
    });
  },

  /**
   * 获取单个商品详情
   * @param {string} id 商品ID
   * @returns {Promise<Object>} 商品详情
   */
  getProduct(id) {
    console.log('调用getProduct，商品ID:', id);
    return api.get(`/api/products/${id}`)
      .then(data => {
        console.log('商品详情数据:', data);
        return data;
      })
      .catch(error => {
        console.error('获取商品详情失败:', error);
        return null;
      });
  },

  /**
   * 获取商品优惠信息
   * @param {string} id 商品ID
   * @returns {Promise<Object>} 商品优惠信息
   */
  getProductDeals(id) {
    console.log('调用getProductDeals，商品ID:', id);
    return api.get(`/api/products/${id}/deals`)
      .then(data => {
        console.log('商品优惠信息数据:', data);
        return data;
      })
      .catch(error => {
        console.error('获取商品优惠信息失败:', error);
        return null;
      });
  },

  /**
   * 创建新商品
   * @param {FormData} formData 商品数据
   * @returns {Promise<Object>} 创建的商品
   */
  createProduct(formData) {
    console.log('调用createProduct，表单数据:', formData);
    return api.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(data => {
      console.log('创建的商品数据:', data);
      return data;
    }).catch(error => {
      console.error('创建商品失败:', error);
      return null;
    });
  },

  /**
   * 更新商品
   * @param {string} id 商品ID
   * @param {FormData} formData 商品数据
   * @returns {Promise<Object>} 更新后的商品
   */
  updateProduct(id, formData) {
    console.log('调用updateProduct，商品ID:', id, '表单数据:', formData);
    return api.put(`/api/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(data => {
      console.log('更新后的商品数据:', data);
      return data;
    }).catch(error => {
      console.error('更新商品失败:', error);
      return null;
    });
  },

  /**
   * 删除商品
   * @param {string} id 商品ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteProduct(id) {
    console.log('调用deleteProduct，商品ID:', id);
    return api.delete(`/api/products/${id}`)
      .then(data => {
        console.log('删除结果数据:', data);
        return data;
      })
      .catch(error => {
        console.error('删除商品失败:', error);
        return null;
      });
  },

  /**
   * 获取特定分类的商品
   * @param {string} categoryId 分类ID
   * @param {Object} options 其他过滤选项 (platform, sort, limit, offset)
   * @returns {Promise<Object|Array>} 分类商品列表及分页信息
   */
  getCategoryProducts(categoryId, options = {}) {
    if (!categoryId) {
      console.error('获取分类商品错误: 缺少分类ID');
      return Promise.resolve({ data: [], total: 0 });
    }

    console.log('调用getCategoryProducts，分类ID:', categoryId, '选项:', options);

    const params = {
      category: categoryId,
      status: 'active',
      ...options
    };

    return api.get('/api/products', { params })
      .then(data => {
        console.log('分类商品API响应数据:', data);
        return data;
      })
      .catch(error => {
        console.error('获取分类商品失败:', error);
        return { data: [], total: 0 };
      });
  }
}
