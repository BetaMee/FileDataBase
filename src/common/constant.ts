/**
 * 错误类型
 */
 export const GlobalErrorType = {
    FDB_ERROR_INITFAIL: '数据库加载失败',
    FDB_ERROR_REMOVEFILE: '数据库删除文件失败',

    FM_ERROR_NOTLOADEDDATA: '文件数据尚未加载',
    FM_ERROR_LOADFAIL: '文件数据加载失败',
    FM_ERROR_WRITEFAIL: '文件数据写入失败',
    FM_ERROR_WRITENULL_FORRBIDDEN: '空数据，无法写入文件',
    FM_ERROR_SET_FORRBIDDEN: '不可变对象错误，禁止set写入',
    FM_ERROR_SETIN_FORRBIDDEN: '不可变对象错误，禁止setIn写入',
    FM_ERROR_STATE_COVER_FORRBIDDEN: '状态不可被覆盖'
}
