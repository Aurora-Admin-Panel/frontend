import { v1AuthRequest, v2AuthRequest } from "./utils";

export const meGet = () => v1AuthRequest({
    method: "get",
    url: '/users/me'
})
export const meEdit = (data) => v1AuthRequest({
    method: "put",
    url: '/users/me',
    data: data
})

export const usersGet = (page, size, query = null) => v2AuthRequest({
    method: "get",
    url: `/users`,
    params: { page: page-1, size, query }
})

export const userCreate = (data) => v1AuthRequest({
    method: "post",
    url: `/users`,
    data: data
})

export const userGet = (user_id) => v1AuthRequest({
    method: "get",
    url: `/users/${user_id}`,
})

export const userEdit = (user_id, data) => v1AuthRequest({
    method: "put",
    url: `/users/${user_id}`,
    data: data
})

export const userDelete = (user_id, data) => v1AuthRequest({
    method: "delete",
    url: `/users/${user_id}`,
    data: data
})

export const userServersGet = (user_id) => v1AuthRequest({
    method: "get",
    url: `/users/${user_id}/servers`
})