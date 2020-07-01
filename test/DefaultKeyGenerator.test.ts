import { DefaultKeyGenerator } from '../src/public-api'

const target: DefaultKeyGenerator = new DefaultKeyGenerator()

test('should return a key as json format',  () => {
  const args: any = { name: 'test', id: 2 }
  const key: string = target.generate('test', 'getName', args);
  expect(key).toBe(`getName${JSON.stringify(args)}`);
});


test('should return a key generated with key template',  () => {
  const args: any = {
    name: 'test',
    id: 2,
    user: {
      age: 10,
      userId: 20
    }
  }
  const key: string = target.generate('test', 'getName', args, "${ user.userId }+${name}");
  expect(key).toBe(args.user.userId + '+' + args.name);
});

test('should return a string replaced with js template.',  () => {
  const args: any = { name: 'test', id: 2 }
  const str: string = target.template('${id}', args);
  expect(str).toBe('2')
})