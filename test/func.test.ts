import { getParamNames } from '../src/public-api'



test('template',  () => {
    // tslint:disable-next-line: no-empty
    const list = getParamNames( (name: string, id: number)=> { })
    expect(list).toEqual(['name', 'id'])
})