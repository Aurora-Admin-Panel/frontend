import decodeJwt from "jwt-decode";
import { useReducerAtom, atomWithStorage } from 'jotai/utils'

const authReducer = (prev, action) => {
    if (action.type === 'login') {
        const decodedToken = decodeJwt(action.payload["access_token"]);
        // TODO: Maybe throw error here
        console.log(decodedToken)
        return {
            token: action.payload["access_token"],
            permissions: decodedToken["permissions"]
        }
    } else if (action.type === 'logout') {
        return {
            token: '',
            permissions: ''
        }
    } else {
        throw new Error(`unhandled action type: ${action.type}`)
    }
}
export const authAtom = atomWithStorage('auth', {
    token: '',
    permissions: '',
})

export const useAuthReducer = () => {
    const [auth, dispatch] = useReducerAtom(authAtom, authReducer)
    return [auth, dispatch]   
}