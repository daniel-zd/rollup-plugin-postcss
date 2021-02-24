import pify from 'pify'
import { loadModule } from './utils/load-module'

export default {
  name: 'stylus',
  test: /\.(styl|stylus)$/,
  async process({ code }) {
    const stylus = loadModule('stylus')
    if (!stylus) {
      throw new Error('You need to install "stylus" packages in order to process Stylus files')
    }

    const style = stylus(code, {
      ...this.options,
      filename: this.id,
      sourcemap: this.sourceMap && {}
    })

    const css = await pify(style.render.bind(style))()
    const deps = style.deps()

    deps.forEach(dep => {
      this.dependencies.add(dep)
    })

    return {
      code: css,
      map: style.sourcemap
    }
  }
}
