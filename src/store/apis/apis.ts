import { api } from "../baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    rootApiV1Get: build.query<RootApiV1GetApiResponse, RootApiV1GetApiArg>({
      query: (queryArg) => ({
        url: `/api/v1`,
        params: { server_id: queryArg.serverId },
      }),
    }),
    messageStreamApiStreamGet: build.query<
      MessageStreamApiStreamGetApiResponse,
      MessageStreamApiStreamGetApiArg
    >({
      query: () => ({ url: `/api/stream` }),
    }),
    usersListApiV1UsersGet: build.query<
      UsersListApiV1UsersGetApiResponse,
      UsersListApiV1UsersGetApiArg
    >({
      query: () => ({ url: `/api/v1/users` }),
    }),
    userCreateApiV1UsersPost: build.mutation<
      UserCreateApiV1UsersPostApiResponse,
      UserCreateApiV1UsersPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/users`,
        method: "POST",
        body: queryArg.userCreate,
      }),
    }),
    userMeApiV1UsersMeGet: build.query<
      UserMeApiV1UsersMeGetApiResponse,
      UserMeApiV1UsersMeGetApiArg
    >({
      query: () => ({ url: `/api/v1/users/me` }),
    }),
    userMeEditApiV1UsersMePut: build.mutation<
      UserMeEditApiV1UsersMePutApiResponse,
      UserMeEditApiV1UsersMePutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/users/me`,
        method: "PUT",
        body: queryArg.meEdit,
      }),
    }),
    userDetailsApiV1UsersUserIdGet: build.query<
      UserDetailsApiV1UsersUserIdGetApiResponse,
      UserDetailsApiV1UsersUserIdGetApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/users/${queryArg.userId}` }),
    }),
    userEditApiV1UsersUserIdPut: build.mutation<
      UserEditApiV1UsersUserIdPutApiResponse,
      UserEditApiV1UsersUserIdPutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/users/${queryArg.userId}`,
        method: "PUT",
        body: queryArg.userEdit,
      }),
    }),
    userDeleteApiV1UsersUserIdDelete: build.mutation<
      UserDeleteApiV1UsersUserIdDeleteApiResponse,
      UserDeleteApiV1UsersUserIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/users/${queryArg.userId}`,
        method: "DELETE",
        body: queryArg.userDelete,
      }),
    }),
    userServersGetApiV1UsersUserIdServersGet: build.query<
      UserServersGetApiV1UsersUserIdServersGetApiResponse,
      UserServersGetApiV1UsersUserIdServersGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/users/${queryArg.userId}/servers`,
      }),
    }),
    usersListApiV2UsersGet: build.query<
      UsersListApiV2UsersGetApiResponse,
      UsersListApiV2UsersGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/users`,
        params: {
          query: queryArg.query,
          page: queryArg.page,
          size: queryArg.size,
        },
      }),
    }),
    serversListApiV1ServersGet: build.query<
      ServersListApiV1ServersGetApiResponse,
      ServersListApiV1ServersGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers`,
        params: { offset: queryArg.offset, limit: queryArg.limit },
      }),
    }),
    serverCreateApiV1ServersPost: build.mutation<
      ServerCreateApiV1ServersPostApiResponse,
      ServerCreateApiV1ServersPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers`,
        method: "POST",
        body: queryArg.serverCreate,
      }),
    }),
    serverGetApiV1ServersServerIdGet: build.query<
      ServerGetApiV1ServersServerIdGetApiResponse,
      ServerGetApiV1ServersServerIdGetApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/servers/${queryArg.serverId}` }),
    }),
    serverEditApiV1ServersServerIdPut: build.mutation<
      ServerEditApiV1ServersServerIdPutApiResponse,
      ServerEditApiV1ServersServerIdPutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}`,
        method: "PUT",
        body: queryArg.serverEdit,
      }),
    }),
    serverDeleteApiV1ServersServerIdDelete: build.mutation<
      ServerDeleteApiV1ServersServerIdDeleteApiResponse,
      ServerDeleteApiV1ServersServerIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}`,
        method: "DELETE",
      }),
    }),
    serverConfigEditApiV1ServersServerIdConfigPut: build.mutation<
      ServerConfigEditApiV1ServersServerIdConfigPutApiResponse,
      ServerConfigEditApiV1ServersServerIdConfigPutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/config`,
        method: "PUT",
        body: queryArg.serverConfigEdit,
      }),
    }),
    serverConnectApiV1ServersServerIdConnectPost: build.mutation<
      ServerConnectApiV1ServersServerIdConnectPostApiResponse,
      ServerConnectApiV1ServersServerIdConnectPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/connect`,
        method: "POST",
        body: queryArg.serverConnectArg,
      }),
    }),
    serverUsersGetApiV1ServersServerIdUsersGet: build.query<
      ServerUsersGetApiV1ServersServerIdUsersGetApiResponse,
      ServerUsersGetApiV1ServersServerIdUsersGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/users`,
      }),
    }),
    serverUsersAddApiV1ServersServerIdUsersPost: build.mutation<
      ServerUsersAddApiV1ServersServerIdUsersPostApiResponse,
      ServerUsersAddApiV1ServersServerIdUsersPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/users`,
        method: "POST",
        body: queryArg.serverUserCreate,
      }),
    }),
    serverUsersEditApiV1ServersServerIdUsersUserIdPut: build.mutation<
      ServerUsersEditApiV1ServersServerIdUsersUserIdPutApiResponse,
      ServerUsersEditApiV1ServersServerIdUsersUserIdPutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/users/${queryArg.userId}`,
        method: "PUT",
        body: queryArg.serverUserEdit,
      }),
    }),
    serverUsersDeleteApiV1ServersServerIdUsersUserIdDelete: build.mutation<
      ServerUsersDeleteApiV1ServersServerIdUsersUserIdDeleteApiResponse,
      ServerUsersDeleteApiV1ServersServerIdUsersUserIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/users/${queryArg.userId}`,
        method: "DELETE",
      }),
    }),
    serversListApiV2ServersGet: build.query<
      ServersListApiV2ServersGetApiResponse,
      ServersListApiV2ServersGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/servers`,
        params: { page: queryArg.page, size: queryArg.size },
      }),
    }),
    serverGetApiV2ServersServerIdGet: build.query<
      ServerGetApiV2ServersServerIdGetApiResponse,
      ServerGetApiV2ServersServerIdGetApiArg
    >({
      query: (queryArg) => ({ url: `/api/v2/servers/${queryArg.serverId}` }),
    }),
    detailedServerGetApiV2ServersServerIdDetailedGet: build.query<
      DetailedServerGetApiV2ServersServerIdDetailedGetApiResponse,
      DetailedServerGetApiV2ServersServerIdDetailedGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/servers/${queryArg.serverId}/detailed`,
      }),
    }),
    serverUsersGetApiV2ServersServerIdUsersGet: build.query<
      ServerUsersGetApiV2ServersServerIdUsersGetApiResponse,
      ServerUsersGetApiV2ServersServerIdUsersGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/servers/${queryArg.serverId}/users`,
        params: { page: queryArg.page, size: queryArg.size },
      }),
    }),
    portsListApiV1ServersServerIdPortsGet: build.query<
      PortsListApiV1ServersServerIdPortsGetApiResponse,
      PortsListApiV1ServersServerIdPortsGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports`,
        params: { offset: queryArg.offset, limit: queryArg.limit },
      }),
    }),
    portCreateApiV1ServersServerIdPortsPost: build.mutation<
      PortCreateApiV1ServersServerIdPortsPostApiResponse,
      PortCreateApiV1ServersServerIdPortsPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports`,
        method: "POST",
        body: queryArg.portCreate,
      }),
    }),
    portGetApiV1ServersServerIdPortsPortIdGet: build.query<
      PortGetApiV1ServersServerIdPortsPortIdGetApiResponse,
      PortGetApiV1ServersServerIdPortsPortIdGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}`,
      }),
    }),
    portEditApiV1ServersServerIdPortsPortIdPut: build.mutation<
      PortEditApiV1ServersServerIdPortsPortIdPutApiResponse,
      PortEditApiV1ServersServerIdPortsPortIdPutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}`,
        method: "PUT",
        body: queryArg.portEdit,
      }),
    }),
    portDeleteApiV1ServersServerIdPortsPortIdDelete: build.mutation<
      PortDeleteApiV1ServersServerIdPortsPortIdDeleteApiResponse,
      PortDeleteApiV1ServersServerIdPortsPortIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}`,
        method: "DELETE",
      }),
    }),
    portUsersGetApiV1ServersServerIdPortsPortIdUsersGet: build.query<
      PortUsersGetApiV1ServersServerIdPortsPortIdUsersGetApiResponse,
      PortUsersGetApiV1ServersServerIdPortsPortIdUsersGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/users`,
      }),
    }),
    portUserAddApiV1ServersServerIdPortsPortIdUsersPost: build.mutation<
      PortUserAddApiV1ServersServerIdPortsPortIdUsersPostApiResponse,
      PortUserAddApiV1ServersServerIdPortsPortIdUsersPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/users`,
        method: "POST",
        body: queryArg.portUserCreate,
      }),
    }),
    portUserEditApiV1ServersServerIdPortsPortIdUsersUserIdPut: build.mutation<
      PortUserEditApiV1ServersServerIdPortsPortIdUsersUserIdPutApiResponse,
      PortUserEditApiV1ServersServerIdPortsPortIdUsersUserIdPutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/users/${queryArg.userId}`,
        method: "PUT",
        body: queryArg.portUserEdit,
      }),
    }),
    portUsersDeleteApiV1ServersServerIdPortsPortIdUsersUserIdDelete:
      build.mutation<
        PortUsersDeleteApiV1ServersServerIdPortsPortIdUsersUserIdDeleteApiResponse,
        PortUsersDeleteApiV1ServersServerIdPortsPortIdUsersUserIdDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/users/${queryArg.userId}`,
          method: "DELETE",
        }),
      }),
    portUsageEditApiV1ServersServerIdPortsPortIdUsagePost: build.mutation<
      PortUsageEditApiV1ServersServerIdPortsPortIdUsagePostApiResponse,
      PortUsageEditApiV1ServersServerIdPortsPortIdUsagePostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/usage`,
        method: "POST",
        body: queryArg.portUsageEdit,
      }),
    }),
    portsListApiV2ServersServerIdPortsGet: build.query<
      PortsListApiV2ServersServerIdPortsGetApiResponse,
      PortsListApiV2ServersServerIdPortsGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/servers/${queryArg.serverId}/ports`,
        params: { page: queryArg.page, size: queryArg.size },
      }),
    }),
    forwardRuleGetApiV1ServersServerIdPortsPortIdForwardRuleGet: build.query<
      ForwardRuleGetApiV1ServersServerIdPortsPortIdForwardRuleGetApiResponse,
      ForwardRuleGetApiV1ServersServerIdPortsPortIdForwardRuleGetApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/forward_rule`,
      }),
    }),
    forwardRuleEditApiV1ServersServerIdPortsPortIdForwardRulePut:
      build.mutation<
        ForwardRuleEditApiV1ServersServerIdPortsPortIdForwardRulePutApiResponse,
        ForwardRuleEditApiV1ServersServerIdPortsPortIdForwardRulePutApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/forward_rule`,
          method: "PUT",
          body: queryArg.portForwardRuleEdit,
        }),
      }),
    forwardRuleCreateApiV1ServersServerIdPortsPortIdForwardRulePost:
      build.mutation<
        ForwardRuleCreateApiV1ServersServerIdPortsPortIdForwardRulePostApiResponse,
        ForwardRuleCreateApiV1ServersServerIdPortsPortIdForwardRulePostApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/forward_rule`,
          method: "POST",
          body: queryArg.portForwardRuleCreate,
        }),
      }),
    forwardRuleDeleteApiV1ServersServerIdPortsPortIdForwardRuleDelete:
      build.mutation<
        ForwardRuleDeleteApiV1ServersServerIdPortsPortIdForwardRuleDeleteApiResponse,
        ForwardRuleDeleteApiV1ServersServerIdPortsPortIdForwardRuleDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/forward_rule`,
          method: "DELETE",
        }),
      }),
    forwardRulesRecreateApiV1ServersServerIdForwardRulesPost: build.mutation<
      ForwardRulesRecreateApiV1ServersServerIdForwardRulesPostApiResponse,
      ForwardRulesRecreateApiV1ServersServerIdForwardRulesPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/forward_rules`,
        method: "POST",
      }),
    }),
    forwardRulesDeleteApiV1ServersServerIdForwardRulesDelete: build.mutation<
      ForwardRulesDeleteApiV1ServersServerIdForwardRulesDeleteApiResponse,
      ForwardRulesDeleteApiV1ServersServerIdForwardRulesDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/servers/${queryArg.serverId}/forward_rules`,
        method: "DELETE",
      }),
    }),
    forwardRuleRunnerGetApiV1ServersServerIdPortsPortIdForwardRuleArtifactsGet:
      build.query<
        ForwardRuleRunnerGetApiV1ServersServerIdPortsPortIdForwardRuleArtifactsGetApiResponse,
        ForwardRuleRunnerGetApiV1ServersServerIdPortsPortIdForwardRuleArtifactsGetApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/servers/${queryArg.serverId}/ports/${queryArg.portId}/forward_rule/artifacts`,
        }),
      }),
    usersListApiV3UsersGet: build.query<
      UsersListApiV3UsersGetApiResponse,
      UsersListApiV3UsersGetApiArg
    >({
      query: () => ({ url: `/api/v3/users` }),
    }),
    handleHttpGetApiGraphqlGet: build.query<
      HandleHttpGetApiGraphqlGetApiResponse,
      HandleHttpGetApiGraphqlGetApiArg
    >({
      query: () => ({ url: `/api/graphql` }),
    }),
    handleHttpPostApiGraphqlPost: build.mutation<
      HandleHttpPostApiGraphqlPostApiResponse,
      HandleHttpPostApiGraphqlPostApiArg
    >({
      query: () => ({ url: `/api/graphql`, method: "POST" }),
    }),
    loginApiTokenPost: build.mutation<
      LoginApiTokenPostApiResponse,
      LoginApiTokenPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/token`,
        method: "POST",
        body: queryArg.bodyLoginApiTokenPost,
      }),
    }),
    signupApiSignupPost: build.mutation<
      SignupApiSignupPostApiResponse,
      SignupApiSignupPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/signup`,
        method: "POST",
        body: queryArg.bodySignupApiSignupPost,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as openApi };
export type RootApiV1GetApiResponse = /** status 200 Successful Response */ any;
export type RootApiV1GetApiArg = {
  serverId: number;
};
export type MessageStreamApiStreamGetApiResponse =
  /** status 200 Successful Response */ any;
export type MessageStreamApiStreamGetApiArg = void;
export type UsersListApiV1UsersGetApiResponse =
  /** status 200 Successful Response */ UserOpsOut[];
export type UsersListApiV1UsersGetApiArg = void;
export type UserCreateApiV1UsersPostApiResponse =
  /** status 200 Successful Response */ UserOpsOut;
export type UserCreateApiV1UsersPostApiArg = {
  userCreate: UserCreate;
};
export type UserMeApiV1UsersMeGetApiResponse =
  /** status 200 Successful Response */ User;
export type UserMeApiV1UsersMeGetApiArg = void;
export type UserMeEditApiV1UsersMePutApiResponse =
  /** status 200 Successful Response */ User;
export type UserMeEditApiV1UsersMePutApiArg = {
  meEdit: MeEdit;
};
export type UserDetailsApiV1UsersUserIdGetApiResponse =
  /** status 200 Successful Response */ UserOpsOut;
export type UserDetailsApiV1UsersUserIdGetApiArg = {
  userId: number;
};
export type UserEditApiV1UsersUserIdPutApiResponse =
  /** status 200 Successful Response */ UserOpsOut;
export type UserEditApiV1UsersUserIdPutApiArg = {
  userId: number;
  userEdit: UserEdit;
};
export type UserDeleteApiV1UsersUserIdDeleteApiResponse =
  /** status 200 Successful Response */ UserOut;
export type UserDeleteApiV1UsersUserIdDeleteApiArg = {
  userId: number;
  userDelete: UserDelete;
};
export type UserServersGetApiV1UsersUserIdServersGetApiResponse =
  /** status 200 Successful Response */ UserServerOut[];
export type UserServersGetApiV1UsersUserIdServersGetApiArg = {
  userId: number;
};
export type UsersListApiV2UsersGetApiResponse =
  /** status 200 Successful Response */ PageUserOut;
export type UsersListApiV2UsersGetApiArg = {
  query?: string;
  page?: number;
  size?: number;
};
export type ServersListApiV1ServersGetApiResponse =
  /** status 200 Successful Response */ ServerOpsOut[] | ServerOut[];
export type ServersListApiV1ServersGetApiArg = {
  offset?: number;
  limit?: number;
};
export type ServerCreateApiV1ServersPostApiResponse =
  /** status 200 Successful Response */ ServerOut;
export type ServerCreateApiV1ServersPostApiArg = {
  serverCreate: ServerCreate;
};
export type ServerGetApiV1ServersServerIdGetApiResponse =
  /** status 200 Successful Response */ ServerOpsOut | ServerOut;
export type ServerGetApiV1ServersServerIdGetApiArg = {
  serverId: number;
};
export type ServerEditApiV1ServersServerIdPutApiResponse =
  /** status 200 Successful Response */ ServerOut;
export type ServerEditApiV1ServersServerIdPutApiArg = {
  serverId: number;
  serverEdit: ServerEdit;
};
export type ServerDeleteApiV1ServersServerIdDeleteApiResponse =
  /** status 200 Successful Response */ ServerOpsOut;
export type ServerDeleteApiV1ServersServerIdDeleteApiArg = {
  serverId: number;
};
export type ServerConfigEditApiV1ServersServerIdConfigPutApiResponse =
  /** status 200 Successful Response */ ServerOpsOut;
export type ServerConfigEditApiV1ServersServerIdConfigPutApiArg = {
  serverId: number;
  serverConfigEdit: ServerConfigEdit;
};
export type ServerConnectApiV1ServersServerIdConnectPostApiResponse =
  /** status 200 Successful Response */ ServerOut;
export type ServerConnectApiV1ServersServerIdConnectPostApiArg = {
  serverId: number;
  serverConnectArg: ServerConnectArg;
};
export type ServerUsersGetApiV1ServersServerIdUsersGetApiResponse =
  /** status 200 Successful Response */ ServerUserOpsOut[];
export type ServerUsersGetApiV1ServersServerIdUsersGetApiArg = {
  serverId: number;
};
export type ServerUsersAddApiV1ServersServerIdUsersPostApiResponse =
  /** status 200 Successful Response */ ServerUserOpsOut;
export type ServerUsersAddApiV1ServersServerIdUsersPostApiArg = {
  serverId: number;
  serverUserCreate: ServerUserCreate;
};
export type ServerUsersEditApiV1ServersServerIdUsersUserIdPutApiResponse =
  /** status 200 Successful Response */ ServerUserOpsOut;
export type ServerUsersEditApiV1ServersServerIdUsersUserIdPutApiArg = {
  serverId: number;
  userId: number;
  serverUserEdit: ServerUserEdit;
};
export type ServerUsersDeleteApiV1ServersServerIdUsersUserIdDeleteApiResponse =
  /** status 200 Successful Response */ ServerUserOut;
export type ServerUsersDeleteApiV1ServersServerIdUsersUserIdDeleteApiArg = {
  serverId: number;
  userId: number;
};
export type ServersListApiV2ServersGetApiResponse =
  /** status 200 Successful Response */ PageServerOut;
export type ServersListApiV2ServersGetApiArg = {
  page?: number;
  size?: number;
};
export type ServerGetApiV2ServersServerIdGetApiResponse =
  /** status 200 Successful Response */ ServerOut;
export type ServerGetApiV2ServersServerIdGetApiArg = {
  serverId: number;
};
export type DetailedServerGetApiV2ServersServerIdDetailedGetApiResponse =
  /** status 200 Successful Response */ ServerOpsOut;
export type DetailedServerGetApiV2ServersServerIdDetailedGetApiArg = {
  serverId: number;
};
export type ServerUsersGetApiV2ServersServerIdUsersGetApiResponse =
  /** status 200 Successful Response */ PageServerUserOpsOut;
export type ServerUsersGetApiV2ServersServerIdUsersGetApiArg = {
  serverId: number;
  page?: number;
  size?: number;
};
export type PortsListApiV1ServersServerIdPortsGetApiResponse =
  /** status 200 Successful Response */ PortOpsOut[] | PortOut[];
export type PortsListApiV1ServersServerIdPortsGetApiArg = {
  serverId: number;
  offset?: number;
  limit?: number;
};
export type PortCreateApiV1ServersServerIdPortsPostApiResponse =
  /** status 200 Successful Response */ PortOpsOut;
export type PortCreateApiV1ServersServerIdPortsPostApiArg = {
  serverId: number;
  portCreate: PortCreate;
};
export type PortGetApiV1ServersServerIdPortsPortIdGetApiResponse =
  /** status 200 Successful Response */ PortOpsOut | PortOut;
export type PortGetApiV1ServersServerIdPortsPortIdGetApiArg = {
  serverId: number;
  portId: number;
};
export type PortEditApiV1ServersServerIdPortsPortIdPutApiResponse =
  /** status 200 Successful Response */ PortOpsOut;
export type PortEditApiV1ServersServerIdPortsPortIdPutApiArg = {
  serverId: number;
  portId: number;
  portEdit: PortEdit;
};
export type PortDeleteApiV1ServersServerIdPortsPortIdDeleteApiResponse =
  /** status 200 Successful Response */ PortOpsOut;
export type PortDeleteApiV1ServersServerIdPortsPortIdDeleteApiArg = {
  serverId: number;
  portId: number;
};
export type PortUsersGetApiV1ServersServerIdPortsPortIdUsersGetApiResponse =
  /** status 200 Successful Response */ PortUserOpsOut[];
export type PortUsersGetApiV1ServersServerIdPortsPortIdUsersGetApiArg = {
  serverId: number;
  portId: number;
};
export type PortUserAddApiV1ServersServerIdPortsPortIdUsersPostApiResponse =
  /** status 200 Successful Response */ PortUserOpsOut;
export type PortUserAddApiV1ServersServerIdPortsPortIdUsersPostApiArg = {
  serverId: number;
  portId: number;
  portUserCreate: PortUserCreate;
};
export type PortUserEditApiV1ServersServerIdPortsPortIdUsersUserIdPutApiResponse =
  /** status 200 Successful Response */ PortUserOpsOut;
export type PortUserEditApiV1ServersServerIdPortsPortIdUsersUserIdPutApiArg = {
  serverId: number;
  portId: number;
  userId: number;
  portUserEdit: PortUserEdit;
};
export type PortUsersDeleteApiV1ServersServerIdPortsPortIdUsersUserIdDeleteApiResponse =
  /** status 200 Successful Response */ PortUserOut;
export type PortUsersDeleteApiV1ServersServerIdPortsPortIdUsersUserIdDeleteApiArg =
  {
    serverId: number;
    portId: number;
    userId: number;
  };
export type PortUsageEditApiV1ServersServerIdPortsPortIdUsagePostApiResponse =
  /** status 200 Successful Response */ PortUsageOut;
export type PortUsageEditApiV1ServersServerIdPortsPortIdUsagePostApiArg = {
  serverId: number;
  portId: number;
  portUsageEdit: PortUsageEdit;
};
export type PortsListApiV2ServersServerIdPortsGetApiResponse =
  /** status 200 Successful Response */ PagePortOut;
export type PortsListApiV2ServersServerIdPortsGetApiArg = {
  serverId: number;
  page?: number;
  size?: number;
};
export type ForwardRuleGetApiV1ServersServerIdPortsPortIdForwardRuleGetApiResponse =
  /** status 200 Successful Response */ PortForwardRuleOut;
export type ForwardRuleGetApiV1ServersServerIdPortsPortIdForwardRuleGetApiArg =
  {
    serverId: number;
    portId: number;
  };
export type ForwardRuleEditApiV1ServersServerIdPortsPortIdForwardRulePutApiResponse =
  /** status 200 Successful Response */ PortForwardRuleOut;
export type ForwardRuleEditApiV1ServersServerIdPortsPortIdForwardRulePutApiArg =
  {
    serverId: number;
    portId: number;
    portForwardRuleEdit: PortForwardRuleEdit;
  };
export type ForwardRuleCreateApiV1ServersServerIdPortsPortIdForwardRulePostApiResponse =
  /** status 200 Successful Response */ PortForwardRuleOut;
export type ForwardRuleCreateApiV1ServersServerIdPortsPortIdForwardRulePostApiArg =
  {
    serverId: number;
    portId: number;
    portForwardRuleCreate: PortForwardRuleCreate;
  };
export type ForwardRuleDeleteApiV1ServersServerIdPortsPortIdForwardRuleDeleteApiResponse =
  /** status 200 Successful Response */ PortForwardRuleOut;
export type ForwardRuleDeleteApiV1ServersServerIdPortsPortIdForwardRuleDeleteApiArg =
  {
    serverId: number;
    portId: number;
  };
export type ForwardRulesRecreateApiV1ServersServerIdForwardRulesPostApiResponse =
  /** status 200 Successful Response */ PortForwardRuleOut[];
export type ForwardRulesRecreateApiV1ServersServerIdForwardRulesPostApiArg = {
  serverId: number;
};
export type ForwardRulesDeleteApiV1ServersServerIdForwardRulesDeleteApiResponse =
  /** status 200 Successful Response */ PortForwardRuleOut[];
export type ForwardRulesDeleteApiV1ServersServerIdForwardRulesDeleteApiArg = {
  serverId: number;
};
export type ForwardRuleRunnerGetApiV1ServersServerIdPortsPortIdForwardRuleArtifactsGetApiResponse =
  /** status 200 Successful Response */ PortForwardRuleArtifacts;
export type ForwardRuleRunnerGetApiV1ServersServerIdPortsPortIdForwardRuleArtifactsGetApiArg =
  {
    serverId: number;
    portId: number;
  };
export type UsersListApiV3UsersGetApiResponse =
  /** status 200 Successful Response */ any;
export type UsersListApiV3UsersGetApiArg = void;
export type HandleHttpGetApiGraphqlGetApiResponse =
  /** status 200 The GraphiQL integrated development environment. */ any;
export type HandleHttpGetApiGraphqlGetApiArg = void;
export type HandleHttpPostApiGraphqlPostApiResponse =
  /** status 200 Successful Response */ any;
export type HandleHttpPostApiGraphqlPostApiArg = void;
export type LoginApiTokenPostApiResponse =
  /** status 200 Successful Response */ any;
export type LoginApiTokenPostApiArg = {
  bodyLoginApiTokenPost: BodyLoginApiTokenPost;
};
export type SignupApiSignupPostApiResponse =
  /** status 200 Successful Response */ any;
export type SignupApiSignupPostApiArg = {
  bodySignupApiSignupPost: BodySignupApiSignupPost;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type UserPort = {
  port_id: number;
};
export type UserServer = {
  server_id?: number;
};
export type UserOpsOut = {
  email: string;
  is_active?: boolean;
  is_ops?: boolean;
  is_superuser?: boolean;
  first_name?: string;
  last_name?: string;
  id: number;
  notes?: string;
  download_usage?: number;
  readable_download_usage?: string;
  upload_usage?: number;
  readable_upload_usage?: string;
  allowed_ports: UserPort[];
  allowed_servers: UserServer[];
};
export type UserCreate = {
  email: string;
  is_active?: boolean;
  is_ops?: boolean;
  is_superuser?: boolean;
  first_name?: string;
  last_name?: string;
  password: string;
  notes?: string;
};
export type User = {
  email: string;
  is_active?: boolean;
  is_ops?: boolean;
  is_superuser?: boolean;
  first_name?: string;
  last_name?: string;
  id: number;
};
export type MeEdit = {
  email?: string;
  first_name?: string;
  last_name?: string;
  prev_password?: string;
  new_password?: string;
};
export type UserEdit = {
  email?: string;
  is_active?: boolean;
  is_ops?: boolean;
  is_superuser?: boolean;
  first_name?: string;
  last_name?: string;
  notes?: string;
  password?: string;
  clear_rules?: boolean;
};
export type UserOut = {
  email: string;
  is_active?: boolean;
  is_ops?: boolean;
  is_superuser?: boolean;
  first_name?: string;
  last_name?: string;
  id: number;
  notes?: string;
  allowed_ports: UserPort[];
  allowed_servers: UserServer[];
};
export type UserDelete = {
  remove_rule?: boolean;
};
export type UserServerServerOut = {
  id: number;
  name: string;
  address: string;
};
export type PortUsageOut = {
  port_id: number;
  download: number;
  upload: number;
  readable_download?: string;
  readable_upload?: string;
};
export type PortUserConfig = {
  quota?: number;
};
export type UserPortPortOut = {
  id: number;
  num: number;
  external_num?: number;
};
export type UserPortOut = {
  port_id: number;
  usage?: PortUsageOut;
  config: PortUserConfig;
  port: UserPortPortOut;
};
export type ServerUserConfig = {
  quota?: number;
};
export type UserServerOut = {
  server_id: number;
  server: UserServerServerOut;
  ports: UserPortOut[];
  config: ServerUserConfig;
  download?: number;
  upload?: number;
  readable_download?: string;
  readable_upload?: string;
};
export type PageUserOut = {
  items: UserOut[];
  total: number;
  page: number;
  size: number;
  pages?: number;
};
export type ServerFacts = {
  msg?: string;
  os_family?: string;
  architecture?: string;
  distribution?: string;
  distribution_release?: string;
  distribution_version?: string;
};
export type ServerConfig = {
  system?: ServerFacts;
  brook?: string;
  brook_disabled?: boolean;
  caddy?: string;
  caddy_disabled?: boolean;
  ehco?: string;
  ehco_disabled?: boolean;
  gost?: string;
  gost_disabled?: boolean;
  node_exporter?: string;
  node_exporter_disabled?: boolean;
  shadowsocks?: string;
  shadowsocks_disabled?: boolean;
  socat?: string;
  socat_disabled?: boolean;
  tiny_port_mapper?: string;
  tiny_port_mapper_disabled?: boolean;
  v2ray?: string;
  v2ray_disabled?: boolean;
  wstunnel?: string;
  wstunnel_disabled?: boolean;
  realm?: string;
  realm_disabled?: boolean;
  iperf?: string;
  iperf_disabled?: boolean;
  haproxy?: string;
  haproxy_disabled?: boolean;
};
export type ServerPortUserOut = {
  user_id: number;
};
export type ServerPortOut = {
  id: number;
  num: number;
  external_num?: number;
  allowed_users: ServerPortUserOut[];
};
export type UserOut2 = {
  id: number;
  email: string;
  is_active?: boolean;
  is_ops?: boolean;
};
export type LimitActionEnum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ServerUserConfig2 = {
  valid_until?: number;
  due_action?: LimitActionEnum;
  quota?: number;
  quota_action?: LimitActionEnum;
};
export type ServerUserOpsOut = {
  server_id: number;
  user_id: number;
  user: UserOut2;
  config: ServerUserConfig2;
  download?: number;
  upload?: number;
  readable_download?: string;
  readable_upload?: string;
};
export type ServerOpsOut = {
  name: string;
  address: string;
  id: number;
  config: ServerConfig;
  ports: ServerPortOut[];
  host?: string;
  port?: number;
  user?: string;
  ssh_password?: string;
  sudo_password?: string;
  allowed_users: ServerUserOpsOut[];
  is_active: boolean;
};
export type ServerOut = {
  name: string;
  address: string;
  id: number;
  config: ServerConfig;
  ports: ServerPortOut[];
};
export type ServerCreate = {
  name: string;
  address: string;
  host?: string;
  port?: number;
  user?: string;
  ssh_password?: string;
  sudo_password?: string;
};
export type ServerEdit = {
  name?: string;
  address?: string;
  host?: string;
  port?: number;
  user?: string;
  ssh_password?: string;
  sudo_password?: string;
  is_active?: boolean;
  config?: ServerConfig;
};
export type ServerConfigEdit = {
  brook_disabled?: boolean;
  caddy_disabled?: boolean;
  ehco_disabled?: boolean;
  gost_disabled?: boolean;
  node_exporter_disabled?: boolean;
  shadowsocks_disabled?: boolean;
  socat_disabled?: boolean;
  tiny_port_mapper_disabled?: boolean;
  v2ray_disabled?: boolean;
  wstunnel_disabled?: boolean;
  realm_disabled?: boolean;
  iperf_disabled?: boolean;
  haproxy_disabled?: boolean;
};
export type ServerConnectArg = {
  update_gost?: boolean;
  update_v2ray?: boolean;
};
export type ServerUserCreate = {
  user_id: number;
};
export type ServerUserEdit = {
  config?: ServerUserConfig2;
};
export type ServerUserOut = {
  server_id: number;
  user_id: number;
  config: ServerUserConfig2;
};
export type PageServerOut = {
  items: ServerOut[];
  total: number;
  page: number;
  size: number;
  pages?: number;
};
export type PageServerUserOpsOut = {
  items: ServerUserOpsOut[];
  total: number;
  page: number;
  size: number;
  pages?: number;
};
export type PortConfig = {
  egress_limit?: number;
  ingress_limit?: number;
  valid_until?: number;
  due_action?: LimitActionEnum;
  quota?: number;
  quota_action?: LimitActionEnum;
};
export type MethodEnum =
  | "brook"
  | "caddy"
  | "ehco"
  | "gost"
  | "iperf"
  | "iptables"
  | "node_exporter"
  | "shadowsocks"
  | "socat"
  | "tiny_port_mapper"
  | "v2ray"
  | "wstunnel"
  | "realm"
  | "haproxy";
export type PortForwardRuleOut = {
  method: MethodEnum;
  config: object;
  id: number;
  status?: string;
};
export type UserOut3 = {
  id: number;
  email: string;
  is_active?: boolean;
};
export type PortUserConfig2 = {};
export type PortUserOpsOut = {
  user_id: number;
  port_id: number;
  user: UserOut3;
  config: PortUserConfig2;
};
export type PortOpsOut = {
  external_num?: number;
  notes?: string;
  num: number;
  server_id: number;
  config?: PortConfig;
  id: number;
  is_active: boolean;
  usage?: PortUsageOut;
  forward_rule?: PortForwardRuleOut;
  allowed_users: PortUserOpsOut[];
};
export type PortOut = {
  external_num?: number;
  notes?: string;
  num: number;
  server_id: number;
  config?: PortConfig;
  id: number;
  usage?: PortUsageOut;
  forward_rule?: PortForwardRuleOut;
  allowed_users: PortUserOpsOut[];
};
export type PortCreate = {
  num: number;
  external_num?: number;
  notes?: string;
  config: PortConfig;
  is_active?: boolean;
};
export type PortEdit = {
  notes?: string;
  external_num?: number;
  is_active?: boolean;
  config?: PortConfig;
};
export type PortUserCreate = {
  user_id: number;
  config?: PortUserConfig2;
};
export type PortUserEdit = {
  user_id?: number;
  config?: PortUserConfig2;
};
export type PortUserOut = {
  user_id: number;
  port_id: number;
  config: PortUserConfig2;
};
export type PortUsageEdit = {
  port_id: number;
  download?: number;
  upload?: number;
  download_accumulate?: number;
  upload_accumulate?: number;
  download_checkpoint?: number;
  upload_checkpoint?: number;
};
export type PagePortOut = {
  items: PortOut[];
  total: number;
  page: number;
  size: number;
  pages?: number;
};
export type PortForwardRuleEdit = {
  method: MethodEnum;
  config: object;
};
export type PortForwardRuleCreate = {
  method: MethodEnum;
  config: object;
};
export type PortForwardRuleArtifacts = {
  stdout?: string;
};
export type BodyLoginApiTokenPost = {
  grant_type?: string;
  username: string;
  password: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
};
export type BodySignupApiSignupPost = {
  grant_type?: string;
  username: string;
  password: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
};
export const {
  useRootApiV1GetQuery,
  useMessageStreamApiStreamGetQuery,
  useUsersListApiV1UsersGetQuery,
  useUserCreateApiV1UsersPostMutation,
  useUserMeApiV1UsersMeGetQuery,
  useUserMeEditApiV1UsersMePutMutation,
  useUserDetailsApiV1UsersUserIdGetQuery,
  useUserEditApiV1UsersUserIdPutMutation,
  useUserDeleteApiV1UsersUserIdDeleteMutation,
  useUserServersGetApiV1UsersUserIdServersGetQuery,
  useUsersListApiV2UsersGetQuery,
  useServersListApiV1ServersGetQuery,
  useServerCreateApiV1ServersPostMutation,
  useServerGetApiV1ServersServerIdGetQuery,
  useServerEditApiV1ServersServerIdPutMutation,
  useServerDeleteApiV1ServersServerIdDeleteMutation,
  useServerConfigEditApiV1ServersServerIdConfigPutMutation,
  useServerConnectApiV1ServersServerIdConnectPostMutation,
  useServerUsersGetApiV1ServersServerIdUsersGetQuery,
  useServerUsersAddApiV1ServersServerIdUsersPostMutation,
  useServerUsersEditApiV1ServersServerIdUsersUserIdPutMutation,
  useServerUsersDeleteApiV1ServersServerIdUsersUserIdDeleteMutation,
  useServersListApiV2ServersGetQuery,
  useServerGetApiV2ServersServerIdGetQuery,
  useDetailedServerGetApiV2ServersServerIdDetailedGetQuery,
  useServerUsersGetApiV2ServersServerIdUsersGetQuery,
  usePortsListApiV1ServersServerIdPortsGetQuery,
  usePortCreateApiV1ServersServerIdPortsPostMutation,
  usePortGetApiV1ServersServerIdPortsPortIdGetQuery,
  usePortEditApiV1ServersServerIdPortsPortIdPutMutation,
  usePortDeleteApiV1ServersServerIdPortsPortIdDeleteMutation,
  usePortUsersGetApiV1ServersServerIdPortsPortIdUsersGetQuery,
  usePortUserAddApiV1ServersServerIdPortsPortIdUsersPostMutation,
  usePortUserEditApiV1ServersServerIdPortsPortIdUsersUserIdPutMutation,
  usePortUsersDeleteApiV1ServersServerIdPortsPortIdUsersUserIdDeleteMutation,
  usePortUsageEditApiV1ServersServerIdPortsPortIdUsagePostMutation,
  usePortsListApiV2ServersServerIdPortsGetQuery,
  useForwardRuleGetApiV1ServersServerIdPortsPortIdForwardRuleGetQuery,
  useForwardRuleEditApiV1ServersServerIdPortsPortIdForwardRulePutMutation,
  useForwardRuleCreateApiV1ServersServerIdPortsPortIdForwardRulePostMutation,
  useForwardRuleDeleteApiV1ServersServerIdPortsPortIdForwardRuleDeleteMutation,
  useForwardRulesRecreateApiV1ServersServerIdForwardRulesPostMutation,
  useForwardRulesDeleteApiV1ServersServerIdForwardRulesDeleteMutation,
  useForwardRuleRunnerGetApiV1ServersServerIdPortsPortIdForwardRuleArtifactsGetQuery,
  useUsersListApiV3UsersGetQuery,
  useHandleHttpGetApiGraphqlGetQuery,
  useHandleHttpPostApiGraphqlPostMutation,
  useLoginApiTokenPostMutation,
  useSignupApiSignupPostMutation,
} = injectedRtkApi;
