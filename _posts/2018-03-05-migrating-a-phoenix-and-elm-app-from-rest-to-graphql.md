---
layout: post
title:  "Migrating a Phoenix and Elm app from REST to GraphQL"
date:   2018-03-05 09:55 +1100
categories: elixir phoenix elm rest graphql api
comments: true
---

[GraphQL][] enables consumers of an [API][] to ask for the exact data they
want from it, as opposed to [REST][], where the API provider dictates what data
will be served, and it is up to the consumer to make sense of whatever data it
receives, and in what form it is received in.

In an app that uses [Phoenix][] for the back end and [Elm][] for the front end,
the flow of data via APIs for a query will usually take the form of:

- Elm requests Phoenix for data via an API call
- Phoenix provides the requested data via a [JSON][] response
- Elm decodes the data from the response and displays it

This blog post will cover migrating the APIs of an existing Phoenix/Elm from
using REST to using GraphQL, including:

- Adding [GraphQL schemas and types][] to the Phoenix back end
- Migrating from Phoenix controllers to [resolvers][GraphQL resolvers]
- Migrating Elm-side JSON response decoding from [`JSON.Decode`][] to
  [`ValueSpec`][] from the [`elm-graphql`] Elm package.
- Translating GraphQL requests created in [GraphiQL][] into Elm code, and
  sending them to Phoenix

## Starting Point

The app that we are going to use as a baseline to migrate from REST to GraphQL
is an Address Book app that was originally created by [Ricardo García Vega][]
over a [series of blog posts][Phoenix and Elm, a real use case]
([Ricardo's Github repo][Ricardo's repo]).

![Address Book App](/assets/images/address-book-contacts-index.png){:
class="img-responsive"
}

I learned a lot from coding up the app while reading those posts, and I thank
Ricardo sincerely for putting the time into his write-ups! Afterwards, I
upgraded the app to Phoenix 1.3, played around with the codebase, and put
my version of it in its own Github repository, so it is this version of the app
that we will use. So, if you are following along at home, please clone
[my repo][Paul's repo] and follow the `README` instructions to get up and
running, or you can skip straight to the finished product, which is in the
repo's [`graphql` branch][Paul's repo graphql branch].

## Current State of Play

Before jumping into migrating to GraphQL, let's take a look at some of the
application's current structure and see how communication is done via REST
requests.

### Back End

First, let's have a look at the router:

**`lib/phoenix_and_elm_web/router.ex`**

```elixir
defmodule PhoenixAndElmWeb.Router do
  # ...
  scope "/api", PhoenixAndElmWeb do
    pipe_through :api

    scope "/v1", V1 do
      resources "/contacts", ContactController, only: [:index, :show]
    end
  end

  scope "/", PhoenixAndElmWeb do
    pipe_through :browser

    get "/*path", AddressBookController, :index
  end
end
```

In this app, `AddressBook` is the [Phoenix context][] behind which `Contact`s
live. So, the `AddressBookController`'s purpose is solely to render the HTML
tag where the Elm app will be embedded:

**`lib/phoenix_and_elm_web/templates/address_book/index.html.eex`**

```html
<div id="elm-main"></div>
```

Once the Elm app is embedded, it can make calls out to the versioned (`/v1`)
contact APIs to fetch contact information, which will be handled by the
`ContactController`:

**`lib/phoenix_and_elm_web/controllers/v1/contact_controller.ex`**

```elixir
defmodule PhoenixAndElmWeb.V1.ContactController do
  use PhoenixAndElmWeb, :controller
  alias PhoenixAndElm.AddressBook

  def index(conn, params) do
    contacts = AddressBook.list_contacts(params)
    json(conn, contacts)
  end

  def show(conn, %{"id" => id}) do
    contact = AddressBook.get_contact!(id)
    json(conn, contact)
  end
end
```

There are two APIs that Phoenix provides: listing contacts and showing
(retrieving) information for a contact. Each function talks only to the
`AddressBook` context, leaving the responsibility of determining _how_ the
information requested is provided up to the Address Book "sub-system": as far as
the controller functions are concerned, they provide some parameter to an
`AddressBook` function, and get returned some value which they then serialize
into JSON. So, this controller is effectively our REST boundary, and it is these
few lines of functionality that will need to be replicated when migrating over
to GraphQL.

### Front End

The contact API URL (`api/v1/contacts`), that maps to the `ContactController` in
the Phoenix app, is defined in a common `Commands.elm` file so that it can be
easily shared between the different API calls coming from Elm:

**`assets/elm/src/Commands.elm`**

```elm
module Commands exposing (contactsApiUrl)


contactsApiUrl : String
contactsApiUrl =
    "/api/v1/contacts"
```

