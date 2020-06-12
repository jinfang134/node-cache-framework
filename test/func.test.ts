import test from 'ava';

import { getParamNames } from '../src/public-api'



test('template', async t => {
    let list = getParamNames(function (name: string, id: number) { })
    console.log(list)
    t.deepEqual(list, ['name', 'id'])
})