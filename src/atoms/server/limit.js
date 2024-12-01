import { atomWithStorage } from 'jotai/utils'

const serverLimitAtom = atomWithStorage('serverLimit', 10)

export default serverLimitAtom