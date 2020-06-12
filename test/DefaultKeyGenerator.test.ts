import test from 'ava';
import { DefaultKeyGenerator } from '../src/public-api'

const target: DefaultKeyGenerator = new DefaultKeyGenerator()

test('get setting', async t => {
  const args: any = { name: 'test', id: 2 }
  const key: string = target.generate('test', 'getName', args);
  t.is(key, 'getName' + JSON.stringify(args));
});


test('get setting', async t => {
  const args: any = {
    name: 'test',
    id: 2,
    user: {
      age: 10,
      userId: 20
    }
  }
  const key: string = target.generate('test', 'getName', args, "${ user.userId }+${name}");
  t.is(key, 'getName' + args.user.userId + '+' + args.name);
});

test('template', async t => {
  const args: any = { name: 'test', id: 2 }
  const str: string = target.template('${id}', args);
  t.is(str, '2')
})