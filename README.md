# 物流仓储管理系统

> 基于Nuxt.js框架开发，后端使用Koa2框架，简单模拟了物流仓储管理。

## 运行效果

![image-20200705233745126](https://github.com/JammyLin/wms/blob/master/demo/login.png)

![image-20200705233836207](https://github.com/JammyLin/wms/blob/master/demo/register.png)

![image-20200705233632032](https://github.com/JammyLin/wms/blob/master/demo/index.png)

![image-20200705233902866](https://github.com/JammyLin/wms/blob/master/demo/dashboard.png)

![image-20200705234014986](https://github.com/JammyLin/wms/blob/master/demo/users.png)

## Bug

部分页面加载时会请求两次后端接口。解决方法：将asyncData更换为vue自带的生命周期mounted来获取数据。

## 运行准备

```bash
# 安装依赖
$ yarn install/npm install

# 开发模式运行
$ yarn dev/npm run dev

# 打包运行
$ yarn build/npm run build
$ yarn start/npm run start
```

> 数据库使用sequelize，可自动生成表，在server/database/index.js尾部添加
>
> ```
> sequelize.sync()
> ```
>
> 即可。

