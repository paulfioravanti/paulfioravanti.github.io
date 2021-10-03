---
title: "A Canvas of Cypress Tests"
date: 2021-10-06 22:50 +1100
last_modified_at: 2021-10-06 22:50 +1100
tags: javascript mocha chai cypress elixir phoenix elm testing i18n
header:
  image: /assets/images/2021-10-06/van-gogh-wheatfield-with-cypresses-june-1889.jpg
  image_description: "Van Gogh: A Wheatfield with Cypresses, June 1889"
  teaser: /assets/images/2021-10-06/van-gogh-wheatfield-with-cypresses-june-1889.jpg
  overlay_image: /assets/images/2021-10-06/van-gogh-wheatfield-with-cypresses-june-1889.jpg
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
written using [Elixir][] and [Phoenix][]; the other, [Elm][].

I am too lazy to write a separate test suite in each application's language. I
want to write just one test suite, and be able to run it against either
application, without it needing to know about any technical internals.

Sounds a lot like I want an [integration test][Integration testing] suite,
something that [Cypress][] excels in helping you build. Let's see how we can use
it to create the testing glue between the two applications.

## Internationalisation in Elixir/Elm

The application under test is a very simple toy application that re-creates
the [Tachyons][] [Full Screen Centered Title component documentation page][],
but adds a dropdown menu to change the language of the message on screen, and in
the browser title.

![Tachyons App][]

> The application codebases, and their companion blog posts, can be found at the
> following locations:
>
> {: refdef: style="display: inline-table;" }
> |    Language    |       Application Codebase        |              Companion Blog Post               |
> |:---------------|:----------------------------------|:-----------------------------------------------|
> | Elixir/Phoenix | [Phoenix LiveView I18n Example][] | _[Internationalisation with Phoenix LiveView]_ |
> | Elm            | [Elm I18n Example][]              | _[Runtime Language Switching in Elm]_          |
> {: refdef}

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
introduce us to some building blocks of Cypress testing. Initially, we will also
focus on testing a single application, the Elm one.

Once we have some passing tests, we will leverage some of Cypress' features to
do some refactoring, make sure that the same test can exercise both the Elm and
Elixir applications at the same time, and then build on our knowledge by moving
on to the other scenarios

> Feel free to follow along with the finished application, located at the
> [Cypress I18n Example][] Github repository.

## Changing Language

<div class="centered-image" style="width: 90%;">
  <figure>
    <img src="/assets/images/2021-10-06/van-gogh-wheatfield-with-cypresses-june-july-1889.jpg"
         alt="A Wheatfield with Cypresses, Vincent Van Gogh, mid June - 2 July 1889">
    <figcaption>
      "A Wheatfield with Cypresses", Vincent Van Gogh, mid June - 2 July 1889
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

**`cypress/integration/changing_language.spec.js`**

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
- An Elm application runs at `http://localhost:3000` by default
- Since we are testing a bare-bones toy application, many [HTML][] tags
  represent unique elements on a page (eg `<p>` for language menu), so we are
  able to target them by simply using commands like [`cy.get()`][], rather
  than needing more granular targets like [classes][HTML class Attribute] or
  [IDs][HTML id Attribute].

