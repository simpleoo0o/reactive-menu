const customRules = {
  'selector-class-pattern': [
    '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$|^el-([a-z][a-z0-9]*)((--?)?(__)?[a-z0-9]+)*$',
    {
      message: (selector) => `自定义的class选择器必须使用短横线命名方式(kebab-case),请修改"${selector}"`
    }
  ],
  'selector-pseudo-class-no-unknown': [
    true,
    {
      ignorePseudoClasses: [
        'deep',
        'global'
      ]
    }
  ],
  'selector-pseudo-element-no-unknown': [
    true,
    {
      ignorePseudoElements: [
        'v-deep',
        'v-global',
        'v-slotted'
      ]
    }
  ],
  'at-rule-no-unknown': [
    true,
    {
      ignoreAtRules: [
        'forward',
        'use',
        'tailwind',
        'apply',
        'variants',
        'responsive',
        'screen',
        'function',
        'if',
        'each',
        'include',
        'mixin'
      ]
    }
  ],
  'no-descending-specificity': null,
  'rule-empty-line-before': [
    'always',
    {
      ignore: [
        'after-comment',
        'first-nested'
      ]
    }
  ],
  'unit-no-unknown': [
    true,
    {
      ignoreUnits: ['rpx']
    }
  ],
  'order/order': [
    [
      'dollar-variables',
      'custom-properties',
      'at-rules',
      'declarations',
      {
        type: 'at-rule',
        name: 'supports'
      },
      {
        type: 'at-rule',
        name: 'media'
      },
      'rules'
    ],
    { severity: 'warning' }
  ],
  'function-no-unknown': [true, { 'ignoreFunctions': ['v-bind'] }]
}

const scssConfig = {
  files: ['*.scss', '**/*.scss'],
  customSyntax: 'postcss-scss',
  extends: ['stylelint-config-standard-scss', 'stylelint-config-standard-vue/scss'],
  rules: customRules
}

const lessConfig = {
  files: ['*.less', '**/*.less'],
  customSyntax: 'postcss-less',
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
  rules: customRules
}

export default {
  root: true,
  plugins: ['stylelint-order'],
  extends: ['stylelint-config-standard'],
  customSyntax: 'postcss-html',
  rules: customRules,
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
  overrides: [
    {
      files: ['*.html', '**/*.html', '*.css', '**/*.css'],
      extends: ['stylelint-config-standard'],
      customSyntax: 'postcss-html',
      rules: customRules
    },
    {
      files: ['*.vue', '**/*.vue'],
      extends: ['stylelint-config-standard'],
      rules: customRules,
      overrides: [
        scssConfig,
        lessConfig
      ]
    },
    scssConfig,
    lessConfig
  ]
}
