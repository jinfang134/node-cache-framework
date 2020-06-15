import test from 'ava';

import { getParamNames } from '../src/public-api'



test('template', async t => {
    // tslint:disable-next-line: no-empty
    const list = getParamNames( (name: string, id: number)=> { })
    console.log(list)
    t.deepEqual(list, ['name', 'id'])
})