const { Observable, from: observableFrom } = require('rxjs')
const  Task  = require('fp-types/lib/task')

/**
 * 
 * @param {Task<T>} task 
 * @summary observableFromTask:: Task<T> -> Observable<T>
 */
const observableFromTask = task => 
    new Observable(subscriber => task.fork(e => subscriber.error(e), value => (subscriber.next(value), subscriber.complete())))
/**
 * 
 * @param {*} observable 
 * @summary observableToTask :: Observable<T> -> Task<T>
 */
const observableToTask = observable => new Task((error, resolve) => {
    observable.toPromise().then(resolve).catch(error)
})
/**
 * 
 * @param {*} promise 
 * @summary promiseToTask :: Promise<T> -> Task<T>
 */
const promiseToTask   = promise => 
    new Task((reject, resolve) =>  promise.then(resolve).catch(reject))

/**
 * 
 * @param {*} task 
 * @summary promiseFromTask :: Task<T> -> Promise<T>
 */    
const promiseFromTask = task  => 
    new Promise((resolve, reject) => task.fork(reject,resolve))

/**
 * 
 * @param {*} observable 
 * @summary observableToPromise :: Observable<T> -> Promise<T>
 */
const observableToPromise = observable => observable.toPromise()
/**
 * 
 * @param {*} either 
 * @summary promiseFromEither :: Either<T> -> Promise<T>
 */
const promiseFromEither    = either  => 
    new Promise((resolve, reject) => either.fold(reject, resolve))
/**
 * 
 * @param {*} either 
 * @summary taskFromEither :: Either<T> -> Task<T>
 */    
const taskFromEither       = either  => 
    new Task((reject, resolve)    => either.fold(reject, resolve))
/**
 * 
 * @param {*} either 
 * @summary observableFromEither :: Either<T> -> Observable<T>
 */    
const observableFromEither = either  => 
    new Observable(subscriber => either.fold(e => subscriber.error(e), value => (subscriber.next(value), subscriber.complete())))


module.exports = { 
    observableFromTask, 
    observableFrom,
    observableToPromise,
    observableToTask,
    promiseToTask,
    promiseFromTask,
    promiseFromEither,
    taskFromEither,
    observableFromEither
}
