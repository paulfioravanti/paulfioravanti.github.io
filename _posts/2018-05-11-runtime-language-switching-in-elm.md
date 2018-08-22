---
title:  "Runtime Language Switching in Elm"
date:   2018-05-11 20:05 +1100
categories: elm i18n
header:
  image: /assets/images/2018-05-11/japanese-display.png
  teaser: /assets/images/2018-05-11/japanese-display.png
  overlay_image: /assets/images/2018-05-11/ameet-dhanda-476959-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Ameet Dhanda](https://unsplash.com/photos/ojVfHwrBlP4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/language?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Internationalisation would seem to be a deceptively complex problem using Elm.
---

When it comes to creating multilingual web pages, internationali[s\|z]ation
([I18n][Internationalization naming]) would seem to be a deceptively complex
problem using [Elm][].

I have never had to consider the choice of generating application translations
as a pre-build phase of an app (eg [elm-i18n][]), or have them be dynamically
loaded (eg [elm-i18next][]) when working with i18n in [Rails][Rails i18n] or
[Phoenix][Phoenix Gettext]. To be honest, I still do not know which way of doing
things is "best" in an Elm context. But, I do know that I want to have
runtime-switchable languages via a dropdown menu, so the creation of an example
page with dynamically loaded translations will be the main focus of this blog
post.

I have been using [Tachyons][] a lot lately for styling, and like how it plays
with Elm, so we will set about doing the following:

- Re-create Tachyons'
  [Full Screen Centered Title component documentation page][] in Elm
- Add a custom language-switcher dropdown menu to the page
- Provide some translations for the page in [JSON][] format, and allow the
  dropdown menu to switch the language
- Store the selected language in [`localStorage`][] so that any selected
  language persists through page refreshes and different sessions.
- Explore generating Elm modules from the JSON translation files in order to
  give the translations some type safety

(If you want to skip ahead and see the final result, feel free to clone my
[`elm-i18n-example` repo][])

Let's get started!

## Bootstrap a New Elm Application

[Create Elm App][] will help us bootstrap our app, so install it with:

```sh
npm install -g create-elm-app
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

```haskell
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

```haskell
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

I think that putting Tachyons classes in lists like this makes them easier to
scan and maintain, but it also has the side effect of making function
definitions really long, so here we have split out the content across three
different smaller functions.

Using utility-based CSS frameworks like Tachyons and [Tailwind][] can seem
daunting at first, what with all the mnemonics that you seem to have to
commit to memory, so I always keep [Tachyons' Table of Styles][] open in a
browser tab for quick reference, and if this is your first look at Tachyons, I
would recommend you do the same.

Anyway, your page should now look like the following screen shot:

![Tachyons Page Recreated](/assets/images/2018-05-11/Tachyons-Page-Recreated.png){:
class="img-responsive"
}

If it does not, check your code against
[the `1-recreate-tachyons-doc-page` branch][1-recreate-tachyons-doc-page] of my
codebase to see if anything is missing.

## Add Language Dropdown Menu

For now, the language dropdown menu will be populated with placeholder values,
and will not actually be able to change languages, but what we want from the
menu in the end is:

- The current language should be shown on the menu by default
- When you click the menu, it should open, revealing any other available
  languages _aside from_ the current language
- When you mouse over a menu item, it should be highlighted in some way
- When you click on a menu item, it should change the current language of the
  application (we'll do that later)
- If, while the menu is open, you click anywhere else on the page, the menu
  should close

Most of these requirements sound like they would be best served in their own
module, so let's create one called `LanguageDropdown.elm`, and start with
rendering just the current language selection so we can get the menu positioning
right.

### Current Selection

**`src/LanguageDropdown.elm`**

```haskell
module LanguageDropdown exposing (view)

import Html exposing (Html, div, li, p, span, text, ul)
import Html.Attributes exposing (class)


view : Html msg
view =
    let
        classes =
            [ "center"
            , "f3"
            , "flex"
            , "h3"
            , "items-center"
            , "justify-end"
            , "w-90"
            ]
                |> String.join " "
                |> class
    in
        div [ classes ]
            [ currentSelection ]


currentSelection : Html msg
currentSelection =
    let
        classes =
            [ "b--white"
            , "ba"
            , "br2"
            , "pa2"
            , "pointer"
            , "tc"
            , "w4"
            ]
                |> String.join " "
                |> class

        caretClasses =
            [ "absolute"
            , "ml2"
            ]
                |> String.join " "
                |> class
    in
        p [ classes ]
            [ span []
                [ text "English" ]
            , span [ caretClasses ]
                [ text "▾" ]
            ]
```

Next, we have to import the language dropdown code in the `Main` module,
as well as slightly adjust the styles in the `view` function, since there is now
more on the page than just the message:

**`src/Main.elm`**

```haskell
-- ...
import LanguageDropdown

-- ...

view : Model -> Html Msg
view model =
    let
        classes =
            [ "bg-dark-pink"
            , "overflow-container"
            , "pt3"
            , "sans-serif"
            , "vh-100"
            , "white"
            ]
                |> String.join " "
                |> class
    in
        main_ [ classes ]
            [ LanguageDropdown.view
            , content
            ]

content : Html Msg
content =
    let
        articleClasses =
            [ "dt"
            , "vh-75"
            , "w-100"
            ]
                |> String.join " "
                |> class

        -- ...
    in
        -- ...
```

Now, your page should look like this:

![Menu with current selection only](/assets/images/2018-05-11/menu-with-current-selection.png){:
class="img-responsive"
}

The "menu" here (yes, it is currently just a `p` tag), currently does nothing,
but we can at least confirm that it looks like it is in a good spot on the page.
Now, let's actually give it a `dropdownList` under the `currentSelection`!

### Language Dropdown List

**`src/LanguageDropdown.elm`**

```haskell
view : Html msg
view =
    let
        -- ...
    in
        div [ classes ]
            [ currentSelection
            , dropdownList
            ]

-- ...

dropdownList : Html msg
dropdownList =
    let
        classes =
            [ "absolute"
            , "b--white"
            , "bb"
            , "bl"
            , "br"
            , "br--bottom"
            , "br2"
            , "items-center"
            , "list"
            , "mt5"
            , "pl0"
            , "pointer"
            , "pr0"
            , "pt1"
            , "tc"
            , "top-0"
            , "w4"
            ]
                |> String.join " "
                |> class

        selectableLanguages =
            [ "Italiano", "日本語" ]

    in
        ul [ classes ]
            (List.map dropdownListItem selectableLanguages)


dropdownListItem : String -> Html msg
dropdownListItem language =
    let
        classes =
            [ "hover-bg-white"
            , "hover-dark-pink"
            , "ph1"
            , "pv2"
            , "pt0"
            , "w-100"
            ]
                |> String.join " "
                |> class
    in
        li [ classes ]
            [ span [] [ text language ] ]
```

This results in:

![Menu with open selection](/assets/images/2018-05-11/menu-with-open-selection.png){:
class="img-responsive"
}

- For the dropdown list, we are shoving a HTML unordered list (`ul`) right
  underneath the `p` tag, simulating a menu opening.
- When we hover over a menu item, we can tell which item is currently being
  selected.
- Selectable languages currently have strings as their placeholders, but we
  will change that later on as we introduce the concept of a language to the
  application.

So, we now know what the menu looks like when it is open, but we need it to
respond to mouse clicks to open and close the dropdown list (read: show and
hide the list), so let's do that now.

## Show and Hide Available Languages

The application needs to be able to keep track of whether to show or hide the
dropdown list, and needs to be able to track clicks on the menu and page, so it
sounds like we need the following:

- A Boolean flag to tell the app whether to `showAvailableLanguages` or not
- An update `Msg` that will toggle the visibility of the dropdown list; let's
  call it `ShowAvailableLanguages`
- An update `Msg` that will hide the dropdown list, for when the dropdown is
  open but a click is registered anywhere else on the page; let's call it
  `CloseAvailableLanguages`

We will start with updating the `Msg` union type. Both `Main.elm` and
`LanguageDropdown.elm` are going to need access to `Msg`, so let's extract
it into its own module:

**`src/Msg.elm`**

```haskell
module Msg exposing (Msg(..))


type Msg
    = CloseAvailableLanguages
    | ShowAvailableLanguages
```

Next, extract `Model` and the `init` function from `Main` into a new `Model.elm`
module, making sure that the dropdown is set to be hidden by default:

**`src/Model.elm`**

```haskell
module Model exposing (Model, init)

import Msg exposing (Msg)


type alias Model =
    { showAvailableLanguages : Bool }


init : ( Model, Cmd Msg )
init =
    ( { showAvailableLanguages = False }, Cmd.none )
```

Now, we need to update `Main.elm` and `LanguageDropdown.elm` to import these
modules, and then write some handling code for these `Msg`s in the `update`
function:

**`src/Main.elm`**

```haskell
-- ...
import Model exposing (Model)
import Msg exposing (Msg(CloseAvailableLanguages, ShowAvailableLanguages))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        CloseAvailableLanguages ->
            ( { model | showAvailableLanguages = False }, Cmd.none )

        ShowAvailableLanguages ->
            ( { model
                | showAvailableLanguages = not model.showAvailableLanguages
              }
            , Cmd.none
            )

-- ...

main : Program Never Model Msg
main =
    Html.program
        { view = view
        , init = Model.init
        , update = update
        , subscriptions = always Sub.none
        }
```

In the `LanguageDropdown`, since we will be now be sending messages of type
`Msg`, all function annotations with `Html msg` will need to be updated to be
`Html Msg`. We will also be making use of the `view` function's `model`
parameter throughout the dropdown in order to determine what to show, as well
as how to style the dropdown menu when it is open and closed:

**`src/LanguageDropdown.elm`**

```haskell
-- ...
import Html.Events exposing (onClick)
import Model exposing (Model)
import Msg exposing (Msg(ShowAvailableLanguages))


view : Model -> Html Msg
view model =
    let
        -- ...
    in
        div [ classes ]
            [ currentSelection model
            , dropdownList model
            ]


currentSelection : Model -> Html Msg
currentSelection model =
    let
        displayClasses =
            if model.showAvailableLanguages then
                [ "br--top" ]
            else
                []

        classes =
            [ -- ...
            ]
                ++ displayClasses
                |> String.join " "
                |> class

        -- ...
    in
        p [ classes, onClick ShowAvailableLanguages ]
            [ -- ...
            ]


dropdownList : Model -> Html Msg
dropdownList model =
    let
        displayClasses =
            if model.showAvailableLanguages then
                [ "flex", "flex-column" ]
            else
                [ "dn" ]

        classes =
            [ -- ...
            ]
                ++ displayClasses
                |> String.join " "
                |> class

        -- ...
    in
       -- ...


dropdownListItem : String -> Html Msg
-- ...
```

Once the above changes are made, you should be able to click on the dropdown
menu to open and close it, showing and hiding the available languages. However,
if you open the menu and then click anywhere else, the menu stays open.

In order to get it to close (and actually use that `CloseAvailableLanguages`
message), we are going to have to make use of the [Elm Mouse package][], and a
subscription to mouse clicks.

## Subscribe to Mouse Clicks

Install the Elm Mouse package:

```sh
elm-package install -y elm-lang/mouse
```

Then, create a `subscriptions` function in Elm that listens out for mouse clicks
_only_ when the dropdown menu is open, and if a click is detected, sends a
`CloseAvailableLanguages` message:

**`src/Main.elm`**

```haskell
-- ...
import Mouse

-- ...

subscriptions : Model -> Sub Msg
subscriptions model =
    if model.showAvailableLanguages then
        Mouse.clicks (\_ -> CloseAvailableLanguages)
    else
        Sub.none


main : Program Never Model Msg
main =
    Html.programWithFlags
        { view = view
        , init = Model.init
        , update = update
        , subscriptions = subscriptions
        }
```

Now, whenever you click open the dropdown menu, and then click anywhere else,
the menu will close, as expected.

If the app so far is not behaving as you would expect, compare your code to
[the `2-add-language-dropdown` branch][2-add-language-dropdown] of my
codebase to see if anything is missing.

Now, it's time to give the application the concept of a language to switch, and
replace those placeholder values with actual data!

## Language Switching

Time to get some translations into the application, and for that, we will use
[elm-i18next][], along with the [HTTP in Elm][] package, so let's get
installing:

```sh
elm-package install -y ChristophP/elm-i18next
elm-package install -y elm-lang/http
```

First, let's provide some translation JSON files for the message on screen in
English, Italian, and Japanese. Create a `public/locale/` directory and add the
following files under it:

**`public/locale/translations.en.json`**

```json
{
  "verticallyCenteringInCssIsEasy": "Vertically centering things in css is easy!"
}
```

**`public/locale/translations.it.json`**

```json
{
  "verticallyCenteringInCssIsEasy": "Centrare verticalmente con css è facile!"
}
```

**`public/locale/translations.ja.json`**

```json
{
  "verticallyCenteringInCssIsEasy": "CSSで垂直センタリングは簡単だよ！"
}
```

Next, let's create a `Translations` module where we will define the type for
a language, and provide a helper function to convert a string language code
into a language:

**`src/Translations.elm`**

```haskell
module Translations exposing (Lang(..), getLnFromCode)


type Lang
    = En
    | It
    | Ja


getLnFromCode : String -> Lang
getLnFromCode code =
    case code of
        "en" ->
            En

        "it" ->
            It

        "ja" ->
            Ja

        _ ->
            En
```

Great! Now we need to add some new `Msg` types for:

- Fetching the translations from the JSON files
- Changing the language

**`src/Msg.elm`**

```haskell
module Msg exposing (Msg(..))

import Http exposing (Error)
import I18Next exposing (Translations)
import Translations exposing (Lang)


type Msg
    = ChangeLanguage Lang
    | CloseAvailableLanguages
    | FetchTranslations (Result Error Translations)
    | ShowAvailableLanguages
```

We now need a way to be able to go and fetch the translations from the JSON
files, and return the result back via the `FetchTranslations` message, so let's
create that in a new module called `Cmd`:

**`src/Cmd.elm`**

```haskell
module Cmd exposing (fetchTranslations)

import I18Next
import Msg exposing (Msg(FetchTranslations))
import Translations exposing (Lang)


fetchTranslations : Lang -> Cmd Msg
fetchTranslations language =
    language
        |> toTranslationsUrl
        |> I18Next.fetchTranslations FetchTranslations


toTranslationsUrl : Lang -> String
toTranslationsUrl language =
    let
        translationLanguage =
            language
                |> toString
                |> String.toLower
    in
        "/locale/translations." ++ translationLanguage ++ ".json"
```

Now, the `Model` needs to know about what the `currentLanguage` of the
application is in order to determine what `translations` should be loaded, so
let's add that information, and call the `Cmd.fetchTranslations En` command to
immediately go and fetch the appropriate English translations, which we will
also set as the default language:

**`src/Model.elm`**

```haskell
module Model exposing (Model, init)

import Cmd
import I18Next exposing (Translations)
import Msg exposing (Msg)
import Translations exposing (Lang(En))


type alias Model =
    { currentLanguage : Lang
    , showAvailableLanguages : Bool
    , translations : Translations
    }


init : ( Model, Cmd Msg )
init =
    ( { currentLanguage = En
      , showAvailableLanguages = False
      , translations = I18Next.initialTranslations
      }
    , Cmd.fetchTranslations En
    )
```

Next, we need to handle the new `ChangeLanguage` and `FetchTranslations`
messages in the `update` function:

- When the language is changed, as well as change the `currentLanguage`, we need
  to go and fetch the translations for that language in the same way we did in
  the `init` function
- If fetching the translations succeeds, we will display the new translations,
  otherwise, for now we will just ignore any errors since we would not expect
  to fetch translations for a language that we did not create ourselves.

**`src/Main.elm`**

```haskell
-- ...
import Cmd
import Msg
    exposing
        ( Msg
            ( ChangeLanguage
            , CloseAvailableLanguages
            , FetchTranslations
            , ShowAvailableLanguages
            )
        )

--- ...

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- ...
        ChangeLanguage language ->
            ( { model | currentLanguage = language }
            , Cmd.fetchTranslations language
            )

        FetchTranslations (Ok translations) ->
            ( { model | translations = translations }, Cmd.none )

        FetchTranslations (Err msg) ->
            ( model, Cmd.none )
```

At this stage, the application should be back to a point where everything is
compiling again, but on the surface there are no changes since the language
display still consists of static values, so let's change that.

First, we will create a `Language` module that will have some helper functions
around generating the string value for a language (eg "English" should always
be displayed as "English", regardless of what the current language is), and
keeping a static list of available languages so we can display them in the
dropdown menu. Unfortunately, there is no way to generate a list of type values
from a type (eg `[En, It, Ja]` from the `Lang` type), so it will have to be a
separate definition:

**`src/Language.elm`**

```haskell
module Language exposing (availableLanguages, langToString)

import Translations exposing (Lang(En, It, Ja))


availableLanguages : List Lang
availableLanguages =
    [ En, It, Ja ]


langToString : Lang -> String
langToString language =
    case language of
        En ->
            "English"

        It ->
            "Italiano"

        Ja ->
            "日本語"
```

Now that we have our language data setup, let's go back to the view code and
get the page to start displaying it. First, let's get the correct information
displayed on the dropdown menu for both the current language, and for
the other available languages in the dropdown:

**`src/LanguageDropdown.elm`**

```haskell
-- ...
import Language
import Msg exposing (Msg(ChangeLanguage, ShowAvailableLanguages))
import Translations exposing (Lang)

-- ...

currentSelection : Model -> Html Msg
currentSelection model =
    let
        -- ...
    in
        p [ classes, onClick ShowAvailableLanguages ]
            [ span []
                [ text (Language.langToString model.currentLanguage) ]
            , span [ caretClasses ]
                [ text "▾" ]
            ]


dropdownList : Model -> Html Msg
dropdownList model =
    let
        -- ...

        selectableLanguages =
            List.filter
                (\language -> language /= model.currentLanguage)
                Language.availableLanguages
    in
        ul [ classes ]
            (List.map dropdownListItem selectableLanguages)


dropdownListItem : Lang -> Html Msg
dropdownListItem language =
    let
        -- ...
    in
        li [ classes, onClick (ChangeLanguage language) ]
            [ span []
                [ text (Language.langToString language) ]
            ]
```

At this point, if you select a new language from the dropdown menu, you will
see the current language display change on the menu, and if you open the Elm
debugger, you will see that the language of the application is _actually_
changing, and the translations for the language _are_ being loaded into the
application:

![Language Change](/assets/images/2018-05-11/language-change.png){:
class="img-responsive"
}

Great! Now let's get that translated message showing on the page by letting
the content know what translations it is supposed to be displaying:

**`src/Main.elm`**

```haskell
-- ...
import Translations exposing (Lang)

-- ...

view : Model -> Html Msg
view model =
    let
        -- ...
    in
        main_ [ classes ]
            [ LanguageDropdown.view model
            , content model.translations
            ]


content : Translations -> Html Msg
content translations =
    let
       -- ...
    in
        article [ articleClasses ]
            [ div [ divClasses ]
                [ heading translations ]
            ]


heading : Translations -> Html Msg
heading translations =
    let
        -- ...
    in
        h1 [ classes ]
            [ text (I18Next.t translations "verticallyCenteringInCssIsEasy") ]
```

And now, when you change language, you should see the displayed message in that
language:

![Japanese Display](/assets/images/2018-05-11/japanese-display.png){:
class="img-responsive"
}

Fantastic! That covers the main functionality of language switching, but there
is still more we can do. Before we move on though, if you cannot switch
languages, be sure to double-check your code against
[the `3-add-language-switching` branch][3-add-language-switching] of my
codebase.

## Detect User Language

Currently, the application language is set to English by default when it starts,
but it would be nice if we at least tried to set the application to initially
display in the user's preferred language. To simplify the idea of a "preferred
language" (because [this is not universal amongst browers][ksol-gist]), we will
consider it to be the language of the browser being used. How do we get that?
In Javascript, we can use:

- [`navigator.language`][]
- [`navigator.userLanguage`][] (for Internet Explorer)

So, let's grab this information from Javascript, and pass it into Elm as a
flag:

**`src/index.js`**

```js
import "tachyons"
import { Main } from "./Main.elm"

const appContainer = document.getElementById("root")

if (appContainer) {
  Main.embed(appContainer, { language: getLanguage() })
}

function getLanguage() {
  return navigator.language || navigator.userLanguage
}
```

Our application cannot currently accept flags from Javascript, so let's change
our program type to `programWithFlags` to allow that to happen:

**`src/Main.elm`**

```haskell
-- ...
import Model exposing (Flags, Model)

-- ...

main : Program Flags Model Msg
main =
    Html.programWithFlags
        { view = view
        , init = Model.init
        , update = update
        , subscriptions = subscriptions
        }
```

Next, we will define what type of flags we will accept in the `Model` module,
and because we do not trust any information passed in from Javascript, we will
decode the flag to ensure that we are getting a string.

**`src/Model.elm`**

```haskell
module Model exposing (Flags, Model, init)

-- ...
import Json.Decode as Decode exposing (Value)
import Language


type alias Flags =
    { language : Value }

-- ...

init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        language =
            flags.language
                |> Decode.decodeValue Decode.string
                |> Language.langFromFlag
    in
        ( { currentLanguage = language
          , showAvailableLanguages = False
          , translations = I18Next.initialTranslations
          }
        , Cmd.fetchTranslations language
        )
```

Finally, we will create the `Language.langFromFlag` function that will return
a language if decoding goes well, and return a default language if not:

**`src/Language.elm`**

```haskell
module Language exposing (availableLanguages, langFromFlag, langToString)

-- ...

langFromFlag : Result String String -> Lang
langFromFlag language =
    case language of
        Ok language ->
            Translations.getLnFromCode language

        Err _ ->
            En
```

If your browser language is English, you will not notice any change as a result
of these additions, but if you change your browser language to Italian or
Japanese and then refresh the page, you will see that the application will start
in that language.

For Chrome, you can change the language setting by opening the browser
preferences, opening the Advanced preferences...

![Chrome Advanced Preferences](/assets/images/2018-05-11/chrome-advanced-preferences.png){:
class="img-responsive"
}

...finding the Languages preferences, and then choosing a language to Move to
the top of the list:

![Chrome Language Preferences](/assets/images/2018-05-11/chrome-language-preferences.png){:
class="img-responsive"
}

Default language not changing? Check your code against
[the `4-detect-user-language` branch][4-detect-user-language] of my codebase.

Now, having a default language is nice, but if you switch languages and then
refresh the page, the application will revert back to the language set in the
browser. Plenty of people want to read content in a different language than
their system settings, and it would be nice to be able to save their language
preference for this application. So, let's then use the browser's
[`localStorage`][] to help us do exactly that.

## Store Language Preference

Sending Elm data to Javscript requires us to use [Elm Ports][]. All port
functions return a `Cmd msg`, so let's put the function to remember a language
preference in the `Cmd` module, changing it over to a `port module`:

**`src/Cmd.elm`**

```haskell
port module Cmd exposing (fetchTranslations, storeLanguage)

-- ...

port storeLanguageInLocalStorage : String -> Cmd msg

-- ...

storeLanguage : Lang -> Cmd msg
storeLanguage language =
    language
        |> toString
        |> String.toLower
        |> storeLanguageInLocalStorage
```

Here we have created a `storeLanguage` command function that takes in a `Lang`
type, stringifies it, and sends it off to Javascript via the
`storeLanguageInLocalStorage` port. On the Javascript side, there is currently
no code that is subscribing to messages coming from that port, so we'll make
that next:

**`src/index.js`**

```javascript
// ...
if (appContainer) {
  const app = Main.embed(appContainer, { language: getLanguage() })

  app.ports.storeLanguageInLocalStorage.subscribe((language) => {
    localStorage.setItem("elm-i18n-example-language", language)
  })
}
// ...
```

There is no particular reason behind the "elm-i18n-example-language" named key;
it could have been named anything, but it is best to have it as unique as
possible, since many different applications will likely be making use of
`localStorage`.

Okay, we've got the pathway to Javascript set up, now we need to make sure that
the command is run every time the language is changed (ie the `ChangeLanguage`
message is sent), so let's make that addition to the `update` function:

**`src/Main.elm`**

```haskell
-- ...

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeLanguage language ->
            ( { model | currentLanguage = language }
            , Cmd.batch
                [ Cmd.fetchTranslations language
                , Cmd.storeLanguage language
                ]
            )
    -- ...
```

The `ChangeLanguage` branch of the `update` function has gotten a bit busier,
needing to use `Cmd.batch` to send commands to both fetch new language
translations, and store the user language preference.

Now, you should be able to switch languages, and have it stored in
`localStorage`. Open up the Javascript console in your browser's developer tools
to confirm this with the following command:
`localStorage.getItem("elm-i18n-example-language")`

![Language Stored](/assets/images/2018-05-11/language-stored.png){:
class="img-responsive"
}

Success! But there is one small lingering issue though: if you refresh the
browser, the application is still reverting back to the default language of
English. We need to have our Javascript code get the language from
`localStorage` (if it's there), and pass that in as the Elm language flag, so
let's do that:

**`src/index.js`**

```javascript
// ...
function getLanguage() {
  return localStorage.getItem("elm-i18n-example-language") ||
    navigator.language ||
    navigator.userLanguage
}
```

Now, if you change languages and refresh the page, the application should still
show you the language that you originally selected! If it doesn't, check your
code against
[the `5-store-language-preference` branch][5-store-language-preference] of my
codebase.

At this stage, our page is pretty much feature complete. However, there are
still a few potential issues that would be worthy of a bit more investigation:

- If you refresh the page, you may see the translation key
  "verticallyCenteringInCssIsEasy" briefly flash before the translation is
  shown. This is particularly noticeable on the Japanese translation. Perhaps
  the translations are being loaded too slowly...?
- If you accidentally make a typo when requesting a translation by key in a view
  (eg `I18Next.t translations "thisKeyDoesNotExist"`), then no error
  is raised: the key is simply displayed on the page, which may not be what you
  want.
- If you accidentally do not provide a translation for a particular key for a
  known available language, or make a typo in the translation file (eg delete
  the `translations.ja.json` file or change its key name), then, again, no error
  is raised, and the requested key is displayed on the page as-is.

Elm programmers are spoiled by the Elm compiler always looking over our shoulder
and helping us avoid these kinds of mistakes. If you are confident about
manually handling the issues outlined or they are not important to you, then
all is good and you need not go any further. But, if want Elm to cast more of
an eye over your i18n development, what options are available to you?

## Type-Safe Translations

Since we have our translation files as JSON, we can use [Elm i18n Gen][] to
generate a `Translations` module containing one function for every translation
in the JSON files. So, let's give it a try.

Install it with the following command:

```sh
npm install -g elm-i18n-gen
```

Generate a new `Translations` module for the app with the following command:

```sh
elm-i18n-gen public/locale src/Translations.elm
```

And if you open up the `Translations` module you should see the following:

**`src/Translations.elm`**

```haskell
module Translations exposing (..)


type Lang
    = En
    | It
    | Ja


getLnFromCode : String -> Lang
getLnFromCode code =
    case code of
        "en" ->
            En

        "it" ->
            It

        "ja" ->
            Ja

        _ ->
            En


verticallyCenteringInCssIsEasy : Lang -> String
verticallyCenteringInCssIsEasy lang =
    case lang of
        En ->
            "Vertically centering things in css is easy!"

        It ->
            "Centrare verticalmente con css è facile!"

        Ja ->
            "CSSで垂直センタリングは簡単だよ！"
```

We only have one translation key in our JSON files, so `elm-i18n-gen` created
just one function for us that covers translations for all our languages. You can
also see here that I adopted `elm-i18n-gen`'s specific naming conventions for
`Lang`, and `getLnFromCode` in advance, and deliberately put that information in
the `Translations` module knowing it would be overwritten when the new
`Translations` file was generated (...I think my [Chekhov's Gun][] is
jammed...).

Anyway, now that we have our function, let's use it in the view:

**`src/Main.elm`**

```haskell
-- ...
import Translations exposing (Lang)

-- ...

view : Model -> Html Msg
view model =
    let
        -- ...
    in
        main_ [ classes ]
            [ LanguageDropdown.view model
            , content model.currentLanguage
            ]


content : Lang -> Html Msg
content language =
    let
        -- ...
    in
        article [ articleClasses ]
            [ div [ divClasses ]
                [ heading language ]
            ]


heading : Lang -> Html Msg
heading language =
    let
        -- ...
    in
        h1 [ classes ]
            [ text (Translations.verticallyCenteringInCssIsEasy language) ]
```

The effects of this one change are the following:

- There is now no need to fetch any translations, and consequently the
  `FetchTranslations` `Msg`, the `fetchTranslations` function in the `Cmd`
  module, the `translations` entry in the `Model`, and any trace of the
  `I18Next` and `Http` packages, can now be safely removed.
- The issue of a translation key displaying before the translation is loaded
  has consequently gone away since we are now just calling a function.
- Elm will raise a compiler error if a translation is not provided for all
  languages.

Those are some pretty good benefits! I'm not sure about any downsides to this,
aside from maybe having a single module with potentially hundreds of functions
in it for any given large JSON translation file. But, I would guess the
overhead for maintainability of that module would be the same for the JSON file.
Please let me know if I'm wrong about this!

See [the `6-type-safe-translations` branch][6-type-safe-translations] of my
codebase to see the final form of the application, with all extraneous code
removed.

## Conclusion

Even after all this, I'm still not really sure what to think when it comes to an
ideal solution for I18n in Elm. I am planning on using the methods outlined in
this blog post for the time being, but if you have any better ways of doing
things (I'd love to see an actual example of an app using the [elm-i18n][]
package), please let me know!

[1-recreate-tachyons-doc-page]: https://github.com/paulfioravanti/elm-i18n-example/tree/1-recreate-tachyons-doc-page
[2-add-language-dropdown]: https://github.com/paulfioravanti/elm-i18n-example/tree/2-add-language-dropdown
[3-add-language-switching]: https://github.com/paulfioravanti/elm-i18n-example/tree/3-add-language-switching
[4-detect-user-language]: https://github.com/paulfioravanti/elm-i18n-example/tree/4-detect-user-language
[5-store-language-preference]: https://github.com/paulfioravanti/elm-i18n-example/tree/5-store-language-preference
[6-type-safe-translations]: https://github.com/paulfioravanti/elm-i18n-example/tree/6-type-safe-translations
[Chekhov's Gun]: https://en.wikipedia.org/wiki/Chekhov%27s_gun
[Create Elm App]: https://github.com/halfzebra/create-elm-app
[Elm]: http://elm-lang.org/
[elm-i18n]: https://github.com/iosphere/elm-i18n
[`elm-i18n-example` repo]: https://github.com/paulfioravanti/elm-i18n-example
[elm-i18next]: https://github.com/ChristophP/elm-i18next
[Elm i18n Gen]: https://github.com/ChristophP/elm-i18n-module-generator
[Elm Mouse package]: https://github.com/elm-lang/mouse
[Elm Ports]: https://guide.elm-lang.org/interop/javascript.html
[Full Screen Centered Title component documentation page]: http://tachyons.io/components/layout/full-screen-centered-title/index.html
[HTTP in Elm]: https://github.com/elm-lang/http
[Internationalization naming]: https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming
[JSON]: https://www.json.org/
[ksol-gist]: https://gist.github.com/ksol/62b489572944ca70b4ba
[`localStorage`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[`navigator.language`]: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language
[`navigator.userLanguage`]: http://help.dottoro.com/ljgtasfq.php
[Phoenix Gettext]: https://hexdocs.pm/gettext/Gettext.html
[Rails i18n]: http://guides.rubyonrails.org/i18n.html
[Tachyons]: http://tachyons.io/
[Tachyons' Table of Styles]: http://tachyons.io/docs/table-of-styles/
[Tailwind]: https://tailwindcss.com/
