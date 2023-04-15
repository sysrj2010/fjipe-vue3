import request from '@/utils/request'

// 查询链接列表
export function listLink(query) {
  return request({
    url: '/cms/link/list',
    method: 'get',
    params: query
  })
}

// 查询链接详细
export function getLink(linkId) {
  return request({
    url: '/cms/link/' + linkId,
    method: 'get'
  })
}

// 新增链接
export function addLink(data) {
  return request({
    url: '/cms/link',
    method: 'post',
    data: data
  })
}

// 修改链接
export function updateLink(data) {
  return request({
    url: '/cms/link',
    method: 'put',
    data: data
  })
}

// 删除链接
export function delLink(linkId) {
  return request({
    url: '/cms/link/' + linkId,
    method: 'delete'
  })
}
