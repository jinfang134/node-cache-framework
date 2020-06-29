import { getParamNames } from '../src/public-api'



test('template',  () => {
    // tslint:disable-next-line: no-empty
    const list = getParamNames( (name: string, id: number)=> { })
    console.log(list)
    expect(list).toEqual(['name', 'id'])
})