# Everylint

Lint your js, styles, and markdown just with one linter.

Everylint uses [ESLint][eslint], [stylelint][stylelint],
and [markdownlint][markdownlint].

[![NPM version][npm-img]][npm-url]

[npm-img]: http://img.shields.io/npm/v/everylint.svg
[npm-url]: https://www.npmjs.org/package/everylint

![Everylint show results for all linters for all files to the console report][everylint-demo-img]

## Install

```bash
npm install everylint -D
```

If you use own `stylelint` config install without `stylelint-config-standard`,

```bash
npm install everylint -D --no-optional
```

## Usage

```bash
npx everylint
```

Or add script to your `package.json`,

```json
"scripts": {
  "lint": "everylint"
}
```

and run,

```bash
npm run lint
```

---

Sponsored by

<a href="https://uploadcare.com/?utm_source=github&utm_campaign=everylint">
  <img height="64"
       src="https://ucarecdn.com/74c4d283-f7cf-45d7-924c-fc77345585af/uclogohorizontal.svg"
       alt="Uploadcare">
</a>

[eslint]: https://github.com/eslint/eslint
[stylelint]: https://github.com/stylelint/stylelint
[markdownlint]: https://github.com/DavidAnson/markdownlint
[everylint-demo-img]: https://ucarecdn.com/26b4452c-ba3d-44ee-b611-71881fb24022/-/crop/2000x1000/55,140/-/setfill/f6f9fa/-/crop/2100x1100/center/-/resize/1600x/-/format/jpg/-/quality/lightest/
