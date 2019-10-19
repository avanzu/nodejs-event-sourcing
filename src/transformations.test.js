const transformations = require('./transformations')
const Task   = require('fp-types/lib/task')
const {of}   = require('rxjs')

describe('Natural transformations', () => {


    describe('Observables and Tasks', () => {
        const { observableFromTask, observableToTask } = transformations

        it('should transform Task.of to observable', complete => {
            const observable = observableFromTask(Task.of(1))
        
            observable.subscribe({
                next    : (value) => expect(value).toEqual(1),
                error   : complete, 
                complete: complete
          
            })    
        })

        it('should transform Task.rejected to observable', complete => {
            const error =  new Error('Test error')
            const observable = observableFromTask(Task.rejected(error))
        
            observable.subscribe({
                error: e => (expect(e).toEqual(error), complete())
            })
        })
        
        it('should transform observables to Tasks', complete => {
            const task = observableToTask(of(1))
            task.map(val => expect(val).toEqual(1)).fork(complete, complete)
        })

    })


})