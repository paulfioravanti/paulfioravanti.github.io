---
layout: post
title:  "Runtime Language Switching in Elm"
date:   2018-05-10 10:30 +1100
categories: elm i18n
comments: true
---

When it comes to creating multilingual web pages, internationali[s\|z]ation
([I18n][Internationalization naming]) would seem to be a deceptively complex
problem using [Elm][].

I never had to think of the choice of having application translations
generated as a pre-build phase of an app (eg [elm-i18n][]), or dynamically
loaded (eg [elm-i18next][]) when working with i18n in [Rails][Rails i18n] or
[Phoenix][Phoenix Gettext]. To be honest, I still do not know which way of doing
things is "best" in an Elm context. But, I do know that I want to have
runtime-switchable languages via a drop-down menu, so the creation of an example
page with dynamically loaded translations will be the main focus of this blog
post.

I have been using [Tachyons][] a lot lately, and like how it plays with Elm, so
we will set about doing the following:

- Re-create Tachyons'
  [Full Screen Centered Title component documentation page][] in Elm
- Add a custom language-switcher drop-down menu to the page
- Provide some translations for the page in [JSON][] format, and allow the drop-down
  menu to switch the language
- Store the selected language in [`localStorage`][] so that any selected
  language persists through page refreshes and different sessions.
- Explore generating Elm modules from the JSON translation files to give the
  translations some type safety

Let's get started!

## Bootstrap a New Elm Application

[Create Elm App][] will help us bootstrap our app, so install it with:

```sh
npm install create-elm-app -g
```

Then, generate a new app, initialise `npm` (using the default fields provided
for the generated `package.json` file is fine), and install Tachyons:

```sh
create-elm-app elm-i18n-example
cd elm-i18n-example
npm init
npm install tachyons
```

Next, to import Tachyons into the project, change the generated `index.js` file
to look like the following:

**`src/index.js`**

```js
import "tachyons"
import "./main.css"
import { Main } from "./Main.elm"

const appContainer = document.getElementById("root")

if (appContainer) {
  Main.embed(appContainer)
}
```

Now, if you run `elm-app start`, <http://localhost:3000/> should open
automatically and you should see a familiar splash screen letting you know that
your Elm app is working.

Before we get started properly, let's do a bit of clean-up of some of the
generated code Create Elm App gave us:

- We do not need `src/main.css` since Tachyons will take care of styling
- This app will not use service workers, so `src/registerServiceWorker.js` can
  be removed
- We will not be using the Elm logo from the splash screen, so that can be
  removed, as well as references to it in `src/Main.elm`

So, run the command below and make the following changes:

```sh
rm src/main.css src/registerServiceWorker.js public/logo.svg
```

**`src/index.js`**

```js
import "tachyons"
import { Main } from "./Main.elm"

// ...
```

**`src/Main.elm`**

```elm
-- ...

view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Your Elm App is working!" ]
        ]
```

You should now be left with a very plain looking (but compilable) page, so let's
brighten it up a bit!

## Re-create the Tachyons Documentation Page

Using the sample code on the [Full Screen Centered Title page][Full Screen
Centered Title component documentation page] as a guide (but with a few minor
edits), change the `Main.elm` module definitions, import declarations, and
`view` function to re-create the page:

**`src/Main.elm`**

```elm
module Main exposing (main)

import Html exposing (Html, article, div, h1, main_, text)
import Html.Attributes exposing (class)

-- ...

view : Model -> Html Msg
view model =
    let
        classes =
            [ "bg-dark-pink"
            , "overflow-container"
            , "sans-serif"
            , "white"
            ]
                |> String.join " "
                |> class
    in
        main_ [ classes ]
            [ content ]


content : Html Msg
content =
    let
        articleClasses =
            [ "dt"
            , "vh-100"
            , "w-100"
            ]
                |> String.join " "
                |> class

        divClasses =
            [ "dtc"
            , "ph3 ph4-l"
            , "tc"
            , "v-mid"
            ]
                |> String.join " "
                |> class
    in
        article [ articleClasses ]
            [ div [ divClasses ]
                [ heading ]
            ]


heading : Html Msg
heading =
    let
        classes =
            [ "f6 f2m"
            , "f-subheadline-l"
            , "fw6"
            , "tc"
            ]
                |> String.join " "
                |> class
    in
        h1 [ classes ]
            [ text "Vertically centering things in css is easy!" ]
```

I think that putting Tachyons classes in lists like this makes them easy to
scan and maintain, but also has the side effect of making function definitions
really long, so here we have split out the content across three different
smaller functions.

Using utility-based CSS frameworks like Tachyons and [Tailwind][] can seem
daunting at first, what with all the mnemonics that you seem to have to
commit to memory, so I always keep [Tachyons' Table of Styles][] open in a
browser tab for quick reference.

Anyway, your page should now look like the following screen shot:

![Tachyons Page Recreated](/assets/images/20180510/Tachyons-Page-Recreated.png){:
class="img-responsive"
}

If it does not, check your code against
[the `1-recreate-tachyons-doc-page` branch][1-recreate-tachyons-doc-page] of my
codebase to see if anything is missing.

[1-recreate-tachyons-doc-page]: https://github.com/paulfioravanti/elm-i18n-example/tree/1-recreate-tachyons-doc-page
[Create Elm App]: https://github.com/halfzebra/create-elm-app
[Elm]: http://elm-lang.org/
[elm-i18n]: https://github.com/iosphere/elm-i18n
[elm-i18next]: https://github.com/ChristophP/elm-i18next
[Full Screen Centered Title component documentation page]: http://tachyons.io/components/layout/full-screen-centered-title/index.html
[Internationalization naming]: https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming
[JSON]: https://www.json.org/
[`localStorage`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[Phoenix Gettext]: https://hexdocs.pm/gettext/Gettext.html
[Rails i18n]: http://guides.rubyonrails.org/i18n.html
[Tachyons]: http://tachyons.io/
[Tachyons' Table of Styles]: http://tachyons.io/docs/table-of-styles/
[Tailwind]: https://tailwindcss.com/
