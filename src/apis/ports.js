import { v1AuthRequest, v2AuthRequest } from "./utils";

export const serverPortsGet = (server_id, page, size) => v2AuthRequest({
    method: "get",
    url: `/servers/${server_id}/ports`,
    params: { page: page-1, size }
})

export const serverPortCreate = (server_id, data) => v1AuthRequest({
    method: "post",
    url: `/servers/${server_id}/ports`,
    data: data
})

export const serverPortGet = (server_id, port_id) => v1AuthRequest({
    method: "get",
    url: `/servers/${server_id}/ports/${port_id}`
})

export const serverPortEdit = (server_id, port_id, data) => v1AuthRequest({
    method: "put",
    url: `/servers/${server_id}/ports/${port_id}`,
    data: data
})

export const serverPortDelete = (server_id, port_id) => v1AuthRequest({
    method: "delete",
    url: `/servers/${server_id}/ports/${port_id}`,
})

export const serverPortUsersGet = (server_id, port_id) => v1AuthRequest({
    method: "get",
    url: `/servers/${server_id}/ports/${port_id}/users`
})

export const serverPortUserCreate = (server_id, port_id, data) => v1AuthRequest({
    method: "post",
    url: `/servers/${server_id}/ports/${port_id}/users`,
    data: data
})

export const serverPortUserEdit = (server_id, port_id, user_id, data) => v1AuthRequest({
    method: "put",
    url: `/servers/${server_id}/ports/${port_id}/users/${user_id}`,
    data: data
})

export const serverPortUserDelete = (server_id, port_id, user_id) => v1AuthRequest({
    method: "delete",
    url: `/servers/${server_id}/ports/${port_id}/users/${user_id}`,
})

export const serverPortForwardRuleGet = (server_id, port_id) => v1AuthRequest({
    method: "get",
    url: `/servers/${server_id}/ports/${port_id}/forward_rule`
})

export const serverPortForwardRuleCreate = (server_id, port_id, data) => v1AuthRequest({
    method: "post",
    url: `/servers/${server_id}/ports/${port_id}/forward_rule`,
    data: data
})

export const serverPortForwardRuleEdit = (server_id, port_id, data) => v1AuthRequest({
    method: "put",
    url: `/servers/${server_id}/ports/${port_id}/forward_rule`,
    data: data
})

export const serverPortForwardRuleDelete = (server_id, port_id) => v1AuthRequest({
    method: "delete",
    url: `/servers/${server_id}/ports/${port_id}/forward_rule`,
})

export const serverPortForwardRuleArtifactsGet = (server_id, port_id) => v1AuthRequest({
    method: "get",
    url: `/servers/${server_id}/ports/${port_id}/forward_rule/artifacts`
})

export const serverPortUsageEdit = (server_id, port_id, data) => v1AuthRequest({
    method: "post",
    url: `/servers/${server_id}/ports/${port_id}/usage`,
    data: data
})