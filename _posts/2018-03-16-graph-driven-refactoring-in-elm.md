---
layout: post
title:  "Graph-driven Refactoring in Elm"
date:   2018-03-16 16:00 +1100
categories: elm refactoring
comments: true
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

So, I thought it would be a good idea to break out code in big Elm files into
individual files located under conceptual concerns directories. For example, I
extracted application code that looked like it was mostly concerned with a
`Contact` out into a structure like this:

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
others, but there was no way I could really tell if this was _actually_ any
good, or if there would be any issues, performance or otherwise, related to
coding Elm in this way.

## Graphing Dependencies

Until, that is, I was introduced to [elm-module-graph][], which enables you to
visually explore package and module dependencies in an Elm project. It helped
me understand that:

- My code was not really properly separated out into the concerns I thought it
  was
- I had the Elm equivalent of a [God object][]-in-the-making: a module
  that too many _other_ modules had knowledge about. These modules, given enough
  other modules that have it as a dependency, can lead to longer Elm compile
  times every time you make a change

### Create Graph File

Here is how I generated the needed `module-graph.json` for the
[Address Book app][Paul's repo] app (adapt them as needed for your own project,
and make sure you have [Python][] installed):

```sh
cd assets/elm
wget https://raw.githubusercontent.com/justinmimbs/elm-module-graph/master/elm-module-graph.py
chmod 744 elm-module-graph.py
./elm-module-graph.py src/Main.elm
```

### Display Graph

Next, navigate to <https://justinmimbs.github.io/elm-module-graph/> and upload
the generated `module-graph.json` file, and you will see something like this:

![REST branch default modules](/assets/images/REST-branch-default-modules.png){:
class="img-responsive"
}

The default graph display includes modules from external libraries, so let's
hide them (by toggling the display of the external packages at the top) so that
we can focus on the application code:

![REST branch only project modules](/assets/images/REST-branch-only-project-modules.png){:
class="img-responsive"
}

## Find Long Bars

If a module has a long bar with attached lines in the graph, that means that it
is imported by many modules. Here, it is clear that the `Messages` module,
displayed right in the middle of the graph, has the longest bar, so let's take
a clearer look at its dependencies by clicking on it:

![REST branch Messages pre-refactor](/assets/images/REST-branch-Messages-pre-refactor.png){:
class="img-responsive"
}

- The modules in <span style="color: red">red</span> are the modules that
  `Messages` imports into itself. These are not the relationships we need to
  worry about.
- The modules in <span style="color: blue">blue</span> are the modules that
  import `Messages` into themselves. Here, we can see that a great many "child"
  modules like `Contact.Update`, have knowledge about `Messages`, but
  `Contact.Update` should _really_ only know about the type of message it deals
  with directly, the `ContactMsg`, and leave knowledge about (and handling of)
  `Msg` type messages to the `Messages` module.

We have some leaking of encapsulation within the concerns, so, let's see what
can be done to fix them, with the initial goal of not having any modules under
the `Contact` concern import the `Messages` module. The starting point for this
refactor will be the [`rest` branch of the Address App][Paul's repo], so if
you're following along at home, clone the repo and let's get refactoring!

## Initial Preparation

Currently, the `RemoteData` type is contained in the top-level `Model` module.
Since `Contact` concern modules needs to know about `RemoteData`, but not
`Model` (it should only need to know about `Contact.Model`), let's remove
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

Then, the Elm compiler should let you about which modules you need to change
`RemoteData` reference to this new one, but most of the work will consist of
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


## Hide Model from Contact.Update

Currently, in `Update`, we're passing the whole `Model` off to `Contact.Update`
when we receive a `ContactMsg`, and `Contact.Update.update` is returning back a
`(Model, Cmd Msg)`. However, `Contact.Update` should only be concerned with
returning a new `Contact`: it does not need to know about the rest of the
`Model`.  Also, `Contact.Update` should only know how to return messages of its
own type: `ContactMsg`. So, we want:

- `Contact.Update.update` to return back a `(Contact, Cmd ContactMsg)`
- Have the `Update` module update the model with the new `Contact`
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
change it so that it returns that `(Contact, Cmd ContactMsg)` that `Update` now
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
`Cmd Msg` type, so what we want to do is have it instead return
`Cmd ContactMsg`, and have the caller of the function (in this case the
`urlUpdate` function in the top-level `Update` module) be responsible for
`Cmd.map`ping the `ContactMsg` to a `Msg`. So, this is what we currently have:

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

## Next heading

Finally, `Contact.View` needs our attention.




[elm-module-graph]: https://github.com/justinmimbs/elm-module-graph
[God object]: https://en.wikipedia.org/wiki/God_object
[Paul's repo]: https://github.com/paulfioravanti/phoenix-and-elm
[Migrating a Phoenix and Elm app from REST to GraphQL]: https://paulfioravanti.com/blog/2018/03/06/migrating-a-phoenix-and-elm-app-from-rest-to-graphql/
[Phoenix and Elm, a real use case]: http://codeloveandboards.com/blog/2017/02/02/phoenix-and-elm-a-real-use-case-pt-1/
[Python]: https://www.python.org/downloads/
[Ricardo García Vega]: https://twitter.com/bigardone
[Ricardo's repo]: https://github.com/bigardone/phoenix-and-elm
