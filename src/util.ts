
interface ArrayHighOrderCallback {
  (currentValue: any, index?: number, sourceArray?: Array<any>): boolean;
}
/**
 * 
 * @param {Array} sourceArray array target
 * @param {ArrayHighOrderCallback} callback 
 */
export function findIndex(sourceArray: any[], callback: ArrayHighOrderCallback): number {
  for(let i:number = 0; i < sourceArray.length; i++) {
    if(callback(sourceArray[i], i, sourceArray)) {
      return i
    }
  }
  return -1
}

export const merge = <T>(target: T, ...source: T[]): T => {
  for(let i = source.length - 1; i >= 0; i--) {
    let item = source[i]
    for (var key in item) {
      if (item.hasOwnProperty(key) && !target[key]) {
        target[key] = item[key]
      }
    }
  }
  return target
}
export const get = (sourceTarget:any, propName: string, defaultValue?: any) => sourceTarget ? sourceTarget[propName] : defaultValue


export interface Promiser {
  resolve: (...args: any[]) => void;
  reject: (...args: any[]) => void;
  state: 'pending' | 'resolved' | 'rejected'
}

export function bulidPromPending(getPromiser: (args: Promiser) => any, errorHandler: (error: Error) => any): Promise<any> {
  let promiser:Promiser|any = {}
  let promise = new Promise((resolve, reject) => {
    promiser.state = 'pending'
    promiser.resolve = function(...args: any[]) {
      this.state = 'resolved'
      resolve(...args)
    }
    promiser.reject = function(...args: any[]) {
      this.state = 'rejected'
      reject(...args)
    }
  })
  // promise = merge(promise, promiser)
  // ??? 为什么要异步
  setTimeout(() => {
    getPromiser(promiser)
  }, 0)
  // 
  if (errorHandler) {
    rewriteCatchThen(promise, errorHandler)
  }
  return promise
}

function rewriteCatchThen(promise: Promise<any>, callback: (error: Error) => any) {
  if (!callback || typeof callback !== 'function') return false
  // 要重写catch
  const promiseCatch = promise.catch
  const promiseThen = promise.then
  let hasCatch = false

  // 永远都会先触发
  promiseCatch.call(promise, function(err: Error) { 
    hasCatch === false && callback(err)
    return {}
  })

  // rewirte then
  let THEN_TIME = 0
  promise.then = function <TResult1, TResult2>(resolveCall?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null | undefined, rejectCall?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<any>{
    THEN_TIME++
    if (THEN_TIME === 1 && rejectCall && hasCatch === false) {
      hasCatch = true
    }
    return promiseThen.call(this, resolveCall, rejectCall)
  }

  // rewirte catch
  let catchTime = 0
  promise.catch = function(fn) {
    // 是否有全局的
    catchTime++
    if (catchTime === 1 && hasCatch === false && fn) {
      hasCatch = true
    }
    return promiseCatch.call(this, fn)
  }

  return promise
}


export function getType(target: any) {
  return Object.prototype.toString.call(target).slice(8, -1)
}
export function expect(target: any, ...args: string[]) {
  return findIndex(args, t => t === getType(target)) > 0
}


export const isEmptyObject = (obj: Object): boolean => Object.keys(obj).length === 0


export class CreateError extends Error {
  constructor(name: string, message: string) {
    super(message)
    this.name = name
  }
}


export const warn = (message:any) => {
  if(process.env.NODE_ENV !== 'production' && message && console && console.warn) {
    console.warn(message)
  }
}


