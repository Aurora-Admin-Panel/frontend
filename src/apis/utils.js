import axios from 'axios'
// TODO: find if there is a way to avoid depending on store
import { getDefaultStore } from 'jotai';
import { authAtom } from '../atoms/auth';


export const apiRequest = request => axios({...request, url: `/api${request.url}`});

export const v1Request = request => axios({...request, url: `/api/v1${request.url}`});
export const v1AuthRequest = request => axios({
  ...request,
  url: `/api/v1${request.url}`,
  headers: {
    ...request.headers,
    Authorization: `Bearer ${getDefaultStore().get(authAtom).token}`
  }
});

export const v2AuthRequest = request => axios({
  ...request,
  url: `/api/v2${request.url}`,
  headers: {
    ...request.headers,
    Authorization: `Bearer ${getDefaultStore().get(authAtom).token}`
  }
});

export const v3AuthRequest = request => axios({
  ...request,
  url: `/api/v3${request.url}`,
  headers: {
    ...request.headers,
    Authorization: `Bearer ${getDefaultStore().get(authAtom).token}`
  }
});