The two main models in the Elm app are `Contact` and `ContactList`, and code
related to how to fetch information to fill the [records][Elm records] of these
models is kept in `Commands` files under directories named after the model
itself.

#### Contact

Let's see how information for a single contact is retrieved:

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

When `Contact.Commands.fetchContact` is called within the Elm app, a `Cmd` is
sent to the Elm Runtime telling it to send a request to the `apiUrl` (looking
something like `api/v1/contacts/5`), then decode the response using the
`Contact.Decoder`, and send a `Msg` of type `ContactMsg FetchContact`.

The decoder used for a `Contact` looks like the following:

**`assets/elm/src/Contact/Decoder.elm`**

```elm
module Contact.Decoder exposing (decoder)

import Contact.Model exposing (Contact)
import Json.Decode as Decode exposing (field, int, string)
import Json.Decode.Extra exposing ((|:))


decoder : Decode.Decoder Contact
decoder =
    Decode.succeed
        Contact
        |: (field "id" int)
        |: (field "first_name" string)
        |: (field "last_name" string)
        |: (field "gender" int)
        |: (field "birth_date" string)
        |: (field "location" string)
        |: (field "phone_number" string)
        |: (field "email" string)
        |: (field "headline" string)
        |: (field "picture" string)
```

The `ContactMsg FetchContact` message gets handled in `Contact.Update`, which
updates the `Contact` model record:

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

The use of `Cmd.map ContactMsg` in `Contact.Commands` is what enables the
`FetchContact` message to be handled in a "child" `update` function (in this
case `Contact.Update` is considered a child of `Update`), which can help reduce
the size of the "parent" `update` function:

```elm
module Update exposing (update, urlUpdate)

import Contact.Update
import Messages exposing ( Msg ( ContactMsg, ContactListMsg, NavigateTo, ...))
import Model exposing (Model, RemoteData(NotRequested, Requesting))
-- ...


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ContactMsg msg ->
            Contact.Update.update msg model

        ContactListMsg msg ->
            ContactList.Update.update msg model

        UpdateSearchQuery value ->
            ( { model | search = value }, Cmd.none )

        -- ...
-- ...
```

Here, in the "parent" `update` function, there are messages that are handled
directly, like `UpdateSearchQuery`, while messages that are wrapped in a
`ContactMsg` message, for example, are delegated straight off to the
`Contact.Update.update` function.

See [this blog post about "The Translator Pattern" in Elm][Translator
Pattern blog] for more information about this style of message passing.

#### Contact List

Now that we know about fetching a single contact to populate a `Contact` record,
what about fetching a list of contacts to populate a `ContactList` record?

**`assets/elm/src/ContactList/Commands.elm`**

```elm
module ContactList.Commands exposing (fetchContactList)

import Commands exposing (contactsApiUrl)
import ContactList.Messages exposing (ContactListMsg(FetchContactList))
import ContactList.Decoder as Decoder
import Http
import Messages exposing (Msg(ContactListMsg))


fetchContactList : Int -> String -> Cmd Msg
fetchContactList page search =
    let
        apiUrl =
            contactsApiUrl
                ++ "?page="
                ++ (toString page)
                ++ "&search="
                ++ search
    in
        Decoder.decoder
            |> Http.get apiUrl
            |> Http.send FetchContactList
            |> Cmd.map ContactListMsg
```

Fetching a list of contacts looks very similar to fetching a single contact
from an API callout point of view, except that we are now providing `page`
and `search` parameters, resulting in an `apiUrl` that looks something like
`api/v1/contacts?page=2&search=paul`.

Just like with the contact API call, we decode the response, this time using the
`ContactList.Decoder`, and then send a `Msg` of type
`ContactListMsg FetchContactList`, which will then be handled in the
`ContactList.Update.update` function.

The `ContactList.Decoder` itself delegates most of its logic to
`Contact.Decoder`, defining only fields related to data about a paginated list
of records.

**`assets/elm/src/ContactList/Decoder.elm`**

```elm
module ContactList.Decoder exposing (decoder)

import Contact.Decoder
import ContactList.Model exposing (ContactList)
import Json.Decode as Decode exposing (field, int, list)
import Json.Decode.Extra exposing ((|:))


decoder : Decode.Decoder ContactList
decoder =
    let
        contact =
            Contact.Decoder.decoder
    in
        Decode.succeed
            ContactList
            |: (field "entries" (list contact))
            |: (field "page_number" int)
            |: (field "total_entries" int)
            |: (field "total_pages" int)
```

The reason that the `field` for a list of contacts is specifically named
`"entries"` is due to the Phoenix app using [Scrivener.Ecto][] for pagination,
which returns a [`Scrivener.Page`][] struct that contains the list of items
its paginating under an `:entries` map key.

