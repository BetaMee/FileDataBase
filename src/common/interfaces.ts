import { Map } from 'immutable'

export interface IFMDefaultData<T> {
    _fmName: string,
    _fmPath: string,
    _fmCreated: string,
    _fmUpdated: string,
    _fmData: T
}

export type IFMObject<T> = T

export type IFMState = Map<string, any> | null