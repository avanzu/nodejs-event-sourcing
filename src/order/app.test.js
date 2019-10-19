const makeOrderContext = require('./index')

describe('Order write side', () => {

    const getById = jest.fn()
    const save    = jest.fn()

    const eventStore   = {getById, save}
    const orderContext = makeOrderContext(eventStore)
    
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should create new orders', async () => {
      
        save.mockResolvedValue({ status: 'accept' })

        const promise = orderContext({command: 'CreateOrder'})
        
        await expect(promise).resolves.toMatchObject({ status: 'accept' })

        expect(save).toHaveBeenCalledWith(expect.objectContaining({
            streamId: expect.any(String),
            events  : [{
                eventType: 'OrderCreated',
                data     : { id: expect.any(String) }
            }]
        }))

    })

    it('should add events to existing orders', async () => {
        const id = 'e80818fd-d76a-4f42-9a97-bcc92beec9ae'
        getById.mockResolvedValue([{ type: 'OrderCreated', payload: {id}}])
        save.mockResolvedValue({status: 'accept'})

        const promise = orderContext({
            command: 'AssignCustomer', 
            payload: { 
                orderId : id,
                customer: { firstName: 'Karl', lastName: 'Kettenkit'}
            }
        })

        await expect(promise).resolves.toMatchObject({status: 'accept'})

        expect(save).toHaveBeenCalledWith(expect.objectContaining({
            streamId: id,
            events  : [{
                eventType: 'CustomerAssigned',
                data     : { firstName: 'Karl', lastName: 'Kettenkit'}
            }]
        }))
    })

})