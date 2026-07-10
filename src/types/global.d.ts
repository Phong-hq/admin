export {}

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  declare type Nullable<T> = { [K in keyof T]: T[K] | null }

  declare type MetaResponse = Nullable<{
    totalCount: number
    pageCount: number
    currentPage: number
    perPage: number
  }>

  declare type DataWithMetaResponse<T, Extra = {}> = {
    items: T
    _meta: MetaResponse
  } & Extra

  // PROMISE
  declare type Resolve = typeof ReturnType<Promise.resolve>
  declare type Reject = typeof ReturnType<Promise.reject>
}
