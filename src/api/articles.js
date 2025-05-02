import { api } from 'src/boot/axios'

export const articleApi = {
  /**
   * 获取文章列表
   * @param {Object} params 查询参数 (category, status, sort, limit, offset)
   * @returns {Promise<Object|Array>} 文章列表及分页信息
   */
  getArticles(params = {}) {
    console.log('调用getArticles，参数:', params);
    return api.get('/api/articles', { params })
      .then(data => {
        console.log('文章API响应数据:', data);
        // 保留原始响应格式，可能是对象（包含data和total字段）或直接是数组
        return data;
      })
      .catch(error => {
        console.error('获取文章列表失败:', error);
        return { data: [], total: 0 }; // 返回一致的对象格式
      });
  },

  /**
   * 获取单个文章详情
   * @param {string} id 文章ID
   * @returns {Promise<Object>} 文章详情
   */
  getArticle(id) {
    return api.get(`/api/articles/${id}`)
  },

  /**
   * 创建新文章
   * @param {FormData} formData 文章数据
   * @returns {Promise<Object>} 创建的文章
   */
  createArticle(formData) {
    return api.post('/api/articles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 更新文章
   * @param {string} id 文章ID
   * @param {FormData} formData 文章数据
   * @returns {Promise<Object>} 更新后的文章
   */
  updateArticle(id, formData) {
    return api.put(`/api/articles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 删除文章
   * @param {string} id 文章ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteArticle(id) {
    return api.delete(`/api/articles/${id}`)
  }
}
