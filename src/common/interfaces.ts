import { Map } from 'immutable'

/**
 * FBD Manifest 接口
 */
 export interface IFDBManifest {
    _fdbVersion: string,
    _fdbName: string,
    _fdbPath: string,
    _fdbFileList: string[]
}

export interface IFMDefaultData<T> {
    _fmName: string,
    _fmPath: string,
    _fmCreated: string,
    _fmUpdated: string,
    _fmData: T
}

export type IFMObject<T> = T

export type IFMState = Map<string, any> | null