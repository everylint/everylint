# everylint

Lint your js, styles, and markdown just with one linter.

Everylint uses [ESLint][eslint], [stylelint][stylelint],
and [markdownlint][markdownlint].

[![NPM version][npm-img]][npm-url]

[npm-img]: http://img.shields.io/npm/v/everylint.svg
[npm-url]: https://www.npmjs.org/package/everylint

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
  "lint": "everylint",
  ...
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
