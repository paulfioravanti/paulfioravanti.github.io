---
layout: post
title:  "Migrating a Phoenix and Elm app from REST to GraphQL"
date:   2018-03-07 09:10 +1100
categories: elixir phoenix elm rest graphql api
comments: true
---

[GraphQL][] enables consumers of an [API][] to ask for the exact data they
want from it. This is as opposed to [REST][], where the API provider dictates
what and how data will be served, and it is up to the consumer to make sense of
whatever data it receives.

In an app that uses [Phoenix][] for the back end and [Elm][] for the front end,
the flow of data via APIs for a query will usually take the form of:

- Elm requests Phoenix for data via an API call
- Phoenix provides the requested data via a [JSON][] response
- Elm decodes the data from the response and displays it

This blog post will cover migrating the APIs of an existing Phoenix/Elm from
using REST to using GraphQL, including:

- Adding [GraphQL schemas and types][] to the Phoenix back end
- Migrating from Phoenix controllers to [resolvers][GraphQL resolvers]
- Migrating Elm-side JSON response decoding from using [`JSON.Decode`][] to
  [`ValueSpec`][] from the [`elm-graphql`] Elm package.
- Translating GraphQL requests created in [GraphiQL][] into Elm code, and
  sending them to Phoenix

## Starting Point

The app that we are going to use as a baseline to migrate from REST to GraphQL
is an Address Book app that was originally created by [Ricardo García Vega][]
over a [series of blog posts][Phoenix and Elm, a real use case]
([Ricardo's Github repo][Ricardo's repo]).

![Address Book contacts](/assets/images/address-book-contacts-index.png){:
class="img-responsive"
}

I learned a lot from coding up the app while reading those posts, and I thank
Ricardo sincerely for putting the time into his write-ups! Afterwards, I
upgraded the app to Phoenix 1.3, played around with the codebase, and put
my version of it in its own Github repository, so it is this version of the app
that we will use. If you are following along at home, please clone
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

The two main models in the Elm app are [`Contact`][Contact Elm Model] and
[`ContactList`][ContactList Elm Model], and code related to how to fetch
information to fill the [records][Elm records] of these models is kept in
`Commands` files under directories named after the model itself.

#### Contact via REST

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
sent to the Elm Runtime, with a `Msg` type of `ContactMsg FetchContact`, telling
it to send a request to the `apiUrl` (looking something like
`api/v1/contacts/5`), and decode the response using `Contact.Decoder`.

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
import Messages exposing (Msg(ContactMsg, ContactListMsg, NavigateTo, ...))
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

> See [this blog post about "The Translator Pattern" in Elm][Translator
Pattern blog] for more information about this style of message passing.

#### Contact List via REST

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
                ++ "?search="
                ++ search
                ++ "&page="
                ++ (toString page)
    in
        Decoder.decoder
            |> Http.get apiUrl
            |> Http.send FetchContactList
            |> Cmd.map ContactListMsg
```

Fetching a list of contacts looks very similar to fetching a single contact
from an API callout point of view, except that we are now providing `page`
and `search` parameters, resulting in an `apiUrl` that looks something like
`api/v1/contacts?search=paul&page=2`.

Just like with the contact API call, we decode the response, this time using the
`ContactList.Decoder`, and then send a `Cmd` with a `Msg` of type
`ContactListMsg FetchContactList`, which will then be handled in the
`ContactList.Update.update` function.

The `ContactList.Decoder` itself delegates its `Contact`-decoding logic to
`Contact.Decoder`, defining only fields related to data about a paginated list
of records:

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
`"entries"` is due to the Phoenix app using [Scrivener.Ecto][] for pagination.
Paginated contact lists are provided in a [`Scrivener.Page`][] struct, that
contains the list of items its paginating under an `:entries` map key.

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

[Absinthe][] is the go-to toolkit for using GraphQL in Elixir, with its authors
pretty much [writing the book][Absinthe PragProg Book] on the subject, hence we
will be use it in this project. So, open up `mix.exs`, and add the following
libraries:

**`mix.exs`**

```elixir
defmodule PhoenixAndElm.Mixfile do
  # ...
  defp deps do
    [
      # ...
      {:absinthe, "~> 1.4"},
      {:absinthe_plug, "~> 1.4"}
    ]
  end
