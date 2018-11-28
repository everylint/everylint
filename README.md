# Everylint

> A zero-config, unopinionated linting solution to check all frontend parts.

Lint your js, styles, and markdown just with one linter.

Everylint uses [ESLint][eslint], [stylelint][stylelint],
and [markdownlint][markdownlint].

![screen shot 2018-07-25 at 22 43 14](https://user-images.githubusercontent.com/3459374/43223847-0f2c0ec0-905d-11e8-9731-0862c7b4e525.png)

## Motivation

> The real value of ESLint is in the non-style rules that prevent common errors.
>
> — [Nicholas C. Zakas](https://twitter.com/slicknet/status/877195619353337856)

## Install

```sh
npm install --save-dev everylint
```

```sh
yarn add --dev everylint
```

If you use own `stylelint` config install without `stylelint-config-standard`,

```bash
npm install everylint -D --no-optional
```

## Usage

```sh
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

## License

MIT ©

<!-- References -->

[npm-img]: http://img.shields.io/npm/v/everylint.svg
[npm-url]: https://www.npmjs.org/package/everylint
[eslint]: https://github.com/eslint/eslint
[stylelint]: https://github.com/stylelint/stylelint
[markdownlint]: https://github.com/DavidAnson/markdownlint
[everylint-demo-img]: https://ucarecdn.com/26b4452c-ba3d-44ee-b611-71881fb24022/-/crop/2000x1000/55,140/-/setfill/ddd/-/crop/2100x1100/center/-/resize/1600x/-/format/jpg/-/quality/lighter/
