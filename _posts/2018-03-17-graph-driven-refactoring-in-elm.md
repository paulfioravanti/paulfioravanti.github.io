---
redirect_from: /blog/2018/03/17/graph-driven-refactoring-in-elm/
title: "Graph-driven Refactoring in Elm"
date: 2018-03-17 12:15 +1100
tags: elm refactoring architecture graphs
header:
  image: /assets/images/2018-03-17/REST-branch-Messages-pre-refactor.png
  image_description: "Generated graph from elm-module-graph package"
  teaser: /assets/images/2018-03-17/REST-branch-Messages-pre-refactor.png
  overlay_image: /assets/images/2018-03-17/REST-branch-Messages-pre-refactor.png
  overlay_filter: 0.8
excerpt: >
  Visually explore package and module dependencies in an Elm project to help
  architect your app.
---

After completing the "[Phoenix and Elm, a real use case][]" tutorial by
[Ricardo García Vega][], I went back and refactored parts of the codebase in
order to help me really understand it, and get everything straight in my head
(I wrote about this in [Migrating a Phoenix and Elm app from REST to GraphQL][],
and you can see the results in [my repository][Paul's repo] versus
[the original][Ricardo's repo]).

## Architecting in the Dark

I could not seem to find any generally-accepted ways to architect Elm code in
the same way as I would architect Elixir/Phoenix or Ruby/Rails code, so I
just let my instincts guide the code architecture direction, which currently
lean towards small(er) modules and functions.

So, I thought it would be a good idea to break out code from big Elm files into
individual smaller files located under conceptual concerns directories. For
example, I extracted application code that looked like it was mostly concerned
with a `Contact` out into a structure like this:

```sh
Contact/
  Commands.elm
  Decoder.elm
  Messages.elm
  Model.elm
  Update.elm
  View.elm
```

Messages to update a `Contact` would be wrapped in a top level `Msg` type called
`ContactMsg`, and when that came through the main `update` function, handling
of the update would be immediately delegated out to `Contact.Update`.

**`assets/elm/src/Update.elm`**

```elm
module Update exposing (update, ...)

import Messages exposing (Msg(ContactMsg, ...))
import Model exposing (Model, ...)
-- ...

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ContactMsg msg ->
            Contact.Update.update msg model

-- ...
```

The nested message inside a `ContactMsg`, is completely opaque to `Update`, and
it was only `Contact.Update` that knew what should happen when, in this case, a
`FetchContact` message is received:

**`assets/elm/src/Contact/Update.elm`**

```elm
module Contact.Update exposing (update)

import Contact.Messages exposing (ContactMsg(FetchContact))
import Messages exposing (Msg)
import Model exposing (Model, RemoteData(Failure, Success))


update : ContactMsg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchContact (Ok response) ->
            ( { model | contact = Success response }, Cmd.none )

        FetchContact (Err error) ->
            ( { model | contact = Failure "Contact not found" }, Cmd.none )
```

This sort of thing seemed like a good pattern to me in the absence of any
others, but there was no way I could really tell if it was _actually_ any
good, or if there would be any issues, performance or otherwise, related to
coding Elm in this way.

## Graphing Dependencies

Until, that is, I was introduced to [elm-module-graph][], which enables you to
visually explore package and module dependencies in an Elm project. It helped
me understand that:

- My code was not really properly separated out into the concerns I thought it
  was.
- I had the Elm equivalent of a [God object][]-in-the-making: a module
  that too many _other_ modules had knowledge about. These modules, given enough
  other modules that have it as a dependency, can lead to longer Elm compile
  times every time a change is made on them.

### Create Graph File

Here is how I generated the needed `module-graph.json` for the
[Address Book app][Paul's repo] (adapt the commands as necessary for your own
project, and make sure you have [Python][] installed):

```sh
cd assets/elm
wget https://raw.githubusercontent.com/justinmimbs/elm-module-graph/master/elm-module-graph.py
chmod 744 elm-module-graph.py
./elm-module-graph.py src/Main.elm
```

### Display Graph

Next, navigate to <https://justinmimbs.github.io/elm-module-graph/> and upload
the generated `module-graph.json` file, and you will see something like this:

![REST branch default modules][]{:class="img-responsive"}

The default graph display includes modules from external libraries, so let's
hide them (by toggling the display of the external packages at the top) so that
we can focus on the application code:

![REST branch only project modules][]{:class="img-responsive"}

## Find Long Bars

If a module has a long bar with attached lines in the graph, that means that it
is imported by many modules. Here, it is clear that the `Messages` module,
displayed right in the middle of the graph, has the longest bar, so let's take
a clearer look at its dependencies by clicking on it:

![REST branch Messages pre-refactor][]{:class="img-responsive"}

- The modules in <span style="color: red">red</span> are the modules that
  `Messages` imports into itself. These are not the relationships we need to
  worry about.
- The modules in <span style="color: blue">blue</span> are the modules that
  import `Messages` into themselves. Here, we can see that a great many "child"
  modules like `Contact.Update`, have knowledge about "parent" `Messages`, but
  `Contact.Update` should _really_ only know about the type of message it deals
  with directly, the `ContactMsg`, and leave knowledge about (and handling of)
  `Msg` type messages to the `Messages` module.

We have some leaking of encapsulation within the concerns, so, let's see what
can be done to fix them, with the initial goal of not having any modules under
the `Contact` concern import the `Messages` module. The starting point for this
refactor will be the [`rest` branch of the Address App][Paul's repo], so if
you're following along at home, clone the repo and let's get refactoring!

> If you get stuck while refactoring at any step of the way, have a look at
the [`rest-refactor` branch of the Address App][Paul's repo rest-refactor] for
guidance.

## Initial Preparation

### Extract RemoteData into its own Module

Currently, the `RemoteData` type is contained in the top-level `Model` module.
Since `Contact` concern modules needs to know about `RemoteData`, but not
`Model` (they should only need to know about `Contact.Model`), let's remove
`RemoteData` out from `Model` and into its own top level module:

**`assets/elm/src/RemoteData.elm`**

```elm
module RemoteData exposing (RemoteData(..))


type RemoteData e a
    = Failure e
    | NotRequested
    | Requesting
    | Success a
```

The Elm compiler should let you know the modules in which you need to change
`RemoteData` references to this new one, but most of the edits will consist of
changing references like:

```elm
import Model
    exposing
        ( Model
        , RemoteData(NotRequested, Requesting, Failure, Success)
        )
```

to something like:

```elm
import Model exposing (Model)
import RemoteData
    exposing
        ( RemoteData(NotRequested, Requesting, Failure, Success)
        )
```

### Create Routing Concern

In `Contact.View`, there is the following line:

**`assets/elm/src/Contact/View.elm`**

```elm
import Messages exposing (Msg(NavigateTo))
```

`NavigateTo` is a message that is sent in `onClick` link attributes in HTML
inside multiple view files. When this message is handled in `Update`, it only
runs a command to navigate to a new URL, and does not return a new model:

**`assets/elm/src/Update.elm`**

```elm
module Update exposing (update, ...)

import Navigation
import Routing exposing (Route(...))
-- ...

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- ...

        NavigateTo route ->
            ( model, Navigation.newUrl (Routing.toPath route) )
-- ...
```

So, in order to de-couple `Contact.View` from `Messages`, it looks like a new
extraction of a `Routing` concern will be in order, so let's start with defining
messages and update handling for `Routing`:

**`assets/elm/src/Routing/Messages.elm`**

```elm
module Routing.Messages exposing (RoutingMsg(..))

import Routing exposing (Route)


type RoutingMsg
    = NavigateTo Route
```

**`assets/elm/src/Routing/Update.elm`**

```elm
module Routing.Update exposing (update)

import Navigation
import Routing
import Routing.Messages exposing (RoutingMsg(NavigateTo))


update : RoutingMsg -> Cmd msg
update msg =
    case msg of
        NavigateTo route ->
            Navigation.newUrl (Routing.toPath route)
```

We will also need to allow for a `RoutingMsg` to be handled by the top-level
`Messages` module, so let's add that (while removing `NavigateTo` from
`Messages`), and fix `Update` so it can handle these new `RoutingMsg` messages:

**`assets/elm/src/Messages.elm`**

```elm
module Messages exposing (Msg(..))

import Contact.Messages exposing (ContactMsg)
import ContactList.Messages exposing (ContactListMsg)
import Navigation
import Routing.Messages exposing (RoutingMsg)


type Msg
    = ContactMsg ContactMsg
    | ContactListMsg ContactListMsg
    | RoutingMsg RoutingMsg
    | UpdateSearchQuery String
    | UrlChange Navigation.Location
```

**`assets/elm/src/Update.elm`**

```elm
module Update exposing (update, ...)

import Routing.Update
-- ...


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- ...

        RoutingMsg msg ->
            ( model, Routing.Update.update msg )
-- ...
```

## Use RoutingMsg in Contact Views

Once this is done, we will start focusing on `Contact`-related modules.
You will find that a number of different view files have been affected by
the creation of the `RoutingMsg`, so some references and type signatures will
need to change.

The Elm compiler should let you know about which modules need to have their
`NavigateTo` references changed, but most of the edits will consist of changing
references like:

```elm
import Messages exposing (Msg(NavigateTo))
```

to something like:

```elm
import Messages exposing (Msg(RoutingMsg))
```

or (depending on the file):

```elm
import Routing.Messages exposing (RoutingMsg(NavigateTo))
```

as well as changing function declarations to return a `RoutingMsg`, rather than
a `Msg`:

**`assets/elm/src/Contact/View.elm`**

```elm
-- ...

import Routing.Messages exposing (RoutingMsg(NavigateTo))
-- ...

view : Model -> Html RoutingMsg
-- ...

showView : Contact -> ( String, Html RoutingMsg )
-- ...

-- etc etc change Msg to RoutingMsg for all the functions in this file ...
```

Again, the Elm compiler will guide you on where the references need to be
changed.

Next, there will be some messages across multiple concerns that will need to be
`Html.map`ped into `RoutingMsg` messages:

**`assets/elm/src/ContactList/View.elm`**

```elm
module ContactList.View exposing (view)

import Messages exposing (Msg(RoutingMsg, ...))
-- ...

contactsList : Model -> ContactList -> Html Msg
contactsList model page =
    if page.totalEntries > 0 then
        page.entries
            |> List.map Contact.View.showView
            |> Keyed.node "div" [ class "cards-wrapper" ]
            |> Html.map RoutingMsg
    else
      -- ...
```

**`assets/elm/src/View.elm`**

```elm
module View exposing (view)

import Messages exposing (Msg(RoutingMsg))
-- ...


page : Model -> Html Msg
page model =
    case model.route of
        -- ...

        ShowContactRoute id ->
            model
                |> Contact.View.view
                |> Html.map RoutingMsg

        NotFoundRoute ->
            Shared.View.warningMessage
                "fa fa-meh-o fa-stack-2x"
                "Page not found"
                (Html.map RoutingMsg Shared.View.backToHomeLink)
```

One final minor view-related change is in the signature for
`Shared.View.warningMessage`:

**`assets/elm/src/Shared/View.elm`**

```elm
warningMessage : String -> String -> Html msg -> Html msg
warningMessage iconClasses message content =
    div [ class "warning" ]
        [ span [ class "fa-stack" ]
            [ i [ class iconClasses ] [] ]
        , h4 []
            [ text message ]
        , content
        ]
```

The change is ever-so-subtle: `Html Msg` to `Html msg`. This function is used
in both `Contact` and `ContactList` views, and the message wrapped inside the
`Html` could be a `ContactMsg` or a `Msg` type. Since the type of message is
not consequential for the rendering of the warning message, we make the type
signature ambivalent to the type of message provided and then returned back.

And that should take care of View-related code, so on to `Contact.Update`!

## Hide Model from Contact.Update

Currently, in `Update`, we're passing the whole `Model` off to `Contact.Update`
when we receive a `ContactMsg`, and `Contact.Update.update` returns back a
`(Model, Cmd Msg)`.

However, `Contact.Update` should only be concerned with returning a new
`Contact`: it does not need to know about the rest of the `Model`.  Also,
`Contact.Update` should only know how to return messages of its own type:
`ContactMsg`. So, we want:

- `Contact.Update.update` to return back a `(Contact, Cmd ContactMsg)`
- Have the `Update` module return a model with the new `Contact`
- Have the `Update` module convert the `ContactMsg` into a `Msg`.

**`assets/elm/src/Update.elm`**

```elm
module Update exposing (update, ...)

import Messages exposing (Msg(ContactMsg, ...))
import Model exposing (Model, ...)
-- ...

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ContactMsg msg ->
            let
                ( contact, cmd ) =
                    Contact.Update.update msg
            in
                ( { model | contact = contact }, Cmd.map ContactMsg cmd )

-- ...
```

Now that `Contact.Update.update` doesn't receive a `Model` any more, let's
change it so that it returns the `(Contact, Cmd ContactMsg)` that `Update` now
wants:

**`assets/elm/src/Contact/Update.elm`**

```elm
module Contact.Update exposing (update)

import Contact.Messages exposing (ContactMsg(FetchContact))
import Contact.Model exposing (Contact)
import RemoteData exposing (RemoteData, RemoteData(Failure, Success))


update : ContactMsg -> ( RemoteData String Contact, Cmd ContactMsg )
update msg =
    case msg of
        FetchContact (Ok response) ->
            ( Success response, Cmd.none )

        FetchContact (Err error) ->
            ( Failure "Contact not found", Cmd.none )
```

## Contact.Commands should return ContactMsgs

Currently, the `Contact.Commands.fetchContact` function returns a top-level
`Cmd Msg` type. What we want to do is have it instead return a `Cmd ContactMsg`,
and have the caller of the function (in this case `Update.urlUpdate`) be
responsible for `Cmd.map`ping the `ContactMsg` to a `Msg`.

So, this is what we currently have:

**`assets/elm/src/Contact/Commands.elm`**

```elm
module Contact.Commands exposing (fetchContact)

import Commands exposing (contactsApiUrl)
import Contact.Decoder as Decoder
import Contact.Messages exposing (ContactMsg(FetchContact))
import Http
import Messages exposing (Msg(ContactMsg))


fetchContact : Int -> Cmd Msg
fetchContact id =
    let
        apiUrl =
            contactsApiUrl ++ "/" ++ toString id
    in
        Decoder.decoder
            |> Http.get apiUrl
            |> Http.send FetchContact
            |> Cmd.map ContactMsg
```

**`assets/elm/src/Update.elm`**

```elm
module Update exposing (update, urlUpdate)

-- ...

urlUpdate : Model -> ( Model, Cmd Msg )
urlUpdate model =
    case model.route of
        -- ...

        ShowContactRoute id ->
            ( { model | contact = Requesting }
            , Contact.Commands.fetchContact id
            )

-- ...
```

And this is what we need to change the files to:

**`assets/elm/src/Contact/Commands.elm`**

```elm
module Contact.Commands exposing (fetchContact)

import Commands exposing (contactsApiUrl)
import Contact.Decoder as Decoder
import Contact.Messages exposing (ContactMsg(FetchContact))
import Http


fetchContact : Int -> Cmd ContactMsg
fetchContact id =
    let
        apiUrl =
            contactsApiUrl ++ "/" ++ toString id
    in
        Decoder.decoder
            |> Http.get apiUrl
            |> Http.send FetchContact
```

**`assets/elm/src/Update.elm`**

```elm
module Update exposing (update, urlUpdate)

-- ...

urlUpdate : Model -> ( Model, Cmd Msg )
urlUpdate model =
    case model.route of
        -- ...

        ShowContactRoute id ->
            ( { model | contact = Requesting }
            , id
                |> Contact.Commands.fetchContact
                |> Cmd.map ContactMsg

-- ...
```

Phew! We've made quite a lot of changes across multiple files, so let's see if
it paid off!

> Having compilation problems? Compare what you've written with code in the
[`rest-refactor` branch of the Address App][Paul's repo rest-refactor] and see
if they match up.

Re-generate the `module-graph.json` file (`./elm-module-graph.py src/Main.elm`),
and re-upload it to <https://justinmimbs.github.io/elm-module-graph/> and let's
see what the graph says:

![REST branch Messages Contact refactored][]{:class="img-responsive"}

Awesome! Modules in the `Contact` concern now have no direct dependencies with
the top level `Messages` module!

I have attempted to take this even further by removing `ContactList`
dependencies in the `Messages` module, and you can see the results of that
in the [`rest-refactor` branch of the Address App][Paul's repo rest-refactor]
if you are interested.  Suffice to say, the graph now looks like:

![REST branch Messages post-refactor][]{:class="img-responsive"}

Not bad! With further refactoring and re-architecting, maybe I could remove
`ContactList.View` from this list, but I'm done fighting with types for now
:sweat_smile:

## Conclusion

I found that using [elm-module-graph][] was helpful in getting a high
level overview of my Elm application, determining where potential compilation
bottlenecks could appear, and deciding how to structure modules.

Is the way I architected and then refactored the application presented here a
"good" way to do it? At this stage, I do not know. I am very happy to be shown
to be wrong about this, but for now, this way of doing things (less massive
files; more smaller functions in smaller modules under concern directories)
_feels_ right to me, especially since I do not know of any "official" guidance
on this.

Regardless, on your next Elm project, give generating a graph for it a try for
some easy-to-digest information about its dependencies!

[elm-module-graph]: https://github.com/justinmimbs/elm-module-graph
[God object]: https://en.wikipedia.org/wiki/God_object
[Paul's repo]: https://github.com/paulfioravanti/phoenix-and-elm
[Paul's repo rest-refactor]: https://github.com/paulfioravanti/phoenix-and-elm/tree/rest-refactor
[Migrating a Phoenix and Elm app from REST to GraphQL]: https://paulfioravanti.com/blog/migrating-a-phoenix-and-elm-app-from-rest-to-graphql/
[Phoenix and Elm, a real use case]: http://codeloveandboards.com/blog/2017/02/02/phoenix-and-elm-a-real-use-case-pt-1/
[Python]: https://www.python.org/downloads/
[REST branch default modules]: /assets/images/2018-03-17/REST-branch-default-modules.png "REST branch default modules"
[REST branch Messages post-refactor]: /assets/images/2018-03-17/REST-branch-Messages-post-refactor.png "REST branch Messages post-refactor"
[REST branch Messages pre-refactor]: /assets/images/2018-03-17/REST-branch-Messages-pre-refactor.png "REST branch Messages pre-refactor"
[REST branch Messages Contact refactored]: /assets/images/2018-03-17/REST-branch-Messages-Contact-refactored.png "REST branch Messages Contact refactored"
[REST branch only project modules]: /assets/images/2018-03-17/REST-branch-only-project-modules.png "REST branch only project modules"
[Ricardo García Vega]: https://twitter.com/bigardone
[Ricardo's repo]: https://github.com/bigardone/phoenix-and-elm
