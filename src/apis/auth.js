import { apiRequest  } from "./utils";

export const logIn = data => apiRequest({
  method: "post",
  url: '/token',
  data: new URLSearchParams(data).toString(),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

export const getToken = (token) => apiRequest({
  method: "get",
  url: '/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${token}`
  }
});

export const register = data => apiRequest({
  method: "post",
  url: '/signup',
  data: new URLSearchParams(data).toString(),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})