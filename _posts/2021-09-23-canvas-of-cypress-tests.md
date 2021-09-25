---
title: "A Canvas of Cypress Tests"
date: 2021-09-23 21:30 +1100
last_modified_at: 2021-09-23 21:30 +1100
tags: javascript mocha chai cypress elixir phoenix elm testing
header:
  image: /assets/images/2021-09-23/van-gogh-wheatfield-with-cypresses-june-1889.jpg
  image_description: "Van Gogh: A Wheatfield with Cypresses, June 1889"
  teaser: /assets/images/2021-09-23/van-gogh-wheatfield-with-cypresses-june-1889.jpg
  overlay_image: /assets/images/2021-09-23/van-gogh-wheatfield-with-cypresses-june-1889.jpg
  overlay_filter: 0.3
  caption: >
    "A Wheatfield with Cypresses", Vincent Van Gogh, June 1889
excerpt: >
  "I have a canvas of Cypress tests with apps of Elm, some Elixir, a browser
  like a preview of executed commands"
tagline: >
  "I have a canvas of Cypress tests with apps of Elm, some Elixir, a browser
  like a preview of executed commands"
  <small>([with apologies](https://en.wikipedia.org/wiki/Wheat_Field_with_Cypresses#:~:text=I%20have%20a%20canvas%20of%20cypresses%20with%20some%20ears%20of%20wheat%2C%20some%20poppies%2C%20a%20blue%20sky%20like%20a%20piece%20of%20Scotch%20plaid))</small>
---

I have two different applications that essentially do the same thing. One is
written using [Elixir][] and [Phoenix][], the other, [Elm][].

I am too lazy to write a separate test suite in each application's language. I
want to write just one test suite, and be able to run it against either
application, without it needing to know about any application internals.

Sounds a lot like I want an [integration test][Integration testing] suite,
something that [Cypress][] excels in helping you build. So, let's see how we can
to use it to create the testing glue between the two applications.

## Internationalisation in Elixir/Elm

The application under test is a very simple toy application that re-creates
the [Tachyons][] [Full Screen Centered Title component documentation page][],
but adds a dropdown menu to change the language of the message on screen, and in
the browser title.

![Tachyons App][]

The application codebases, and their companion blog posts, can be found at the
following locations:

{: refdef: style="display: inline-table; font-size: inherit;" }
|    Language    |             Repository            |              Companion Blog Post               |
|:---------------|:----------------------------------|:-----------------------------------------------|
| Elixir/Phoenix | [Phoenix LiveView I18n Example][] | _[Internationalisation with Phoenix LiveView]_ |
| Elm            | [Elm I18n Example][]              | _[Runtime Language Switching in Elm]_          |
{: refdef}

The entire feature set consists of the following use cases:

1. **Initial language setting**
  - When the application has a language setting, it displays a message and title
    in that language.
  - When the language setting is set to an unknown language, or is left blank,
    English is displayed.
2. **The language menu**
    - The default state for the menu is closed.
    - If you click the current language, the menu opens.
    - When the menu is open:
        - if you click the current language, the menu closes
        - if you click anywhere else on the pager, the menu closes
        - if you click another language, the menu closes
3. **Changing language**
  - For any language selectable in the dropdown menu, when you click that
    language, the display of the page will change to that language
4. **Language setting storage**
  - If you change the application language and refresh the browser, the
    application will remember that change and still display in your chosen
    language

These use cases will form the blueprint for creating some [Mocha][] and
[Chai][]-based tests in Cypress.

We will start off with the third scenario, changing languages, since it will
introduce us to the building blocks of Cypress testing. Initially, we will also
focus on testing a single application, the Elm one (chosen arbitrarily).

Once we have some passing tests, we will leverage some of Cypress' features to
do some refactoring, make sure that the same test can exercise both the Elm and
Elixir applications at the same time, and then build on our knowledge by moving
on to the other scenarios

> Feel free to follow along with the finished application located at my
> [Cypress I18n Example][] Github repository.

## Changing Language

<div class="centered-image">
  <figure>
    <img src="/assets/images/2021-09-23/van-gogh-wheatfield-with-cypresses-june-july-1889.jpg"
         alt="A Wheatfield with Cypresses, Vincent Van Gogh, June-July 1889">
    <figcaption>
      "A Wheatfield with Cypresses", Vincent Van Gogh, June-July 1889
    </figcaption>
  </figure>
</div>

After [initialising a new Node JS application][npm-init],
[installing Cypress][], and making sure the Elm application is running, let's
create our first test to make sure we can switch language to Italian.

> [Cypress' API documentation][] is very user-friendly, so I will defer to you
> to reference it for any detailed explanations of Cypress-related functions you
> may see in the example code. I will only focus my commentary on
> application-specific logic, and any Cypress functionality I want to highlight.

**`cypress/integration/changing_langugage.spec.js`**

```js
describe("Changing language", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000")
    cy.get("p").click()
  })

  context("to Italian", () => {
    beforeEach(() => {
      cy.get("li").contains("Italiano").click()
    })

    it("displays Italian", () => {
      cy.title().should("eq", "Multilingualizzazione in Elm")
      cy.get("h1").should("contain", "Centrare verticalmente con css è facile!")
    })
  })
})
```

A few notes about this test:

- Since no language is initially set in this scenario, the application defaults
  to display in English
- An Elm application runs at <http://localhost:3000> by default
- Since we are testing a bare-bones toy application, many [HTML][] tags
  represent unique elements on a page (eg `<p>` for language menu), so we are
  able to target them by simply using commands like `cy.get("p")`, rather than
  needing more granular targets like [classes][HTML class Attribute] or
  [IDs][HTML id Attribute].

Running the test within Cypress will look something like the following (but just
note this has been significantly slowed down using
[this technique][cypress-io/cypress#249]):

<div>
  <figure>
    <img src="/assets/images/2021-09-23/change-language-italian-cypress.gif"
         alt="Change language to Italian passing test in Cypress">
  </figure>
</div>

Great! We have our first passing test, and a baseline case to create tests for
the other scenarios. Thanks to this, testing for changing the language to
Japanese is, for the most part, a reproduction job:

**`cypress/integration/changing_langugage.spec.js`**

```js
describe("Changing language", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000")
    cy.get("p").click()
  })

  context("to Italian", () => { /* ... */ })

  context("to Japanese", () => {
    beforeEach(() => {
      cy.get("li").contains("日本語").click()
    })

    it("displays Japanese", () => {
      cy.title().should("eq", "Elmにおける多言語化")
      cy.get("h1").should("contain", "CSSで垂直センタリングは簡単だよ！")
    })
  })
})
```

The test for changing the language to English, though, will be slightly more
involved, since we have to change the application language to be non-English 
before the test runs.

The Elm application attempts to set the initial language by first checking
[`localStorage`][] for a specific key/value pair. Since Cypress tests are run in
a browser, we have direct access to browser-related functionality, like
`localStorage`. So, we can leverage that, and the Cypress `before()`
[hook][Cypress Hooks], to make sure we can set the initial language within a
nested test, even before the top level `beforeEach()` hook visits the
application URL:

**`cypress/integration/changing_langugage.spec.js`**

```js
describe("Changing language", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000")
    cy.get("p").click()
  })

  context("to Italian", () => { /* ... */ })
  context("to Japanese", () => { /* ... */ })

  context("to English", () => {
    before(() => {
      // Start in a non-English language.
      localStorage.setItem("elm-i18n-example-language", "ja")
    })

    beforeEach(() => {
      cy.get("li").contains("English").click()
    })

    it("displays English", () => {
      cy.title().should("eq", "Multilingualisation in Elm")
      cy.get("h1").should("contain", "Vertically centering things in css is easy!")
    })
  })
})
```

Okay, that's our test suite for the use case done! Let's run the tests!

<div>
  <figure>
    <img src="/assets/images/2021-09-23/change-language-all-cypress.gif"
         alt="Changing languages passing test suite in Cypress">
  </figure>
</div>

Looks like they all pass, which is good, but looking at the test code, it does
seem to look quite repetitive...

It might be nice to clean them up a bit by extracting out the logic involved to
perform core testing actions, and explicitly giving them names, like "click
language menu" or "displays Japanese" etc.

## Custom Commands

<div class="centered-image">
  <figure>
    <img src="/assets/images/2021-09-23/van-gogh-wheatfield-with-cypresses-early-september-1889.jpg"
         alt="A Wheatfield with Cypresses, Vincent Van Gogh, Early September 1889">
    <figcaption>
      "A Wheatfield with Cypresses", Vincent Van Gogh, Early September 1889
    </figcaption>
  </figure>
</div>

Using [Custom Commands][Cypress Custom Commands], we can define our own methods
to use in the same way that Cypress uses its own API. When we set up
Cypress, it provided us a file to put them in, so let's fill it up!

We will start with some commands that wrap around logic related to the language
menu:

**`cypress/support/commands.js`**

```js
Cypress.Commands.add("clickLanguageMenu", () => {
  cy.get("p").click()
})

Cypress.Commands.add("clickEnglish", () => {
  clickMenuLabel("English")
})

Cypress.Commands.add("clickItalian", () => {
  clickMenuLabel("Italiano")
})

Cypress.Commands.add("clickJapanese", () => {
  clickMenuLabel("日本語")
})

function clickMenuLabel(label) {
  cy.get("li").contains(label).click()
}
```

The first argument in each of the commands is the name of the command that will
become available to us in the tests, so let's see how that looks:

**`cypress/integration/changing_langugage.spec.js`**

```js
describe("Changing language", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000")
    cy.clickLanguageMenu()
  })

  context("to Italian", () => {
    beforeEach(() => {
      cy.clickItalian()
    })

    it("displays Italian", () => {
      cy.title().should("eq", "Multilingualizzazione in Elm")
      cy.get("h1").should("contain", "Centrare verticalmente con css è facile!")
    })
  })

  // ...
})
```

This looks okay for a first refactor, so let's go ahead and add some other
commands to deal with language display, and, while we are at it, language
storage:

**`cypress/support/commands.js`**

```js
// ...

Cypress.Commands.add("displaysEnglish", () => {
  const title = "Multilingualisation in Elm"
  const body = "Vertically centering things in css is easy!"
  displays(title, body)
})

Cypress.Commands.add("displaysItalian", () => {
  const title = "Multilingualizzazione in Elm"
  const body = "Centrare verticalmente con css è facile!"
  displays(title, body)
})

Cypress.Commands.add("displaysJapanese", () => {
  const title = "Elmにおける多言語化"
  const body = "CSSで垂直センタリングは簡単だよ！"
  displays(title, body)
})

function displays(title, body) {
  cy.title().should("eq", title)
  cy.get("h1").should("contain", body)
}

Cypress.Commands.add("storeLanguage", (language) => {
  localStorage.setItem("elm-i18n-example-language", language)
})
```

And back in the test file, this is how we can use these commands in the test
that changes the language to English:

**`cypress/integration/changing_langugage.spec.js`**

```js
describe("Changing language", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000")
    cy.clickLanguageMenu()
  })

  // ...

  context("to English", () => {
    before(() => {
      // Start in a non-English language.
      cy.storeLanguage("ja")
    })

    beforeEach(() => {
      cy.clickEnglish()
    })

    it("displays English", () => {
      cy.displaysEnglish()
    })
  })
})
```

Not bad...for tests that only need to deal with the Elm application, but these
tests need to be able to be re-used for the Elixir application as well!

[Chai]: http://chaijs.com/
[Cypress]: https://www.cypress.io/
[Cypress' API documentation]: https://docs.cypress.io/api/table-of-contents
[Cypress Custom Commands]: https://docs.cypress.io/api/cypress-api/custom-commands
[Cypress Hooks]: https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Hooks
[Cypress I18n Example]: https://github.com/paulfioravanti/cypress-i18n-example
[cypress-io/cypress#249]: https://github.com/cypress-io/cypress/issues/249#issuecomment-670028947
[Elixir]: https://elixir-lang.org/
[Elm]: https://elm-lang.org/
[Elm I18n Example]: https://github.com/paulfioravanti/elm-i18n-example
[Full Screen Centered Title component documentation page]: http://tachyons.io/components/layout/full-screen-centered-title/index.html
[GitHub]: https://github.com/
[HTML]: https://en.wikipedia.org/wiki/HTML
[HTML class Attribute]: https://www.w3schools.com/html/html_classes.asp
[HTML id Attribute]: https://www.w3schools.com/html/html_id.asp
[installing Cypress]: https://docs.cypress.io/guides/getting-started/installing-cypress
[Integration testing]: https://en.wikipedia.org/wiki/Integration_testing
[Internationalisation with Phoenix LiveView]: https://www.paulfioravanti.com/blog/internationalisation-phoenix-liveview/
[`localStorage`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[Mocha]: http://mochajs.org/
[npm-init]: https://docs.npmjs.com/cli/init/ 
[Phoenix]: https://www.phoenixframework.org/
[Phoenix LiveView I18n Example]: https://github.com/paulfioravanti/phx_i18n_example
[Runtime Language Switching in Elm]: https://www.paulfioravanti.com/blog/runtime-language-switching-elm/
[Tachyons]: http://tachyons.io/
[Tachyons App]: /assets/images/2021-09-23/tachyons-elm.gif "Animated GIF of Tachyons page implemented in Elm"
