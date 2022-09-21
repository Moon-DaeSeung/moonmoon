import { goto } from "$app/navigation"
import { get, writable, type Writable } from "svelte/store"
import { page } from "$app/stores"
import { getContext, setContext } from "svelte"

const KEY = Symbol("SEARCH_PARAMS")

type SearchParams = {
  [key in Exclude<string, "toString">]: string | undefined 
} & {
  toString: () => string
}

export const initializeSearchParamsContext = (invokeFetch?: boolean, options?: { replaceState?: boolean; noscroll?: boolean; keepfocus?: boolean; state?: any }) => {
  setContext(KEY, createSearchParams(invokeFetch, options))
}

export const getSearchParams = () => {
  return getContext<Writable<SearchParams>>(KEY)
}

function createSearchParams(
  invokeFetch = false,
  options: { replaceState?: boolean; noscroll?: boolean; keepfocus?: boolean; state?: any } = { noscroll: true, keepfocus: true }
) {
  const initial = resolveUrlParams(get(page).url.searchParams)
  const params = writable(initial) 

  function set (value: SearchParams, syncUrl = true) {
    params.set(value)
    if(!syncUrl) return
    let query = "?"
    Object.entries(value).forEach(([key, value]) => {
      if (!value) return
      if(key === "toString") return
      query += (query === "?" ? "" : "&") + `${key}=${value}`
    })
    const url = window.location.pathname + query + window.location.hash
    invokeFetch ? goto(url, options) : window.history.pushState({},"",url)
  }

  page.subscribe((value) => {
    const temp = resolveUrlParams(value.url.searchParams)
    set(temp, false)
  })

 return {
    set,
    subscribe: params.subscribe,
    update: params.update
 }
}

function resolveUrlParams(urlSearchParams: URLSearchParams) {
  const result = {} as SearchParams
  urlSearchParams.forEach((value, key) => {
    result[key] = value
  })
  result.toString = function () {
    const result: string[] = []
    const keys = Object.keys(this)
    for(const key of keys) {
      if(key === "toString") continue
      const param = this[key]
      if(!param) continue
      result.push(`${key}=${param}`)
    }
    return result.join("&")
  }
  return result
}