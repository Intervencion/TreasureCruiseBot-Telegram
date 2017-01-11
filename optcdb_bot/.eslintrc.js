module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    },
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2, {
        "SwitchCase": 1
      }
    ],
    "quotes": [
      "off"
    ],
    "semi": [
      "error",
      "always"
    ],
    "linebreak-style": [
      "warn",
      "windows"
    ],
    "no-cond-assign": [
      "warn",
      "except-parens"
    ],
    "no-console": [
      "off"
    ],
    "curly": [
      "error"
    ],
    "no-else-return": [
      "error"
    ],
    "no-loop-func": [
      "error"
    ]
  }
};