end
```

> Note that even though this is a Phoenix app, for this example we will not need
the [Absinthe.Phoenix][] package since we will be sending messages via HTTP,
and not via [Phoenix channels][]/websockets.

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
a `list_of(:contact)` (Scrivener can, of course, paginate other types of
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

**`lib/phoenix_and_elm_web/resolvers/contact_resolver.ex`**

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

This resolver looks suspiciously like the original REST `ContactController`, and
this is mainly thanks to having the `AddressBook` context hide away all of the
complexity around preparing contact data sets for delivery to the front end.
Handy!

One extra tiny change that needs to happen before we move on: did you notice
in the `get_contact()` function that the map that comes through as the `args`
parameter has atoms for keys, as opposed to the `ContactController`, where the
keys are strings? We're handling that fine in the `get_contact` function, but in
`list_contacts()`, we're passing `args` straight through to
`AddressBook.list_contacts()`, which is expecting a map with string keys, so we
will have to update it to expect one with atom keys:

**`lib/phoenix_and_elm/address_book/address_book.ex`**

```elixir
defmodule PhoenixAndElm.AddressBook do
  # ...
  def list_contacts(%{search: query} = params) do
    # ...
  end
end
```

This small change is the only time we should have to climb over the
`AddressBook` context wall.

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
to get them translated into Elm code! (At this point, now that the migration
from controllers to resolvers is complete, it is safe to delete
`ContactController` from the app.)

## Migrate Front End to GraphQL

Before we start, we will need a GraphQL package for Elm, and for this project,
we will use [`elm-graphql`][]. Let's install it directly in the Elm app:

```sh
cd assets/elm
elm-package install jamesmacaulay/elm-graphql
```

Now, since the Phoenix-side API URL has changed, the first thing we need to do
is make our easiest edit, and tell Elm the new location to send requests to:

**`assets/elm/src/Commands.elm`**

```elm
module Commands exposing (apiUrl)


apiUrl : String
apiUrl =
    "/api"
```

### Contact via GraphQL

Now, let's begin the process of getting the display of a single contact working
again, starting with changing `Contact.Commands` to use GraphQL when sending
requests:

**`assets/elm/src/Contact/Commands.elm`**

```elm
module Contact.Commands exposing (fetchContact)

import Commands exposing (apiUrl)
import Contact.Messages exposing (ContactMsg(FetchContact))
import Contact.Request as Request
import GraphQL.Client.Http as Http
import Messages exposing (Msg(ContactMsg))
import Task exposing (Task)


fetchContact : Int -> Cmd Msg
fetchContact id =
    id
        |> Request.fetchContact
        |> Http.sendQuery apiUrl
        |> Task.attempt FetchContact
        |> Cmd.map ContactMsg
```

Once we've built the GraphQL request to fetch a contact (whose
`Contact.Request` module we will create next), we:

- use [`GraphQL.Client.Http.sendQuery`][] to create a `Task` to send the query
  off to the `apiUrl`
- ask the Elm runtime to `attempt` to run that `Task`
- send a `Msg` of type `ContactMsg FetchContact`, which gets handled just like
  before in `Contact.Update` (no changes needed to that file)

Now, let's create that `Contact.Request` module to replace the
`Contact.Decoder`.  Unlike in GraphiQL, we cannot use raw GraphQL queries in
Elm-land, so we will have to port the content of the query to Elm (but let's
keep the GraphQL query that we want generated as a comment, just so we can keep
our bearings):

**`assets/elm/src/Contact/Request.elm`**

```elm
module Contact.Request exposing (fetchContact, contactSpec)

import Contact.Model exposing (Contact)
import GraphQL.Request.Builder as Builder
    exposing
        ( Document
        , NonNull
        , ObjectType
        , Query
        , Request
        , ValueSpec
        , field
        , int
        , object
        , string
        , with
        )
import GraphQL.Request.Builder.Arg as Arg
import GraphQL.Request.Builder.Variable as Var


{-|
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
-}
fetchContact : Int -> Request Query Contact
fetchContact id =
    let
        contactID =
            Arg.variable (Var.required "contactID" .contactID Var.int)

        contactField =
            Builder.extract
                (field
                    "contact"
                    [ ( "id", contactID ) ]
                    contactSpec
                )

        params =
            { contactID = id }
    in
        contactField
            |> Builder.queryDocument
            |> Builder.request params


