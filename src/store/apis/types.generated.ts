export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Decimal: any;
  JSON: any;
  Upload: any;
};

export type File = {
  __typename?: 'File';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  name: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  size: Scalars['Decimal'];
  storagePath: Scalars['String'];
  type: FileTypeEnum;
  updatedAt: Scalars['DateTime'];
  version?: Maybe<Scalars['String']>;
};

export type FilePaginationWindow = {
  __typename?: 'FilePaginationWindow';
  /** The total number of items in the list. */
  count: Scalars['Int'];
  /** The list of items in the window. */
  items: Array<File>;
};

export enum FileTypeEnum {
  Executable = 'EXECUTABLE',
  Image = 'IMAGE',
  Secret = 'SECRET',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export enum MethodEnum {
  Brook = 'BROOK',
  Caddy = 'CADDY',
  Ehco = 'EHCO',
  Gost = 'GOST',
  Haproxy = 'HAPROXY',
  Iperf = 'IPERF',
  Iptables = 'IPTABLES',
  NodeExporter = 'NODE_EXPORTER',
  Realm = 'REALM',
  Shadowsocks = 'SHADOWSOCKS',
  Socat = 'SOCAT',
  TinyPortMapper = 'TINY_PORT_MAPPER',
  V2Ray = 'V2RAY',
  Wstunnel = 'WSTUNNEL'
}

export type Mutation = {
  __typename?: 'Mutation';
  addPort: Scalars['Boolean'];
  addPortUser: Scalars['Boolean'];
  addServer: Scalars['Boolean'];
  addServerUser: Scalars['Boolean'];
  createUser: User;
  deleteFile: Scalars['Boolean'];
  deletePort: Scalars['Boolean'];
  deletePortUser: Scalars['Boolean'];
  deleteServer: Scalars['Boolean'];
  deleteServerUser: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  updateFile: Scalars['Boolean'];
  updatePort: Scalars['Boolean'];
  updatePortUser: Scalars['Boolean'];
  updateServer: Scalars['Boolean'];
  updateServerUser: Scalars['Boolean'];
  updateUser: Scalars['Boolean'];
  uploadFile: File;
};


export type MutationAddPortArgs = {
  config?: InputMaybe<Scalars['JSON']>;
  externalNum?: InputMaybe<Scalars['Int']>;
  notes?: InputMaybe<Scalars['String']>;
  num: Scalars['Int'];
  serverId: Scalars['Int'];
};


export type MutationAddPortUserArgs = {
  config?: InputMaybe<Scalars['JSON']>;
  portId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationAddServerArgs = {
  address: Scalars['String'];
  config?: InputMaybe<Scalars['JSON']>;
  host?: InputMaybe<Scalars['String']>;
  keyFileId?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  port?: InputMaybe<Scalars['Int']>;
  sshPassword?: InputMaybe<Scalars['String']>;
  sudoPassword?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
};


export type MutationAddServerUserArgs = {
  notes?: InputMaybe<Scalars['String']>;
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  isOps?: InputMaybe<Scalars['Boolean']>;
  isSuperuser?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
};


export type MutationDeleteFileArgs = {
  id: Scalars['Int'];
};


export type MutationDeletePortArgs = {
  id: Scalars['Int'];
};


export type MutationDeletePortUserArgs = {
  portId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationDeleteServerArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteServerUserArgs = {
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateFileArgs = {
  file?: InputMaybe<Scalars['Upload']>;
  id: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<FileTypeEnum>;
  version?: InputMaybe<Scalars['String']>;
};


export type MutationUpdatePortArgs = {
  config?: InputMaybe<Scalars['JSON']>;
  externalNum?: InputMaybe<Scalars['Int']>;
  id: Scalars['Int'];
  notes?: InputMaybe<Scalars['String']>;
  num?: InputMaybe<Scalars['Int']>;
  serverId?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdatePortUserArgs = {
  config?: InputMaybe<Scalars['JSON']>;
  portId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationUpdateServerArgs = {
  address?: InputMaybe<Scalars['String']>;
  config?: InputMaybe<Scalars['JSON']>;
  host?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  keyFileId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  port?: InputMaybe<Scalars['Int']>;
  sshPassword?: InputMaybe<Scalars['String']>;
  sudoPassword?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateServerUserArgs = {
  notes?: InputMaybe<Scalars['String']>;
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  isOps?: InputMaybe<Scalars['Boolean']>;
  isSuperuser?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload'];
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  type: FileTypeEnum;
  version?: InputMaybe<Scalars['String']>;
};

export type Port = {
  __typename?: 'Port';
  allowedUsers: Array<PortUser>;
  config: Scalars['JSON'];
  externalNum?: Maybe<Scalars['Int']>;
  forwardRule?: Maybe<PortForwardRule>;
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  num: Scalars['Int'];
  server: Server;
  serverId: Scalars['Int'];
  usage?: Maybe<PortUsage>;
  users: Array<User>;
};

export type PortForwardRule = {
  __typename?: 'PortForwardRule';
  config: Scalars['JSON'];
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  method: MethodEnum;
  port: Port;
  portId: Scalars['Int'];
  status: Scalars['String'];
};

export type PortPaginationWindow = {
  __typename?: 'PortPaginationWindow';
  /** The total number of items in the list. */
  count: Scalars['Int'];
  /** The list of items in the window. */
  items: Array<Port>;
};

export type PortUsage = {
  __typename?: 'PortUsage';
  download: Scalars['Decimal'];
  downloadAccumulate: Scalars['Decimal'];
  downloadCheckpoint: Scalars['Int'];
  id: Scalars['Int'];
  port: Port;
  portId: Scalars['Int'];
  upload: Scalars['Decimal'];
  uploadAccumulate: Scalars['Decimal'];
  uploadCheckpoint: Scalars['Int'];
};

export type PortUser = {
  __typename?: 'PortUser';
  config: Scalars['JSON'];
  id: Scalars['Int'];
  port: Port;
  portId: Scalars['Int'];
  user: User;
  userId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  files: Array<File>;
  paginatedFiles: FilePaginationWindow;
  paginatedPorts: PortPaginationWindow;
  paginatedServers: ServerPaginationWindow;
  paginatedUsers: UserPaginationWindow;
  port?: Maybe<Port>;
  portForwardRule?: Maybe<PortForwardRule>;
  ports: Array<Port>;
  ruleOptions: Array<Scalars['String']>;
  server?: Maybe<Server>;
  servers: Array<Server>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryFilesArgs = {
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<FileTypeEnum>;
};


export type QueryPaginatedFilesArgs = {
  limit?: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
  offset?: Scalars['Int'];
  orderBy?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<FileTypeEnum>;
};


export type QueryPaginatedPortsArgs = {
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
  orderBy?: Scalars['String'];
  serverId?: InputMaybe<Scalars['Int']>;
};


export type QueryPaginatedServersArgs = {
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
  orderBy?: Scalars['String'];
};


export type QueryPaginatedUsersArgs = {
  email?: InputMaybe<Scalars['String']>;
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
  orderBy?: InputMaybe<Scalars['String']>;
};


export type QueryPortArgs = {
  id?: InputMaybe<Scalars['Int']>;
  num?: InputMaybe<Scalars['Int']>;
  serverId?: InputMaybe<Scalars['Int']>;
};


export type QueryPortForwardRuleArgs = {
  portId: Scalars['Int'];
};


export type QueryPortsArgs = {
  orderBy?: Scalars['String'];
};


export type QueryRuleOptionsArgs = {
  portId: Scalars['Int'];
};


export type QueryServerArgs = {
  address?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryServersArgs = {
  orderBy?: Scalars['String'];
};


export type QueryUserArgs = {
  email?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  notes?: InputMaybe<Scalars['String']>;
};


export type QueryUsersArgs = {
  orderBy?: InputMaybe<Scalars['String']>;
};

export type Server = {
  __typename?: 'Server';
  address: Scalars['String'];
  allowedUsers: Array<ServerUser>;
  config: Scalars['JSON'];
  downloadTotal: Scalars['Decimal'];
  host?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  keyFile: File;
  keyFileId?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  port?: Maybe<Scalars['Int']>;
  portTotal: Scalars['Int'];
  portUsed: Scalars['Int'];
  ports: Array<Port>;
  sshPassword?: Maybe<Scalars['String']>;
  sshPasswordSet: Scalars['Boolean'];
  sudoPassword?: Maybe<Scalars['String']>;
  sudoPasswordSet: Scalars['Boolean'];
  uploadTotal: Scalars['Decimal'];
  user?: Maybe<Scalars['String']>;
  users: Array<User>;
};

export type ServerPaginationWindow = {
  __typename?: 'ServerPaginationWindow';
  /** The total number of items in the list. */
  count: Scalars['Int'];
  /** The list of items in the window. */
  items: Array<Server>;
};

export type ServerUser = {
  __typename?: 'ServerUser';
  config: Scalars['JSON'];
  download: Scalars['Int'];
  id: Scalars['Int'];
  notes?: Maybe<Scalars['String']>;
  server: Server;
  serverId: Scalars['Int'];
  upload: Scalars['Int'];
  user: User;
  userId: Scalars['Int'];
};

export type Subscription = {
  __typename?: 'Subscription';
  count: Scalars['Int'];
};


export type SubscriptionCountArgs = {
  target?: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  allowedPorts: Array<PortUser>;
  allowedServers: Array<ServerUser>;
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  hashedPassword: Scalars['String'];
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  isOps: Scalars['Boolean'];
  isSuperuser: Scalars['Boolean'];
  lastName?: Maybe<Scalars['String']>;
  notes: Scalars['String'];
  ports: Array<Port>;
  servers: Array<Server>;
};

export type UserPaginationWindow = {
  __typename?: 'UserPaginationWindow';
  /** The total number of items in the list. */
  count: Scalars['Int'];
  /** The list of items in the window. */
  items: Array<User>;
};