And I think that about covers the request/response handling code on the front
end. So, it looks like we will need to:

- Change the URL in `Commands.elm` to reference a different GraphQL endpoint URL
- Switch out the `Http` package for a GraphQL client package
- Remove decoders, and replace with GraphQL request builders

## Migrate Back End to GraphQL

Phew, that is a fair bit to take in for what is a tour of only one conceptual
part of a toy app, but at least now we have an idea of the API-related
parts of the app that are targets for change in both the front and back ends.

So, without further ado, let's tackle migration of the back end first.

### Absinthe

[Absinthe][] is pretty much the go-to toolkit for using GraphQL in Elixir, with
its authors pretty much [writing the book][Absinthe PragProg Book] on the
subject, hence we will be use it for this project. So, open up `mix.exs`, and
add the following libraries to get it installed for Phoenix:

**`mix.exs`**

```elixir
defmodule PhoenixAndElm.Mixfile do
  # ...
  defp deps do
    [
      # ...
      {:absinthe, "~> 1.4.2"},
      {:absinthe_plug, "~> 1.4.0"},
      {:absinthe_phoenix, "~> 1.4.0"},
      {:absinthe_relay, "~> 1.4.0"}
    ]
  end
end
```

### Types

Once you have run `mix deps.get`, create a new `lib/phoenix_and_elm_web/schema/`
directory and let's create some GraphQL types to describe the data we want to
query:

**`lib/phoenix_and_elm_web/schema/types.ex`**

```elixir
defmodule PhoenixAndElmWeb.Schema.Types do
  use Absinthe.Schema.Notation
  import_types(Absinthe.Type.Custom)

  object :contact_list do
    field(:total_entries, :integer)
    field(:total_pages, :integer)
    field(:page_number, :integer)
    field(:page_size, :integer)
    field(:entries, list_of(:contact))
  end

  object :contact do
    field(:id, :integer)
    field(:first_name, :string)
    field(:last_name, :string)
    field(:gender, :integer)
    field(:birth_date, :date)
    field(:location, :string)
    field(:phone_number, :string)
    field(:email, :string)
    field(:headline, :string)
    field(:picture, :string)
  end
end
```

The `:contact` `object` almost directly mirrors
[the contact database schema][Contact Database Schema], with the one small
caveat here being that the GraphQL specification does not provide a `:date` type
for the `:birth_date` field, so the `Absinthe.Type.Custom` module provides one
that we can use.

The `:contact_list` `object` essentially describes a [`Scrivener.Page`][],
though for simplicity's sake, we are limiting `entries` to only containing
a `list_of(:contact)` (Scrivener can, of course, paginate more types of
things!).

### Schema

Now, we need the schema itself to describe the queries we will allow into the
Phoenix app, what arguments each query takes, and what execution should happen
for each valid query (done here in the form of resolvers).

**`lib/phoenix_and_elm_web/schema/schema.ex`**

```elixir
defmodule PhoenixAndElmWeb.Schema do
  use Absinthe.Schema
  alias PhoenixAndElmWeb.ContactResolver
  import_types(PhoenixAndElmWeb.Schema.Types)

  query do
    field :contacts, type: :contact_list do
      arg(:search, non_null(:string))
      arg(:page, non_null(:integer))
      resolve(&ContactResolver.list_contacts/3)
    end

    field :contact, type: :contact do
      arg(:id, non_null(:id))
      resolve(&ContactResolver.get_contact/3)
    end
  end
end
```

### Resolvers

Resolvers can tend to get quite long, so it is considered good practice to put
them into their own top level directory under the web app, so let's do that
and create a `ContactResolver`:

```elixir
defmodule PhoenixAndElmWeb.ContactResolver do
  alias PhoenixAndElm.AddressBook

  def list_contacts(_parent, args, _resolution) do
    contacts = AddressBook.list_contacts(args)
    {:ok, contacts}
  end

  def get_contact(_parent, %{id: id}, _resolution) do
    contact = AddressBook.get_contact!(id)
    {:ok, contact}
  end
end
```

This resolver look suspiciously like the original REST `ContactController`, and
this is mainly thanks to having the `AddressBook` context hide away all of the
complexity around preparing contact data sets for delivery to the front end.
Handy!

### Router

Finally, let's expose our new GraphQL API to the world by changing the router
to send `/api` requests to the new schema, and `/api/graphiql` requests to
GraphiQL.

**`lib/phoenix_and_elm_web/router.ex`**

