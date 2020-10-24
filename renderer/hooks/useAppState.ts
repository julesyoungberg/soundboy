import { useContext } from 'react'

import { StateContext, StateContextType } from '../state'

export default function useAppState(): StateContextType {
    return useContext(StateContext)
}
