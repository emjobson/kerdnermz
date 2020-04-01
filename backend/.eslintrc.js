module.exports = {
  "plugins": ["prettier"],
  "extends": ["airbnb-base",
    "plugin:prettier/recommended"],
  "env": {
    "es6": true,
    "node": true
  },
  "rules": {
    "prettier/prettier": "error"
  }
}