Running the test within Cypress will look something like the following (but just
note it has been slowed down significantly via
[this technique][cypress-io/cypress#249]):

<figure>
  <img src="/assets/images/2021-10-06/change-language-italian-cypress.gif"
       alt="Change language to Italian passing test in Cypress">
</figure>

Great! We have our first passing test, and a baseline case to create tests for
the other scenarios. Thanks to this, testing for changing the language to
Japanese is, for the most part, a reproduction job:

**`cypress/integration/changing_language.spec.js`**

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
a browser, we have direct access to `localStorage`, as well as other
browser-related functionality.

We can leverage that, and the Cypress `before()` [hook][Cypress Hooks], to make
sure we can set the initial language within a nested test, even before the top
level `beforeEach()` hook visits the application URL:

**`cypress/integration/changing_language.spec.js`**

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

<figure>
  <img src="/assets/images/2021-10-06/change-language-all-cypress.gif"
       alt="Changing languages passing test suite in Cypress">
</figure>

Looks like they all pass, which is good, but looking at the test code, it does
seem to look quite repetitive...

It might be nice to clean them up by extracting out the logic involved to
perform core testing actions, and explicitly giving those extractions names,
like "click language menu" or "displays Japanese" etc.

## Custom Commands

<div class="centered-image" style="width: 90%;">
  <figure>
    <img src="/assets/images/2021-10-06/van-gogh-wheatfield-with-cypresses-early-september-1889.jpg"
         alt="A Wheatfield with Cypresses, Vincent Van Gogh, Early September 1889">
    <figcaption>
      "A Wheatfield with Cypresses", Vincent Van Gogh, Early September 1889
    </figcaption>
  </figure>
</div>

Using [Custom Commands][Cypress Custom Commands], we can define our own methods
to use in the same way that Cypress uses its own API. When we set up
Cypress, it provided us a file to put them in, so let's fill it up with some
methods to clean up the tests!

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

**`cypress/integration/changing_language.spec.js`**

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

Back in the test file, here is an example of how we can use these commands,
inside the test that changes the language to English:

**`cypress/integration/changing_language.spec.js`**

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

Not bad...for tests that only need to deal with the Elm application. But, the
aim is to be lazy and re-use these tests for the Elixir application as well!

The Phoenix server runs by default on port `4000`, rather than `3000`, and it is
application-specific information like this that we will need to dynamically
inject into the tests in order to enable maximum laziness.

It would be handy to define this kind of information somewhere outside the test
suite, where it can be referenced when needed. Luckily, Cypress has just the
place for it.

## Cypress Environment Variables

Cypress offers a few different options to define [environment variables][Cypress
Environment Variables].

The one we will use is defining an application root-level [`cypress.env.json`][]
file, which will contain static information about each application, as well as
the language codes common across both applications:

**`cypress.env.json`**

```json
{
  "ENGLISH_LANGUAGE": "en",
  "ITALIAN_LANGUAGE": "it",
  "JAPANESE_LANGUAGE": "ja",
  "APPLICATIONS": [
    {
      "name": "elm-i18n-example",
      "url": "http://localhost:3000",
      "storageKey": "elm-i18n-example-language"
    },
    {
      "name": "phx_i18n_example",
      "url": "http://localhost:4000",
      "storageKey": "phxi18nexamplelanguage"
    }
  ]
}
```

As well as the `url` and `storageKey` for each application, we have added an
application `name` identifier, as there are some test commands that will need to
know which application is currently under test in order to correctly perform
some action.

Variables defined in `cypress.env.json` can be accessed via [`Cypress.env`][],
so let's see how the changing language test file we have been working on changes
in order to accommodate multiple applications:

**`cypress/integration/changing_language.spec.js`**

```js
const { APPLICATIONS, JAPANESE_LANGUAGE } = Cypress.env()

APPLICATIONS.forEach(({ name, url }) => {
  describe(`${name}: changing language`, () => {
    beforeEach(() => {
      cy.visit(url)
      cy.clickLanguageMenu()
    })

    context("to Italian", () => {
      beforeEach(() => {
        cy.clickItalian()
      })

      it("displays Italian", () => {
        cy.displaysItalian(name)
      })
    })

    context("to Japanese", () => {
      beforeEach(() => {
        cy.clickJapanese()
      })

      it("displays Japanese", () => {
        cy.displaysJapanese(name)
      })
    })

    context("to English", () => {
      before(() => {
        // Start in a non-English language.
        cy.storeLanguage(name, JAPANESE_LANGUAGE)
      })

      beforeEach(() => {
        cy.clickEnglish()
      })

      it("displays English", () => {
        cy.displaysEnglish(name)
      })
    })
  })
})
```

And, we now have a passing set of tests that cover both applications!

<figure>
  <img src="/assets/images/2021-10-06/change-language-all-apps-cypress.gif"
       alt="Changing languages passing test suite in Cypress for both apps">
</figure>

Note how the address in the browser changes from the Elm application on port
`3000`, to the Phoenix application on port `4000`.

While we did not need to make any changes regarding the way that the language
menu and language options are clicked between the applications, there are slight
differences in how each application displays messages for a language, and how
it remembers a language choice.

As mentioned above, this has resulted in the need for some custom commands to
accept the `name` parameter from the config, so let's see how it is being used.

## Application-Dependent Commands

First up are the "displays language" set of commands. They have all changed in
the same way, so we will just have a look at `displaysEnglish` as an example
(check the application codebase for details of the other commands):

**`cypress/support/commands.js`**

```js
const [{ name: ELM_APP_NAME }] = Cypress.env("APPLICATIONS")

Cypress.Commands.add("displaysEnglish", appName => {
  const title =
    appName === ELM_APP_NAME
      ? "Multilingualisation in Elm"
      : "Multilingualisation in Phoenix"
  const body = "Vertically centering things in css is easy!"
  displays(title, body)
})

// ...
```

The only display difference between the two applications is the page title
content, so we do a simple [ternary expression][] to decide which title to use.

How about storing the language for future reference? Although I used
`localStorage` for the Elm application, I opted to instead use [cookies][] in
the Phoenix application, so that I could keep as much logic as possible in
Elixir, and not have to write any Javascript in [LiveView Hooks][].

Cypress has an easy-to-use [`setCookie`][] API, and so adapting the
`storeLanguage` custom command to handle the Phoenix application was very
straightforward:

**`cypress/support/commands.js`**

```js
const [
  { name: ELM_APP_NAME, storageKey: ELM_STORAGE_KEY },
  { storageKey: PHX_STORAGE_KEY }
] = Cypress.env("APPLICATIONS")

// ...

Cypress.Commands.add("storeLanguage", (appName, language) => {
  if (appName === ELM_APP_NAME) {
    localStorage.setItem(ELM_STORAGE_KEY, language)
  } else {
    cy.setCookie(PHX_STORAGE_KEY, language)
  }
})
```

I did end up doing some further refactoring of the commands, like splitting them
out into different files by functionality, and extracting static string values
into their own file. If you are interested in those changes, see the [`support`
directory][] of the [Cypress I18n Example][] application.

## All Green

Most of the other tests in the suite are quite similar in format to
`changing_language.spec.js`, and build off of functionality that we have already
seen. So, I will leave it to any interested parties to have a look at the rest
of the test suite in detail.

Suffice to say, that all the tests do pass, and you should be able to see below
a test for every feature described in the use case set towards the top of this
post:

<div>
  <figure>
    <img src="/assets/images/2021-10-06/full-test-suite-all-apps-cypress.gif"
         alt="Full passing test suite in Cypress for both apps">
  </figure>
</div>

There is one [gotcha][], though, that is worth bringing up: the applications
would seem to sometimes inexplicably fail to register clicks on the language
menu when the suite ran at full speed. This resulted in tests randomly failing,
and much frustration and confusion on my part.

Trawling through the [Cypress GitHub repository][] surfaced
[this issue][cypress#1847], seemingly indicating that there was a time where
clicks were not being registered properly due to [`mouseover` events][] not
being fired. [The workaround][cypress#1847#issuecomment-447996153] was to
manually fire the event before clicking using `.trigger("mouseover").click()`.

[This pull request][cypress#3030] introduced automatic firing of `mouseover`
events for clicks, but only for clickable input tags like `<button>`s. The
language menu in our application is a `<p>` tag, so it does not benefit from
auto-firing `mouseover` events, but manually adding that to the
`clickLanguageMenu` command fixed the issue (and gave me a new rule-of-thumb for
clicking elements in Cypress):

**`cypress/support/commands.js`**

```js
Cypress.Commands.add("clickLanguageMenu", () => {
  cy.get("p").trigger("mouseover").click()
})
```

## Cypress vs Phoenix Tests vs Elm Tests

<div class="centered-image" style="width: 90%;">
  <figure>
    <img src="/assets/images/2021-10-06/van-gogh-wheatfield-with-cypresses-late-september-1889.jpg"
         alt="A Wheatfield with Cypresses, Vincent Van Gogh, Late September 1889">
    <figcaption>
      "A Wheatfield with Cypresses", Vincent Van Gogh, Late September 1889
    </figcaption>
  </figure>
</div>

Remember when I said that the reason for creating the Cypress test suite was
that "I am too lazy to write a separate test suite in each application's
language"?

Well, writing this blog post ended up baiting me into writing them anyway.

I wanted to see how much of the Cypress tests I could actually replicate in the
respective application languages. You can find the tests in their Github
repositories:

- [Phoenix LiveView integration tests][]
- [Elm integration tests][]

So, how do each of these test suites fare? Let's take a look at each language's
equivalent of the "displays English" test from `changing_language.spec.js` and
do a bit of compare and contrast.

### Phoenix LiveView Tests

Since the Phoenix application uses [LiveView][], which "enables rich, real-time
user experiences with server-rendered HTML", we leverage the
[`Phoenix.LiveViewTest`][] module to create our tests.

Unlike Cypress, Phoenix tests are not run in a browser ([Wallaby][] is the
tool for that in Elixir-land). Rather, we start off with a socket connection
(`conn`, a [`Plug.Conn`][]), and use [`live/2`][] to spawn a stateful LiveView
process (`view`), that we can then interact with like we would a web page:

**`test/phx_i18n_example_web/integration/changing_language_test.exs`**

```elixir
defmodule PhxI18nExampleWeb.ChangingLanguageTest do
  use PhxI18nExampleWeb.ConnCase
  import Phoenix.ConnTest
  import Phoenix.LiveViewTest

  setup %{conn: conn, language: language, cookie: cookie} do
    {:ok, view, _html} =
      conn
      |> put_req_cookie("phxi18nexamplelanguage", cookie)
      |> live("/")

    view
    |> element("p")
    |> render_click()

    view
    |> element("li", language)
    |> render_click()

    heading =
      view
      |> element("h1")
      |> render()

    {:ok, [heading: heading, title: page_title(view)]}
  end

  # ...

  @tag cookie: "ja"
  @tag language: "English"
  test "displays English when language changed to English",
       %{heading: heading, title: title} do
    assert heading =~ "Vertically centering things in css is easy!"
    assert title == "Multilingualisation in Phoenix"
  end
end
```

Since we are not working with a browser, we have to inject the language cookie
value directly into the raw connection, using [`put_req_cookie/3`][], in order
to change the LiveView's `language` (passed up to `setup` from the `@tag`
attribute on the test) to English.

From there, we perform [`render_click/1`][] actions to open the language
dropdown menu, select a language, and then extract the LiveView page title and
heading to send into the test itself.

For testing LiveViews in isolation, I think these kinds of tests are absolutely
fine. However, where I think Cypress does get an upper hand in this use case,
and some others in the application, is, as you may expect, related to its tests
being run in a browser:

- No manual injection of cookies are needed into the application; Cypress can
  set cookie values directly in the browser, which the application can then read
  in and use
- Once the language is set, Cypress is able to [`cy.reload()`][] the browser to
  confirm that the new language is set in the cookies (check the Github repo for
  that test), but doing something like checking whether a cookie value has been
  changed in a `conn` is not feasible, and LiveViews cannot be "reloaded"

### Elm Tests

[The Elm Architecture][] (TEA) breaks Elm applications up into three parts:

- Model — the state of your application
- View — a way to turn your state into HTML
- Update — a way to update your state based on messages

When attempting to write an "integration test" in Elm, you are able to
initialise a model and pass it into a view to render.

However, unlike a LiveView, it is not possible to trigger multiple events on
a view (eg click language dropdown, then select a language) that then updates
the state of a model, or the view itself, and then make assertions on it.

It is not even possible to do this for a single event: the only assertions we
can make based off of an event being triggered are _that_ a certain type of
message gets generated.

For example, in the test below we:

- Initialise a model using `Main.init`
- Change the model values to indicate that the language menu should be open
  (`showAvailableLanguages = True`), and that the current language is Italian
  ( the `Translations.It` type)
- Render the model in the view and find `"English"` from the language dropdown
  menu
- [`Event.Simulate`][] a `click`
- Assert that a `Msg.ChangeLanguage Translations.En` message gets generated

**`tests/ChangingLanguageTest.elm`**

```elm
module ChangingLanguageTest exposing (all)

import Html exposing (Html)
import Json.Encode exposing (null)
import Main
import Model exposing (Model)
import Msg exposing (Msg)
import Test exposing (Test, describe, test)
import Test.Html.Event as Event exposing (click)
import Test.Html.Query as Query
import Test.Html.Selector exposing (containing, tag, text)
import Translations
import View


all : Test
all =
    let
        ( model, _ ) =
            Main.init { language = null }
    in
    describe "Changing language"
        [ -- ...
        , changeLanguageToEnglishTest model
        ]


-- ...


changeLanguageToEnglishTest : Model -> Test
changeLanguageToEnglishTest model =
    let
        initModel : Model
        initModel =
            { model
                | showAvailableLanguages = True
                , currentLanguage = Translations.It
            }

        html : Html Msg
        html =
            initModel
                |> View.view
                |> .body
                |> List.head
                |> Maybe.withDefault (Html.text "")
    in
    describe "changing the language to English"
        [ test "sends a message to change the language to English" <|
            \() ->
                html
                    |> Query.fromHtml
                    |> Query.find [ tag "li", containing [ text "English" ] ]
                    |> Event.simulate click
                    |> Event.expect (Msg.ChangeLanguage Translations.En)
        ]
```

From here, if we want to find out what should happen when Elm receives a
`Msg.ChangeLanguage Translations.En` message, we need to write a specific
Update-focused test which:

- Initialises a model with its language setting as English (`Translations.En`)
- Initialises a `Msg.ChangeLanguage Translations.It` message
- Passes the model and message into the Update function
- Asserts that the language in the model has changed from Italian to English

**`tests/UpdateTest.elm`**

```elm
module UpdateTest exposing (all)

import Expect
import Model exposing (Model)
import Msg exposing (Msg)
import Test exposing (Test, describe, test)
import Translations
import Update


all : Test
all =
    describe "Update"
        [ changeLanguageTest
        , -- ...
        ]


changeLanguageTest : Test
changeLanguageTest =
    let
        msg : Msg
        msg =
            Msg.ChangeLanguage Translations.It

        model : Model
        model =
            Model.init Translations.En

        ( actualModel, _ ) =
            Update.update msg model

        expectedModel : Model
        expectedModel =
            Model.init Translations.It
    in
    describe "Msg.ChangeLanguage"
        [ test "updates the model to the specified language" <|
            \() ->
                Expect.equal expectedModel actualModel
        ]
```

Similar to my opinions about the Elixir tests, I think these tests are
totally fine for testing parts of an Elm application in isolation.

There are some other Elm options to enable testing programs as more complete
units, negating the need to divide up tests, like [elm-program-test][] (does not
drive a web browser), or [Elm-WebDriver][] (drives a web browser), so there are
other options outside of Elm's default testing paradigms.

However, for similar reasons as the Elixir tests, I think there is a strong case
for involving Cypress' power and flexibility in the testing mix for Elm
applications.

## An Aside: Testing Internationalisation

The purpose of the Phoenix and Elm I18n example applications are just that: to
be toy applications that provide example implementations of using
internationalisation in those languages.

Showing that text changes on a screen as a result of a language setting changing
is their key functionality, and this is reflected in how the tests are written.

For a real application containing many translated text entries in different
locations in multiple languages, the string-based testing used in these test
suites is not really feasible. The burden of having to update tests whenever
translations are updated will get tiresome quickly; translations and tests
are best being able to change independent of each other.

Instead, it is much more helpful to have some kind of external tool that can run
over your codebase and translation files to inform you on whether:

- you have any missing translations in certain languages
- whether you have translations for strings that are not referenced in the
  application anymore (ie they are obsolete)

My favourite local developer tool I have used in the past to do this has
actually been a [Ruby][] gem, [i18n-tasks][]. If you do [Ruby on Rails][]
development with internationalisation, definitely add it to your toolbox.

There does not seem to be quite as robust a tool in the Phoenix or Elm
ecosystems as of this writing, but there are other options available.

For a Phoenix application, it would seem that you can "verify that your [POT
files][] are up to date with the current state of the codebase" with a
[`mix gettext.extract`][] task:

```sh
mix gettext.extract --check-up-to-date
```

> This task is in the [Elixir Gettext `master` branch][] as of this writing, so
> by the time you read this, it may have been released on [Hex][].

For Elm, the situation is a bit more complex (that I go into in much more detail
in _[Runtime Language Switching in Elm][]_) but I would currently recommend
[Elm i18n Gen][] to give some type safety to your translations.

## Paint some Cypress tests

I have found writing and running integration tests with Cypress to be lots of
fun, and think there is definitely a place for them alongside more unit-focused
tests in your programming language of choice.

The visual feedback Cypress can provide for high-value application workflows
like account sign-up, or making a payment, make the tests something that can
also be shared with non-technical areas of your team or business.

If you have not used Cypress already, I would encourage you to give it a shot,
and walk through your application in the shoes of your end users!

[Chai]: http://chaijs.com/
[cookies]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
[`cy.get()`]: https://docs.cypress.io/api/commands/get
[`cy.reload()`]: https://docs.cypress.io/api/commands/reload
[Cypress]: https://www.cypress.io/
[cypress#1847]: https://github.com/cypress-io/cypress/issues/1847
[cypress#1847#issuecomment-447996153]: https://github.com/cypress-io/cypress/issues/1847#issuecomment-447996153
[cypress#3030]: https://github.com/cypress-io/cypress/pull/3030
[Cypress' API documentation]: https://docs.cypress.io/api/table-of-contents
[Cypress Custom Commands]: https://docs.cypress.io/api/cypress-api/custom-commands
[`Cypress.env`]: https://docs.cypress.io/api/cypress-api/env
[`cypress.env.json`]: https://docs.cypress.io/guides/guides/environment-variables#Option-2-cypress-env-json
[Cypress Environment Variables]: https://docs.cypress.io/guides/guides/environment-variables
[Cypress GitHub repository]: https://github.com/cypress-io/cypress
[Cypress Hooks]: https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Hooks
[Cypress I18n Example]: https://github.com/paulfioravanti/cypress-i18n-example
[cypress-io/cypress#249]: https://github.com/cypress-io/cypress/issues/249#issuecomment-670028947
[Elixir]: https://elixir-lang.org/
[Elixir Gettext `master` branch]: https://github.com/elixir-gettext/gettext/blob/becf0585b12762bddb6dd04a9f0a307c8768fa1a/lib/mix/tasks/gettext.extract.ex#L23
[Elm]: https://elm-lang.org/
[Elm I18n Example]: https://github.com/paulfioravanti/elm-i18n-example
[Elm i18n Gen]: https://github.com/ChristophP/elm-i18n-module-generator
[Elm integration tests]: https://github.com/paulfioravanti/elm-i18n-example/tree/master/tests
[elm-program-test]: https://github.com/avh4/elm-program-test
[Elm-WebDriver]: https://github.com/justgook/elm-webdriver
[`Event.simulate`]: https://package.elm-lang.org/packages/elm-explorations/test/latest/Test-Html-Event#simulate
[Full Screen Centered Title component documentation page]: http://tachyons.io/components/layout/full-screen-centered-title/index.html
[GitHub]: https://github.com/
[gotcha]: https://www.merriam-webster.com/dictionary/gotcha
[Hex]: https://hex.pm/
[HTML]: https://en.wikipedia.org/wiki/HTML
[HTML class Attribute]: https://www.w3schools.com/html/html_classes.asp
[HTML id Attribute]: https://www.w3schools.com/html/html_id.asp
[i18n-tasks]: https://glebm.github.io/i18n-tasks/
[installing Cypress]: https://docs.cypress.io/guides/getting-started/installing-cypress
[Integration testing]: https://en.wikipedia.org/wiki/Integration_testing
[Internationalisation with Phoenix LiveView]: https://www.paulfioravanti.com/blog/internationalisation-phoenix-liveview/
[`live/2`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveViewTest.html#live/2
[LiveView]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html
[LiveView Hooks]: https://hexdocs.pm/phoenix_live_view/js-interop.html#client-hooks
[`localStorage`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[`mix gettext.extract`]: https://hexdocs.pm/gettext/Mix.Tasks.Gettext.Extract.html#content
[Mocha]: http://mochajs.org/
[`mouseover` events]: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event
[npm-init]: https://docs.npmjs.com/cli/init/
[Phoenix]: https://www.phoenixframework.org/
[Phoenix LiveView I18n Example]: https://github.com/paulfioravanti/phx_i18n_example
[Phoenix LiveView integration tests]: https://github.com/paulfioravanti/phx_i18n_example/tree/master/test/phx_i18n_example_web/integration
[`Phoenix.LiveViewTest`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveViewTest.html
[`Plug.Conn`]: https://hexdocs.pm/plug/Plug.Conn.html
[POT files]: https://en.wikipedia.org/wiki/Gettext#Programming
[`put_req_cookie/3`]: https://hexdocs.pm/plug/Plug.Test.html#put_req_cookie/3
[`render_click/1`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveViewTest.html#render_click/1
[Ruby]: https://www.ruby-lang.org/en/
[Ruby on Rails]: https://rubyonrails.org/
[Runtime Language Switching in Elm]: https://www.paulfioravanti.com/blog/runtime-language-switching-elm/
[`setCookie`]: https://docs.cypress.io/api/commands/setcookie
[`support` directory]: https://github.com/paulfioravanti/cypress-i18n-example/tree/main/cypress/support
[Tachyons]: http://tachyons.io/
[Tachyons App]: /assets/images/2021-10-06/tachyons-elm.gif "Animated GIF of Tachyons page implemented in Elm"
[ternary expression]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
[The Elm Architecture]: https://guide.elm-lang.org/architecture/
[Wallaby]: https://github.com/elixir-wallaby/wallaby
