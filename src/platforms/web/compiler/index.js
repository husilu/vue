/* @flow */

import { baseOptions } from './options' // 跟web平台相关的选项
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
