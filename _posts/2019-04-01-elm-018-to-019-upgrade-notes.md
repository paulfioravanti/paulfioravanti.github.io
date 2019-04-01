---
title: "Elm 0.18 to 0.19 upgrade notes"
date: 2019-04-01 14:20 +1100
tags: elm upgrade elm-0.18 elm-0.19
header:
  image: /assets/images/2019-03-25/david-travis-547046-unsplash.jpg
  image_description: "brown fountain pen on notebook"
  teaser: /assets/images/2019-03-25/david-travis-547046-unsplash.jpg
  overlay_image: /assets/images/2019-03-25/david-travis-547046-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [David Travis](https://unsplash.com/photos/5bYxXawHOQg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/notes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Quite a lot has changed in the Elm ecosystem between version 0.18 and
  0.19, so here are some notes I jotted down while upgrading a few small apps.
---

I upgraded a few toy [Elm][] 0.18 applications I had to 0.19, and along the way,
I encountered some things that I felt I needed to jot down for future me (and
hopefully current/future you as well) to reference.

They are mostly the results of trawling the [Elm Slack][], [Elm Discourse][],
Github issues, documentation for upgraded-to-Elm-0.19 libraries, other blog
posts, and trial and error.

So, here they are in no particular order. If you are currently going through an
Elm 0.18 to 0.19 upgrade, I hope these points save you some time!

## Preface

The very first thing you should do before attempting to update any code manually
is install [`elm-upgrade`][], and run it over your Elm 0.18 app.

There is not much else to add here that is not covered in `elm-upgrade`'s
`README` file. Follow its instructions until you have implemented its
recommendations, and you will be ready to venture out on your own.

## RIP partially `exposing` custom types

In Elm 0.18, if I had a union type (re-named "custom type" in 0.19) that looked
like:

```elm
module Language exposing (Lang(..))

type Lang
    = En
    | It
    | Ja
```

I was able to partially expose values in the type when `import`ed into another
module. For example, if I wanted to use `Lang` in another module, but did not
require the `It` value, I could write:

```elm
import Language exposing (Lang(En, Ja))

availableLanguages : List Lang
availableLanguages =
    [ En, Ja ]
```

In Elm 0.19, this is no longer permitted, nor is explicitly exposing _all_
values from a custom type i.e. `import Language exposing (Lang(En, It, Ja))`.

The only options for accessing the types directly are exposing everything from
a module (`import Language exposing (..)`), which I do not like due to its
non-explicit nature, or the remaining option, accessing the custom type values
through the module name itself:

```elm
import Language exposing (Lang)

availableLanguages : List Lang
availableLanguages =
    [ Language.En, Language.Ja ]
```

I do miss not being able to explicitly expose imported custom type values, and
it feels strange in this case to write `Language.En` instead of `Lang.En`
(because are we not accessing a value of the type and not of the module?), but
this is how I will be using them moving forward. More information about the
rationale behind this change can be found at [this Elm Discourse
thread][Exposing a subset of custom type constructors in 0.19].

## RIP `Basics.toString`

In Elm 0.18, I used the convenience of `toString` to stringify custom type
values. I had a list of typed languages in an app that looked this this:

**`Language.elm`**

```elm
type Language
    = En
    | It
    | Ja
```

In order to keep track of what language a user switched the app to, I wanted to
stringify the face values of the type before sending them off via ports to be
put in browser local storage. This happened in an `update` function that
looked something like:

**`Locale/Update.elm`**

```elm
update : Msg -> Locale -> ( Locale, Cmd Msg )
update msg locale =
    case msg of
        ChangeLanguage language ->
            ( { locale | language = language }
            , language
                |> toString
                |> String.toLower
                |> Ports.storeLanguage
            )

        -- ...
```

When a `ChangeLanguage` message is received, before sending the `Language`
outside of Elm-land, it would get transformed from `En` to `"En"` to `"en"`. I
thought this was pretty convenient, but Elm 0.19 put a stop to that, and I
needed to change the code to something like this:

**`Language.elm`**

```elm
type Language
    = En
    | It
    | Ja

toString : Language -> String
toString language =
    case language of
        En ->
            "en"

        It ->
            "it"

        Ja ->
            "ja"
```

**`Update.elm`**

```elm
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Msg.ChangeLanguage language ->
            ( Model.changeLanguage language model
            , language
                |> Language.toString
                |> Ports.storeLanguage
            )
```

This change initially felt like Elm was forcing me to write more boilerplate
code. But, I now like the extra explicitness, as well as the very hard line
approach that conveys to me that types are in _no way_ related to strings.

There is still an escape hatch to stringify a type during development using Elm
0.19's [`Debug.toString`][] function, but
[as its documentation says][Debug documentation], "[i]t is not available for use
in packages or production".

## `<body>` tag attributes must still be set via ports

One major change with views in Elm 0.19 is that if you are creating an HTML
document that is entirely managed by Elm (using either [`Browser.document`][] or
[`Browser.application`][]), then your `view` function now returns
[`Document msg`][`Browser.document`], rather than [`Html msg`][`Html.Html`].

A `Document` is a record that looks like this:

```elm
type alias Document msg =
    { title : String
    , body : List (Html msg)
    }
```

What is strange to me, is that unlike the function signatures of all the tags
in the [`Html` module][`Html`], which look like
`List (Attribute msg) -> List (Html msg) -> Html msg`, the `body` attribute of
a `Document` only takes a `List (Html msg)` for the children of the `<body>`
tag, and not a `List (Attribute msg)` for attributes of the `<body>` tag itself.

So, if I want to, say, set some classes on the `<body>` tag to get
`<body class="bg-white sans-serif w-100"`, I would have to do
this using ports, just like in Elm 0.18.  For a [`Browser.application`][] Elm
app, this could look like:

**`Main.elm`**

```elm
port initBodyClasses : String -> Cmd msg

main : Program Flags Model Msg
main =
    Browser.application
        { init = init
        , -- ...
        }


init : Flags -> Url -> Key -> ( Model, Cmd Msg )
init flags url key =
    ( Model.init flags url key
    , Cmd.batch
        [ Navigation.pushUrl key (Url.toString url)
        , initBodyClasses "bg-white sans-serif w-100"
        ]
    )
```

**`index.js`**

```js
// ...
app.ports.initBodyClasses.subscribe(classes => {
  document.body.className = classes
})
```

Ultimately, this is a minor inconvenience, but I only note it because it is
something that I would expect to be able to do in Elm-land. Perhaps in a future
version...?

## Conditional subscriptions dependent on model attributes

I had a locale dropdown menu in an application which, when clicked, would open a
list of languages that could be switched to (i.e. a `msg` would be sent to
update a `showAvailableLanguages` attribute on a `locale` record in the model to
`True`).  Whenever you clicked anywhere on the page aside from the menu, it
would close (i.e. a `msg` would be sent to update `showAvailableLanguages` to
`False`).

This was implemented in the application `subscriptions` using the
[`elm-lang/mouse`][] package, looking something like this in Elm 0.18 code:

**`Main.elm`**

```elm
main : Program Flags Model Msg
main =
    Navigation.programWithFlags
        UpdatePage
        { -- ...
        , subscriptions = subscriptions
        }

subscriptions : Model -> Sub Msg
subscriptions { locale } =
    if locale.showAvailableLanguages then
        Mouse.clicks (\_ -> CloseAvailableLanguages)
    else
        Sub.none
```

In Elm 0.18, the model that is passed into the `subscriptions` function is
the post-`update` new model, and therefore we can make subscriptions conditional
based on values in it.

However, as of this writing, in Elm 0.19 it would seem that is no longer
the case. Even after updating [`Mouse.clicks`][] in the above code to use
[`Browser.Events.onClick`][] from [`elm/browser`][], the dropdown menu would
seem to not close, and `showAvailableLanguages` would seem get updated
"out-of-sync" to the application state I was seeing in the Elm debugger.

After finding [this Github issue][elm/compiler/issues/1776], I realised that the
problem may be with the Elm compiler itself. So, I ended up completely
removing the conditional subscription from the Elm 0.19 version of the app, and
replacing it with an `onMouseLeave` event directly on the dropdown menu `div`
element that would send the `CloseAvailableLanguages` message, which I now
actually prefer. Something like:

**`LanguageSelector/View.elm`**

```elm
view : Language -> LanguageSelector -> Html msg
view language languageSelector =
    let
        availableLanguagesToggle =
            if languageSelector.showAvailableLanguages then
                [ onMouseLeave Msg.CloseAvailableLanguages ]

            else
                []
    in
    div
        ([ attribute "data-name" "language-selector"
         , -- ..
         ]
            ++ availableLanguagesToggle
        )
        [ -- ..
        ]
```

It's a shame that there is no `Html.Events.none` to prevent the list
concatenation. Regardless, the takeaway is to, at least for now, refrain
from having conditional subscriptions that depend on any attributes in your
model until the issue mentioned above is fixed.

## URL fragment navigation has issues

If you use hashes (`#`) in your application, either in the form of hash-based
routing (e.g. in a URL like `http://example.com/store/#/products/1`, you parse
information in the [fragment][Fragment Identifier] to determine that you
need to display the page for a product with ID of 1), or you use fragments
in [HTML anchors][] to link to different parts of the same page (e.g.
`<a href="#top">Top</a>`), you will have some decisions to make to get them
working as you would expect in Elm 0.19.

### Hash-based routing in path-based clothes

[`evancz/url-parser`][], often used in Elm 0.18 applications that have
navigation, has a [`UrlParser.parseHash`][] function to help with parsing
URL fragments against defined routes. Elm 0.19's [`Url.Parser`][] from
[`elm/url`][] no longer supports this. So, your current routing options for
Elm 0.19 are:

- Change your application to route on URL paths, rather than fragments
- Keep your fragment routing, but before you pass your [`Url`][], to
  [`Url.Parser.parse`][] to run it against your route matchers, send it through
  a function that will overwrite the `path` property of the [`Url`][] with the
  content of the fragment. Something like:

  ```elm
  migrateUrlFragmentToPath : Url -> Url
  migrateUrlFragmentToPath url =
      { url | path = Maybe.withDefault "" url.fragment, fragment = Nothing }
  ```

The Github issues to follow with regards to this are
[here][Browser.element with navigation] and
[here][Support Hash-Routing (again)]. Both provide further explanation and
helpful examples of the problem, so be sure to subscribe to them if this is an
issue that affects you.

### Anchor navigation requires a page load

Even if your application has path-based routing, and you think you are not
affected by the issue above, if you use fragments to navigate to different parts
of a page, and have used code from the [Elm navigation example][Elm navigation
example] for handling `Internal` types of [`Browser.UrlRequest`][]s (since a
fragment is certainly not an `External` type of link), you may be surprised that
when your `UrlRequest` is passed into the [`Browser.Navigation.pushUrl`][]
function...nothing happens.

More information around this problem is contained in [this Github issue][Jumping
to fragments does not work in a good way in `Browser.application`], but the way
I am currently working around this, in an application that is both path-routed
_and_ contains fragments in anchor tags for same-page navigation, is through the
following clause in my `update` function:

```elm
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Msg.LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    let
                        href =
                            Url.toString url

                        navigation =
                            case url.fragment of
                                Nothing ->
                                    Navigation.pushUrl model.key href

                                Just _ ->
                                    Navigation.load href
                    in
                    ( model, navigation)

                Browser.External href ->
                    ( model, Navigation.load href )
```

This does result in a page load for anchor fragment links, but in my case this
does not seem to have been a noticeable issue, and as of this writing I do not
see another way around it.

## Testing applications without a `Browser.Navigation.Key`

When the `init` function is called in a [`Browser.application`][] program, one
of the parameters that it receives is a [`Browser.Navigation.Key`][], which is
needed to "create navigation commands that change the URL". For example:

```elm
main : Program () Model Msg
main =
    Browser.application
        { init = init
        , -- ...
        }


type alias Model =
    { key : Key
    , url : Url
    }


init : () -> Url -> Key -> ( Model, Cmd Msg )
init () url key =
    ( Model key url, Cmd.none )
```

You receive this key whether you like it or not; it is passed into the Elm
application from Javascript-land, and as of this writing there is no way to
generate one yourself on-the-fly in Elm-land. What this means is that the `init`
function, as well as parts of any function that use a key, cannot be tested with
`elm test`.

This is not so great for tests that simulate a click somewhere on a page and
check that the right `msg` is being sent ([example][elm-explorations/test
Test-Html-Event#expect]). If you have an `update` function that looks similar to
what is in the [Elm navigation example][], you will see that you need to pass a
key into the [`Browser.Navigation.pushUrl`][] function:

```elm
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                 Browser.Internal url ->
                     ( model, Navigation.pushUrl model.key (Url.toString url) )

                 Browser.External href ->
                     ( model, Navigation.load href )
```

Assuming that, like in the example above, you keep your key somewhere in your
model, what can you do without a key during testing that will allow your
application to compile?

The path of least resistance for me was to change what is stored in the model to
a `Maybe Key`, and ensure that functions like [`Browser.Navigation.pushUrl`][]
are never run when the key is `Nothing`:

```elm
type alias Model =
    { key : Maybe Key
    , url : Url
    }

init : () -> Url -> Key -> ( Model, Cmd Msg )
init () url key =
    ( Model (Just key) url, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    case model.key of
                        Just key ->
                            ( model, Navigation.pushUrl key (Url.toString url) )

                        Nothing ->
                            Cmd.none

                Browser.External href ->
                    ( model, Navigation.load href )
```

The clause for `Nothing` will never be matched while you are running your
application in development or production: it is there simply so you can test
your update function with a key-less model.

There is a [Github issue][Anything with Browser.Navigation.Key cannot be tested]
tracking this problem, and the Elm team are ["working on designs for a possible
API to address this"][Anything with Browser.Navigation.Key cannot be tested
comment], so consider the above solution strictly a temporary workaround until
an API is developed. For now, you will just have to deal with a maximum
[test coverage][Elm Coverage] of 99%.

## Upgrading dependencies

Once you have upgraded your Elm application to 0.19, you will probably need a
way to determine whether any of its packages are out of date.

As far as I know, Elm itself does not currently have a way to determine this.
However, thanks to [elm-dependencies-analyzer][], you can simply cut and paste
the content of your application's `elm.json` file into the [live version of the
program][elm-dependencies-analyzer live], and it will tell you which packages
you are able to version up.

What you should actually do once you know what package(s) you have to upgrade
was initially a source of confusion for me, but after reading [this Discourse
thread][How do your upgrade a package in your app], and a bit of trial and
error, I now work on this rule of thumb:

- If the dependency to be upgraded is a "direct" dependency, remove the entry
from `elm.json` and then run `elm install author/package` to re-introduce it
back into the `elm.json` file using the newest version
- If the dependency to be upgraded is an "indirect" dependency, then directly
edit the entry in `elm.json` to the target version number, and then run
`elm make`, which will download the new dependency (yes, you are not supposed to
directly edit `elm.json`, but as of this writing I do not see another way
around this)

Perhaps an `elm install author/package --indirect` command will find its way
into a future version of Elm...?

## Other miscellaneous thoughts

- I quite liked the change in the `Html.Attributes.style` API from its
  `List ( String, String ) -> Attribute msg` implementation in
  [`elm-lang/html`][elm-lang/html Html-Attributes#style] versus the current
  `String -> String -> Attribute msg` implementation in
  [`elm/html`][elm/html Html-Attributes#style]. More readable in my opinion.
- I think the Elm Javascript interface is much nicer in 0.19: being able to
  explicitly specify `node` and `flags` elements in a single object to pass in
  to the Elm application is less cognitive overhead:

  **`index.js`**

  ```js
  // Elm 0.18
  import { Main } from "./Main.elm";

  const appContainer = document.querySelector("#root");
  Main.embed(appContainer, {
    apiUrl: "https://www.example.com/api/endpoint"
  })

  // Elm 0.19
  import { Elm } from "./Main.elm";

  Elm.Main.init({
    node: document.querySelector("#root"),
    flags: {
      apiUrl: "https://www.example.com/api/endpoint"
    }
  })
  ```

- For an application that does not accept flags, I like to now be able to write
  the type signature for its flags with the unit type:
  `main : Program () Model Msg`, rather than `main : Program Never Model Msg`
- Being able to update the title of a page in Elm-land, rather than through
  ports, thanks to the [`Browser.Document`][] API, is a great addition
- The change in API from [`Html.Events.onWithOptions`][] to
  [`Html.Events.custom`][] makes it more readable in my opinion. I found out
  about the change itself [here][Why can't I use `onWithOptions` in elm 0.19]
- A good reference for a bare minimum implementation of each of the 4 different
  ways to boot an Elm app can be found at [this gist][Bare minimum for Elm 0.19]

[Anything with Browser.Navigation.Key cannot be tested]: https://github.com/elm-explorations/test/issues/24
[Anything with Browser.Navigation.Key cannot be tested comment]: https://github.com/elm-explorations/test/issues/24
[Bare minimum for Elm 0.19]: https://gist.github.com/roine/a2da44f2047d494cabaf715f06a591db
[`Browser.application`]: https://package.elm-lang.org/packages/elm/browser/latest/Browser#application
[`Browser.Document`]: https://package.elm-lang.org/packages/elm/browser/latest/Browser#Document
[`Browser.document`]: https://package.elm-lang.org/packages/elm/browser/latest/Browser#document
[Browser.element with navigation]: https://github.com/elm/browser/issues/43
[`Browser.Events.onClick`]: https://package.elm-lang.org/packages/elm/browser/latest/Browser-Events#onClick
[`Browser.Navigation.Key`]: https://package.elm-lang.org/packages/elm/browser/latest/Browser-Navigation#Key
[`Browser.Navigation.pushUrl`]: https://package.elm-lang.org/packages/elm/browser/latest/Browser-Navigation#pushUrl
[`Browser.UrlRequest`]: https://package.elm-lang.org/packages/elm/browser/latest/Browser#UrlRequest
[Debug documentation]: https://package.elm-lang.org/packages/elm/core/latest/Debug
[`Debug.toString`]: https://package.elm-lang.org/packages/elm/core/latest/Debug#toString
[Elm]: https://elm-lang.org/
[`elm/browser`]: https://github.com/elm/browser
[elm/compiler/issues/1776]: https://github.com/elm/compiler/issues/1776
[Elm Coverage]: https://github.com/zwilias/elm-coverage
[elm-dependencies-analyzer]: https://github.com/malaire/elm-dependencies-analyzer
[elm-dependencies-analyzer live]: https://www.markuslaire.com/github/elm-dependencies-analyzer/
[Elm Discourse]: https://discourse.elm-lang.org/
[elm-explorations/test Test-Html-Event#expect]: https://package.elm-lang.org/packages/elm-explorations/test/latest/Test-Html-Event#expect
[elm/html Html-Attributes#style]: https://package.elm-lang.org/packages/elm/html/1.0.0/Html-Attributes#style
[elm-lang/html Html-Attributes#style]: https://package.elm-lang.org/packages/elm-lang/html/latest/Html-Attributes#style
[`elm-lang/mouse`]: https://github.com/elm-lang/mouse
[Elm navigation example]: https://guide.elm-lang.org/webapps/navigation.html#example
[Elm Slack]: https://elmlang.herokuapp.com/
[`elm-upgrade`]: https://github.com/avh4/elm-upgrade
[`elm/url`]: https://package.elm-lang.org/packages/elm/url/latest/Url
[`evancz/url-parser`]: https://package.elm-lang.org/packages/evancz/url-parser/latest/
[Exposing a subset of custom type constructors in 0.19]: https://discourse.elm-lang.org/t/exposing-a-subset-of-custom-type-constructors-in-0-19/1836
[Fragment Identifier]: https://en.wikipedia.org/wiki/Fragment_identifier
[How do your upgrade a package in your app]: https://discourse.elm-lang.org/t/how-do-your-upgrade-a-package-in-your-app/2505
[`Html`]: https://package.elm-lang.org/packages/elm/html/latest/Html
[Html Anchors]: https://en.wikipedia.org/wiki/HTML_element#Anchor
[`Html.Events.custom`]: https://package.elm-lang.org/packages/elm/html/1.0.0/Html-Events#custom
[`Html.Events.onWithOptions`]: https://package.elm-lang.org/packages/elm-lang/html/latest/Html-Events#onWithOptions
[`Html.Html`]: https://package.elm-lang.org/packages/elm/html/latest/Html#Html
[Jumping to fragments does not work in a good way in `Browser.application`]: https://github.com/elm/browser/issues/39
[`Mouse.clicks`]: https://package.elm-lang.org/packages/elm-lang/mouse/latest/Mouse#clicks
[Support Hash-Routing (again)]: https://github.com/elm/url/issues/24
[`Url`]: https://package.elm-lang.org/packages/elm/url/latest/Url
[`Url.Parser`]: https://package.elm-lang.org/packages/elm/url/latest/Url-Parser
[`Url.Parser.parse`]: https://package.elm-lang.org/packages/elm/url/latest/Url-Parser#parse
[`UrlParser.parseHash`]: https://package.elm-lang.org/packages/evancz/url-parser/latest/UrlParser#parseHash
[Why can't I use `onWithOptions` in elm 0.19]: https://stackoverflow.com/questions/52541501/why-cant-i-use-onwithoptions-in-elm-0-19
