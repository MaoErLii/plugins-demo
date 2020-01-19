# 编写 webpack plugin 相关

插件为第三方开发者展示了webpack 引擎的全部潜力; 使用分阶段的构建回调，开发者可以将自己的行为引入到webpack构建过程中；编写plugin需要理解webpack底层交互；

***

## 创建一个插件（Creating a Plugin）

一个插件包含

* 一个命名的js方法（function）或js类（class）
* 在其原型中定义 apply 方法
* 指定一个 事件hook 去调用
* 操作 webpack 内部实例去操作具体数据
* 功能完成后，调用 webpack 提供的回调

example

```javaScript

// A javaScript class
class ExampleWebpackPlugin {
  // 定义 apply 作为其原型方法（编译器作为其参数）
  apply(complier) {
    // 根据特定的 事件hook 去 执行
    complier.hooks.emit.tapAsycn(
      'ExampleWebpackPlugin',
      (compilation, callback) => {
        console.log('这是示例插件')
        console.log('compilation', compilation)

        // 操作 build 通过 webpack 提供 的plugin Api
        compilation.addModule(/* ... */)

        callback()
      }
    )
  }
}

```

## 插件的基本架构

插件 是 原型上有 apply 方法的实例对象；插件安装时，webpack 编译器会调用 apply 方法；apply 方法引用 webpack 基础编译器，并授予对编译器回调的访问权限；

```javaScript

class HelloWorldPlugin {
  apply(compiler) {
    comilper.hooks.done.tap('Hello World Plugin', (
      satas /* stats is passed as argument wehen done hook is tapped. */
    ) => {
      console.log('Hello World!')
    })
  }
}

module.exports = HellWorldPlugin

```

在 webpack 的 plugin 数组中使用该实例

```javaScript

var HelloWorldPlugin = require('hello-world')

module.exports = {
  // ... config settings here ...
  plugins: [new HelloWorldPlugin({ options: true })]
}

```

## 编译器与编译（compiler & compilation）

在开发 插件 时，最重要的两个就是 编译器（compiler）和编译（compilation） 对象（object）了；

了解它们的职责，是拓展 webpack 的第一步。

```javaScript

class HelloCompilationPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HelloCompilationPlugin', compilation => {
      compilation.hooks.optimize.tap('HelloCompilationPlugin', () => {
        console.log('Assets are being optimized')
      })
    })
  }
}

```

编译器和编译的可用的hooks 可以通过 plugins API docs（https://webpack.js.org/api/plugins/） 查看

## 异步事件钩子

可以用同步的 tap 方法 或 异步方法 tapAsync / tapPromise 等方法

>### tapAsync
>
> 使用 tapAsync 方法来进入 plugins， 我们需要为函数的最后一个参数提供 callback 回调
>
> ```javaScript
>  class HelloAsyncPlugins {
>   apply(compiler) {
>     compiler.hooks.emit.tapAsync('HelloAsyncPlugin', (compilation, callback) => {
>       // Do something async...
>       setTimeout(function() {
>         console.log('Done with async work...')
>         callback()
>        }, 1000)
>     })
>   }
>  }
>
> module.exports = HelloAsyncPlugin  
>```

***

>### tapPromise
>
>当使用 tapPromise 方法进入plugins中时，需要在方法完成后>返回一个带有resolve（）的 promise
>
>```javaScript
>
>class HelloPromisePlugins {
>  apply(compiler) {
>    compiler.hooks.emit.tapPromise('HelloAsyncPlugin', compilation => {
>      // return a Promise that resolves when we are done...
>      return new Promise((resolve, reject) => {
>        setTimeout(function() {
>          console.log('Done with async work...')
>          resolve()
>        }, 1000)
>      })
>    })
>  }
>}
>
>module.exports = HelloPromisePlugins
>```

***

## 例子