```elixir
defmodule PhoenixAndElmWeb.Router do
  # ...
  scope "/api" do
    pipe_through :api

    forward "/graphiql", Absinthe.Plug.GraphiQL,
      schema: PhoenixAndElmWeb.Schema,
      interface: :simple

    forward "/", Absinthe.Plug, schema: PhoenixAndElmWeb.Schema
  end

  scope "/", PhoenixAndElmWeb do
    pipe_through :browser

    get "/*path", AddressBookController, :index
  end
end
```

## Testing with GraphiQL

Speaking of GraphiQL, let's use it to help us build the queries that we're going
to want to have Elm send to it. Navigating to
<http://localhost:4000/api/graphiql> will bring up the GraphiQL interface, so
let's start with a GraphQL query for a single contact.

We need a query that will take in a contact ID parameter, and will return all
the fields that we currently have defined in the `Contact.Decoder` Elm file:

```graphql
query($contactID: ID!) {
  contact(id: $contactID) {
    id
    firstName
    lastName
    gender
    birthDate
    location
    phoneNumber
    email
    headline
    picture
  }
}
```

> The exclamation mark on `ID!` means that
[the field is non-nullable][GraphQL types and fields], so you have to provide
an ID or the query will error out.

Let's now input that in GraphiQL and fire it off to the Phoenix app, along with
a `contactID` parameter:

![GraphiQL contact query](/assets/images/GraphiQL-contact-query.png){:
class="img-responsive"
}

Looks pretty good to me! Now, how about for a list of contacts?

We need a query that will take in search and page number parameters, and return
all the fields that we currently have defined in the `ContactList.Decoder` Elm
file:

```graphql
query($searchQuery: String!, $pageNumber: Int!) {
  contacts(search: $searchQuery, page: $pageNumber) {
    entries {
      id
      firstName
      lastName
      gender
      birthDate
      location
      phoneNumber
      email
      headline
      picture
    },
    pageNumber,
    totalEntries
    totalPages,
  }
}
```

And for a search query of `"Barn"`, the results are...

![GraphiQL contacts query](/assets/images/GraphiQL-contacts-query.png){:
class="img-responsive"
}

...all of the users with a first name of Barney! Great! We now know the GraphQL
queries that we want the front end to send to the back end, and now, it's time
to get them translated into Elm code!

## Migrate Front End to GraphQL


[Absinthe]: https://github.com/absinthe-graphql/absinthe
[Absinthe PragProg Book]: https://pragprog.com/book/wwgraphql/craft-graphql-apis-in-elixir-with-absinthe
[API]: https://en.wikipedia.org/wiki/Application_programming_interface
[Contact Database Schema]: https://github.com/paulfioravanti/phoenix-and-elm/blob/graphql/lib/phoenix_and_elm/address_book/contact.ex#L26
[Elm]: http://elm-lang.org/
[`elm-graphql`]: https://github.com/jamesmacaulay/elm-graphql
[Elm records]: http://elm-lang.org/docs/records
[GraphiQL]: https://github.com/graphql/graphiql
[GraphQL]: http://graphql.org/
[GraphQL resolvers]: http://graphql.org/learn/execution/#root-fields-resolvers
[GraphQL schemas and types]: http://graphql.org/learn/schema/
[GraphQL types and fields]: http://graphql.org/learn/schema/#object-types-and-fields
[JSON]: https://www.json.org/
[`JSON.Decode`]: http://package.elm-lang.org/packages/elm-lang/core/5.1.1/Json-Decode
[Navigation package]: https://github.com/elm-lang/navigation
[Paul's repo]: https://github.com/paulfioravanti/phoenix-and-elm
[Paul's repo graphql branch]: https://github.com/paulfioravanti/phoenix-and-elm/tree/graphql
[Phoenix]: http://phoenixframework.org/
[Phoenix and Elm, a real use case]: http://codeloveandboards.com/blog/2017/02/02/phoenix-and-elm-a-real-use-case-pt-1/
[Phoenix context]: https://hexdocs.pm/phoenix/contexts.html
[REST]: https://en.wikipedia.org/wiki/Representational_state_transfer
[Ricardo García Vega]: https://twitter.com/bigardone
[Ricardo's repo]: https://github.com/bigardone/phoenix-and-elm
[Scrivener.Ecto]: https://github.com/drewolson/scrivener_ecto
[`Scrivener.Page`]: https://github.com/drewolson/scrivener/blob/master/lib/scrivener/page.ex
[Translator Pattern blog]: https://medium.com/@alex.lew/the-translator-pattern-a-model-for-child-to-parent-communication-in-elm-f4bfaa1d3f98
[`ValueSpec`]: http://package.elm-lang.org/packages/jamesmacaulay/elm-graphql/1.8.0/GraphQL-Request-Builder#ValueSpec