contactSpec : ValueSpec NonNull ObjectType Contact vars
contactSpec =
    Contact
        |> object
        |> with (field "id" [] int)
        |> with (field "firstName" [] string)
        |> with (field "lastName" [] string)
        |> with (field "gender" [] int)
        |> with (field "birthDate" [] string)
        |> with (field "location" [] string)
        |> with (field "phoneNumber" [] string)
        |> with (field "email" [] string)
        |> with (field "headline" [] string)
        |> with (field "picture" [] string)
```

The content of the `contactSpec` function pretty much lines up logically with
the code that we have in `Contact.Decoder`, while `fetchContact`:

- builds the query step by step with the `let` expressions
- creates a `GraphQL.Request.Builder.Document` for the query
- creates a `GraphQL.Request.Builder.Request` from the `Document` that gets
  sent to the `apiUrl` in `Contact.Commands`

One final small change is to make sure that the `Contact.Messages` file,
which has been referencing the [`Http`][] library, now needs to reference
[`GraphQL.Client.Http`][] instead:

**`assets/elm/src/Contact/Messages.elm`**

```elm
module Contact.Messages exposing (ContactMsg(..))

import Contact.Model exposing (Contact)
import GraphQL.Client.Http as Http


type ContactMsg
    = FetchContact (Result Http.Error Contact)
```

At this point, individual contact detail pages should be displaying, so navigate
to the URL of a known contact (eg <http://localhost:4000/contacts/4>), and you
should see a page that looks something like:

![Address Book contact](/assets/images/address-book-contact-show.png){:
class="img-responsive"
}

The sample data in the app is generated randomly, so the contact you see from
the URL above will most likely be different, but, it works! Performing a search,
or navigating to the root page of the app, or doing anything that results in
displaying a list of contacts will _not_ work just yet, though, so let's polish
that task off and finish up this migration.

### Contact List via GraphQL

This process will look (and be) very similar to how we migrated the contacts,
so let's briskly get through how the files will change:

**`assets/elm/src/ContactList/Commands.elm`**

```elm
module ContactList.Commands exposing (fetchContactList)

import Commands exposing (apiUrl)
import ContactList.Messages exposing (ContactListMsg(FetchContactList))
import ContactList.Request as Request
import GraphQL.Client.Http as Http
import Messages exposing (Msg(ContactListMsg))
import Task exposing (Task)


fetchContactList : Int -> String -> Cmd Msg
fetchContactList pageNumber search =
    search
        |> Request.fetchContactList pageNumber
        |> Http.sendQuery apiUrl
        |> Task.attempt FetchContactList
        |> Cmd.map ContactListMsg
```

**`assets/elm/src/ContactList/Messages.elm`**

```elm
module ContactList.Messages exposing (ContactListMsg(..))

import ContactList.Model exposing (ContactList)
import GraphQL.Client.Http as Http


type ContactListMsg
    = FetchContactList (Result Http.Error ContactList)
    | Paginate Int
    | ResetSearch
    | SearchContacts
```

**`assets/elm/src/ContactList/Request.elm`**

```elm
module ContactList.Request exposing (fetchContactList)

import Contact.Request
import ContactList.Model exposing (ContactList)
import GraphQL.Request.Builder as Builder
    exposing
        ( NonNull
        , ObjectType
        , Query
        , Request
        , ValueSpec
        , field
        , int
        , list
        , object
        , with
        )
import GraphQL.Request.Builder.Arg as Arg
import GraphQL.Request.Builder.Variable as Var


{-|
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
-}
fetchContactList : Int -> String -> Request Query ContactList
fetchContactList page search =
    let
        searchQuery =
            Arg.variable (Var.required "searchQuery" .searchQuery Var.string)

        pageNumber =
            Arg.variable (Var.required "pageNumber" .pageNumber Var.int)

        contactsField =
            Builder.extract
                (field
                    "contacts"
                    [ ( "search", searchQuery ), ( "page", pageNumber ) ]
                    contactListSpec
                )

        params =
            { searchQuery = search
            , pageNumber = page
            }
    in
        contactsField
            |> Builder.queryDocument
            |> Builder.request params


contactListSpec : ValueSpec NonNull ObjectType ContactList vars
contactListSpec =
    let
        contact =
            Contact.Request.contactSpec
    in
        ContactList
            |> object
            |> with (field "entries" [] (list contact))
            |> with (field "pageNumber" [] int)
            |> with (field "totalEntries" [] int)
            |> with (field "totalPages" [] int)
