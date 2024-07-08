import { listOrganisation } from '../modules/organisation/controller.js'
import repository from '../modules/organisation/repository.js'

jest.mock('../modules/organisation/repository.js', () => ({
  fetchOrganisations: jest.fn(),
}))

describe('listOrganisation', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return organisations successfully', async () => {
    const req = { userId: 'user123' }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()
    const mockOrganisations = [
      { Organisations: [{ id: 1, name: 'Org 1' }] },
      { Organisations: [{ id: 2, name: 'Org 2' }] },
    ]
    repository.fetchOrganisations.mockResolvedValue(mockOrganisations)

    await listOrganisation(req, res, next)

    expect(repository.fetchOrganisations).toHaveBeenCalledWith('user123')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: 'success',
      message: 'Organisation retrieved sucessfully',
      data: {
        organisations: [{ id: 1, name: 'Org 1' }, { id: 2, name: 'Org 2' }],
      },
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should handle errors', async () => {
    const req = { userId: 'user123' }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()
    const error = new Error('Something went wrong')
    repository.fetchOrganisations.mockRejectedValue(error)

    await listOrganisation(req, res, next)

    expect(repository.fetchOrganisations).toHaveBeenCalledWith('user123')
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(error)
  })
})