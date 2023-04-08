import request from '@/utils/request'

// 查询网站栏目列表
export function listCatalog(query) {
  return request({
    url: '/cms/catalog/list',
    method: 'get',
    params: query
  })
}

// 查询网站栏目详细
export function getCatalog(catalogId) {
  return request({
    url: '/cms/catalog/' + catalogId,
    method: 'get'
  })
}

// 新增网站栏目
export function addCatalog(data) {
  return request({
    url: '/cms/catalog',
    method: 'post',
    data: data
  })
}

// 修改网站栏目
export function updateCatalog(data) {
  return request({
    url: '/cms/catalog',
    method: 'put',
    data: data
  })
}

// 删除网站栏目
export function delCatalog(catalogId) {
  return request({
    url: '/cms/catalog/' + catalogId,
    method: 'delete'
  })
}


// 查询栏目列表（排除子节点）
export function listCatalogExcludeChild(catalogId) {
  return request({
    url: '/cms/catalog/list/exclude/' + catalogId,
    method: 'get'
  })
}
