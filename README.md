# react-hehe-utils

### Resource

```js
import { Resource } from 'react-hehe-utils';

const res = new Resource('/web-api/1.0/users/:id', {
    list: {
        url: '/web-api/1.0/users/list',
        method: 'get',
        params: {
            pageSize: 10,
            pageNum: 1
        }
    }
});

res.get({id: 9527}).then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});

res.list().then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
})

/*
*  自动生成
*  get(params, config); // method: get
*  save(params, data, config); // method: post
*  remove(params, config); // method: delete
*  delete(params, config); // method: delete
*  update(params, data, config); // method: put
*
*  注意 config 参数的配置
*  https://github.com/mzabriskie/axios#request-config
*
*  config 中的三个参数:
*  url 没有任何作用
*  data 会 merge 到 data 参数中
*  params 会追加到 url 后面
* */
```
