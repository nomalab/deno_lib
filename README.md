# deno_lib
Deno lib to handle Nomalab API with deno

# Example
```ts
const apiToken = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const context = 'beta'
const nomalab = new Nomalab(context, apiToken);
const show = await nomalab.getShow('xxx-x-xxx--xxxx-xxxxx');
```
