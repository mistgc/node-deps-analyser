const world = 'world';

function hello(who: string = world): string {
  return `Hello ${who}!`;
}

console.log(hello(world))