```

Pretty similar set of changes, right?  The only real differences are the number
of parameters for the query, and the `contactSpec` nesting inside
`contactListSpec`, which is in a similar vein to the nesting of the
`Contact.Decoder` inside a `ContactList.Decoder`.

Now, you should be able to view any page in the app that displays a list of
contacts. The GraphQL migration is complete, and you can safely remove the
`Decoder` files from the application.

> Any issues getting things to work? Have a look at the
[`graphql` branch][Paul's repo graphql branch] and see if there are any
differences from your code.

## Wrapping Up

There is so much more to GraphQL than what I've managed to fit into this
admittedly long blog post. We only dealt with queries, and did not even touch
other GraphQL fundamentals like [mutations][GraphQL mutations], which cover
modifying server-side data (though take a look at the
[Elm hipster stack repo][] for some good examples of that).

However, I hope that you enjoyed this small taste of Phoenix, Elm, and GraphQL
working together, and if you join me in making further inroads with this fully
functional tech
stack moving forward, I would love to hear about it!

[Absinthe]: https://github.com/absinthe-graphql/absinthe
[Absinthe.Phoenix]: https://github.com/absinthe-graphql/absinthe_phoenix
[Absinthe PragProg Book]: https://pragprog.com/book/wwgraphql/craft-graphql-apis-in-elixir-with-absinthe
[API]: https://en.wikipedia.org/wiki/Application_programming_interface
[Contact Database Schema]: https://github.com/paulfioravanti/phoenix-and-elm/blob/graphql/lib/phoenix_and_elm/address_book/contact.ex#L26
[Contact Elm Model]: https://github.com/paulfioravanti/phoenix-and-elm/blob/rest/assets/elm/src/Contact/Model.elm
[ContactList Elm Model]: https://github.com/paulfioravanti/phoenix-and-elm/blob/rest/assets/elm/src/ContactList/Model.elm
[Elm]: http://elm-lang.org/
[`elm-graphql`]: https://github.com/jamesmacaulay/elm-graphql
[Elm hipster stack repo]: https://github.com/carleryd/elm-hipster-stack
[Elm records]: http://elm-lang.org/docs/records
[GraphiQL]: https://github.com/graphql/graphiql
[GraphQL]: http://graphql.org/
[`GraphQL.Client.Http`]: http://package.elm-lang.org/packages/jamesmacaulay/elm-graphql/1.8.0/GraphQL-Client-Http
[`GraphQL.Client.Http.sendQuery`]: http://package.elm-lang.org/packages/jamesmacaulay/elm-graphql/1.8.0/GraphQL-Client-Http#sendQuery
[GraphQL mutations]: http://graphql.org/learn/queries/#mutations
[GraphQL resolvers]: http://graphql.org/learn/execution/#root-fields-resolvers
[GraphQL schemas and types]: http://graphql.org/learn/schema/
[GraphQL types and fields]: http://graphql.org/learn/schema/#object-types-and-fields
[`Http`]: https://github.com/elm-lang/http
[JSON]: https://www.json.org/
[`JSON.Decode`]: http://package.elm-lang.org/packages/elm-lang/core/5.1.1/Json-Decode
[Navigation package]: https://github.com/elm-lang/navigation
[Paul's repo]: https://github.com/paulfioravanti/phoenix-and-elm
[Paul's repo graphql branch]: https://github.com/paulfioravanti/phoenix-and-elm/tree/graphql
[Phoenix]: http://phoenixframework.org/
[Phoenix and Elm, a real use case]: http://codeloveandboards.com/blog/2017/02/02/phoenix-and-elm-a-real-use-case-pt-1/
[Phoenix channels]: https://hexdocs.pm/phoenix/channels.html
[Phoenix context]: https://hexdocs.pm/phoenix/contexts.html
[REST]: https://en.wikipedia.org/wiki/Representational_state_transfer
[Ricardo García Vega]: https://twitter.com/bigardone
[Ricardo's repo]: https://github.com/bigardone/phoenix-and-elm
[Scrivener.Ecto]: https://github.com/drewolson/scrivener_ecto
[`Scrivener.Page`]: https://github.com/drewolson/scrivener/blob/master/lib/scrivener/page.ex
[Translator Pattern blog]: https://medium.com/@alex.lew/the-translator-pattern-a-model-for-child-to-parent-communication-in-elm-f4bfaa1d3f98
[`ValueSpec`]: http://package.elm-lang.org/packages/jamesmacaulay/elm-graphql/1.8.0/GraphQL-Request-Builder#ValueSpec
