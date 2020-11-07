---
redirect_from:
  - /blog/2019/11/03/internationalisation-with-phoenix-liveview/
  - /blog/internationalisation-with-phoenix-liveview/
title: "Internationalisation with Phoenix LiveView"
date: 2019-11-03 00:00 +1100
last_modified_at: 2020-11-01 22:00 +1100
tags: elixir phoenix liveview i18n japanese italian 日本語 italiano
header:
  image: /assets/images/2019-11-03/nareeta-martin-vF1YCoLHMpg-unsplash.jpg
  image_description: "multicolored buntings on pathway"
  teaser: /assets/images/2019-11-03/nareeta-martin-vF1YCoLHMpg-unsplash.jpg
  overlay_image: /assets/images/2019-11-03/nareeta-martin-vF1YCoLHMpg-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Nareeta Martin](https://unsplash.com/@splashabout?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/s/photos/country-flags?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
badges:
  - image: https://img.shields.io/badge/Elixir%20Weekly-%23174-blueviolet.svg
    alt: "Elixir Weekly #174"
    link: https://elixirweekly.net/issues/174
excerpt: >
  Change your application locale without a full-page reload or having to write (much) Javascript.
---

This blog post is the first in a series on the creation of a small
[I18n][Internationalization Naming] application using [Phoenix LiveView][],
which updates page content based on the language chosen from a dropdown menu:

1. _Internationalisation with Phoenix LiveView_
2. _[Internationalisation with Phoenix LiveComponents][]_
3. _[Internationalisation with Phoenix Live Layouts][]_

{: refdef: style="text-align: center;"}
![I18n Application][]
{: refdef}

In a previous blog post, _[Runtime Language Switching in Elm][]_, I re-created
the [Tachyons][] [Full Screen Centered Title component documentation page][] in
[Elm][], and added a language dropdown menu to change the page language.

![Tachyons Elm][]

The page is deployed [here][Elm I18n Example Demo], and you can find the code
[here][Elm I18n Example], but to save a click, the animated
[GIF][GIF Pronunciation] above shows all of its use cases:

- Click on the current language, and the menu opens, showing a list of
  selectable languages
- Click the current language again, or anywhere else on the page, and the menu
  closes
- If you select a different language, the language of the page content and title
  will change, and the list of selectable languages in the dropdown menu will
  update
- Refresh the page, and you will see that your choice of language is remembered

The blog post goes through different methods I used to get internationalisation
([i18n][Internationalization naming]) working, but, in my opinion, the options
in Elm as of this writing are not quite as nice as [Elixir][]'s
[gettext][]-[based API][Elixir Gettext].

However, when I have previously implemented language switching for a standard
[Phoenix][] application, compared with frontend-only Elm, needing to make a
request back to the server to change the application locale means that a bit
more time is needed before the update is visible on screen.

Granted, changing application locale is not something a typical user would
perform very often, and so, needing a page refresh for it is probably not a pain
point for anyone. But, with the advent of [Phoenix LiveView][], I wondered
whether I would be able to exactly replicate the snappiness of the Elm
example application with Phoenix, just for fun.

And so, the rest of this post will focus on porting over/re-creating the Elm
application in Phoenix, evolving over four stages:

1. [Straight client-server](#client-server)
2. [Augmenting client-server with Javascript "sprinkles"](#javascript-sprinkles)
3. [Letting Javascript take over](#javascript-takeover)
4. [Swapping out Javascript for LiveView](#liveview)

> The software versions we will use to build out this application are:
>
> - Elixir: 1.9.2
> - Erlang: 22.0.7
> - Phoenix: 1.4.10
> - Gettext: 0.7.10
> - LiveView: 0.3.1
> - Node: 12.12.0
> - Tachyons: 4.11.1

Let's get started!

## Initial Setup

### No Ecto

Generate and install dependencies of a new Phoenix application. We will not be
using a database, so pass in the `--no-ecto` flag to make sure we do not
generate any unneeded [Ecto][] configuration:

```text
mix phx.new phx_i18n_example --no-ecto
cd phx_i18n_example
mix deps.get
```

### Gettext

Next, we will need to tell Gettext about what locales we want to use in the
application (in our case English, Italian, and Japanese), and what locale should
be the default (English). Add the following lines to your configuration:

**`config/config.exs`**

```elixir
config :phx_i18n_example, PhxI18nExampleWeb.Gettext,
  default_locale: "en",
  locales: ~w(en it ja)
```

### Tachyons

Since we will use Tachyons for styling, we have to install it and make it
available in Phoenix.

First, install it with [npm][]:

```text
npm install --save-dev tachyons@4.11.1 --prefix assets
```

Then, `import` it into Phoenix:

**`assets/js/app.js`**

```js
// ...
// import css from "../css/app.css"
// ...
import "phoenix_html"
import "tachyons"
// ...
```

Make sure you also comment out or remove the default Phoenix-generated
`import css from "../css/app.css"` line since we will not be using those default
styles, and we do not want anything in `app.css` to overwrite Tachyons styling.

## Client-Server

### Dealing with Params

For this first development step, the goal will be to go as far as we can in
building out the main use cases of the application using just Phoenix, and no
[Javascript][].  This means we will have to start using
[URL parameters][Query string] to send information to the server in order to
tell it about the desired state of the application.

For example, if we want the locale to be Japanese, we could send a
`locale` URL parameter to tell the application to switch to Japanese:

```text
http://localhost:4000/?locale=ja
```

Since we are not using Javascript, we will also have to use URL parameters to
let the application know if we want to open or close the locale dropdown menu:

```text
http://localhost:4000/?show_available_locales=true
http://localhost:4000/?show_available_locales=false
```

I think the best way for dealing with these parameters as they come in to the
application is to use a [Plug][Elixir Plug], so let's add a `LocalePlug` to our
`:browser` [pipeline][Phoenix Routing Pipelines]:

**`lib/phx_i18n_example_web/router.ex`**

```elixir
defmodule PhxI18nExampleWeb.Router do
  use PhxI18nExampleWeb, :router
  alias PhxI18nExampleWeb.LocalePlug

  pipeline :browser do
    # ...
    plug LocalePlug
  end
  # ...
end
```

We need this `LocalePlug` to do the following:

- Fetch and set the locale:
  - First, check the parameters for the locale
  - If it cannot be found in the parameters, check the browser cookies
  - If it cannot be found in the browser cookies, return the default locale
  - Update the global application locale to the retrieved locale value, but only
    if that locale value is actually different to the global application locale
- Determine the dropdown menu state:
  - If the parameters have a `show_available_locales=true` value, indicate that
    the dropdown should be open
  - If there is any other value for `show_available_locales`, including `false`,
    or if `show_available_locales` is not present in the params, the dropdown
    should display as closed
- Persist the locale in the cookies
  - If the locale value is already stored in the cookie, do nothing
  - Otherwise, if the cookie value is different from the locale value, or the
    cookie value is not present, store the locale value in the cookie

Let's see what this looks like in code:

**`lib/phx_i18n_example_web/plugs/locale_plug.ex`**

```elixir
defmodule PhxI18nExampleWeb.LocalePlug do
  alias Plug.Conn
  @behaviour Plug

  @locales Gettext.known_locales(PhxI18nExampleWeb.Gettext)
  @cookie "phxi18nexamplelanguage"
  @ten_days 10 * 24 * 60 * 60

  defguard known_locale?(locale) when locale in @locales

  @impl Plug
  def init(_opts), do: nil

  @impl Plug
  def call(conn, _opts) do
    locale = fetch_and_set_locale(conn)

    conn
    |> determine_language_dropdown_state()
    |> persist_locale(locale)
  end

  defp fetch_and_set_locale(conn) do
    case locale_from_params(conn) || locale_from_cookies(conn) do
      nil ->
        # This will fallback to the default locale set in `config.exs`
        Gettext.get_locale()

      locale ->
        # Update the global locale only if the `locale` value
        # is different to it
        if locale != Gettext.get_locale() do
          Gettext.put_locale(locale)
        end

        locale
    end
  end

  defp locale_from_params(%Conn{params: %{"locale" => locale}})
       when known_locale?(locale) do
    locale
  end

  defp locale_from_params(_conn), do: nil

  defp locale_from_cookies(%Conn{cookies: %{@cookie => locale}})
       when known_locale?(locale) do
    locale
  end

  defp locale_from_cookies(_conn), do: nil

  defp determine_language_dropdown_state(conn) do
    show_available_languages =
      case conn.params["show_available_locales"] do
        "true" ->
          true

        _ ->
          # `false`, `nil`, `blah` etc
          false
      end

    Conn.assign(conn, :show_available_locales, show_available_languages)
  end

  defp persist_locale(%Conn{cookies: %{@cookie => locale}} = conn, locale) do
    # Cookie locale is the same as the current locale, so do nothing and just
    # return the original `conn`
    conn
  end

  defp persist_locale(conn, locale) do
    Conn.put_resp_cookie(conn, @cookie, locale, max_age: @ten_days)
  end
end
```

A few notes on this Plug file:

- We are using [`Gettext.get_locale/0`][] as the source of truth for the
  application locale. It "gets the global Gettext locale for the current
  process", and since we're doing a single process client-server implementation,
  it suits our purposes. There is no need to `assign` a separate `locale` value
  in the `conn`: whenever we want the application locale, we will ask Gettext to
  provide it to us
- We are following Elixir's rule of thumb and deliberately using `||`, and not
  `or`, in `fetch_and_set_locale/1`, since the values returned on either side
  are non-boolean
- Having the cookie be valid for ten days is completely arbitrary. Feel free to
  change as you see fit

### From Route to Template

Now that we have our application state set up, our flow from here towards the
view layer is exactly as Phoenix provides out-of-the-box:

The root path gets routed to the `PageController`:

**`lib/phx_i18n_example_web/router.ex`**

```elixir
defmodule PhxI18nExampleWeb.Router do
  use PhxI18nExampleWeb, :router
  alias PhxI18nExampleWeb.LocalePlug

  pipeline :browser do
    # ...
    plug LocalePlug
  end

  # ...

  scope "/", PhxI18nExampleWeb do
    pipe_through :browser
    get "/", PageController, :index
  end
end
```

Then, the `PageController` renders the `index.html` template:

**`lib/phx_i18n_example_web/controllers/page_controller.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageController do
  use PhxI18nExampleWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
```

...which we need to change to the following code:

**`lib/phx_i18n_example_web/templates/page/index.html.eex`**

```elixir
<article class="<%= article() %>">
  <div class="<%= heading_container() %>">
    <h1 class="<%= heading() %>">
      <%= gettext("Vertically centering things in css is easy!") %>
    </h1>
  </div>
</article>
```

- The Phoenix-generated `lib/phx_i18n_example_web/gettext.ex` file enables us
  to use a `gettext` macro to search for translated strings depending on the
  Gettext locale setting. We do not have any translations at the moment, so this
  call will just return the "Vertically centering things in css is easy!" string
  itself (we will get to generating translations later)
- All the functions that you see interpolated in the various tag `class`
  attribute values exist to make it easier for us to manage sets of Tachyons
  utility classes

### Modules Specifically for Styling

Functions declared without qualified module names in templates will be attempted
to be resolved in the view that renders them, which, in `index.html.eex`'s case,
as per Phoenix convention, is the `PageView`.

Since the functions that are being referenced here will all thematically relate
to styling, and be quite verbose, I think we should put them inside their own
specific "style" modules, and have `PageView` delegate to them. This, to me at
least, makes the `PageView` explicitly say:

> "I know I am meant to respond to these functions, but their details are not my
responsibility, so please go and look in this other module"

**`lib/phx_i18n_example_web/views/page_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageView do
  use PhxI18nExampleWeb, :view
  alias PhxI18nExampleWeb.PageStyle

  defdelegate article, to: PageStyle
  defdelegate heading, to: PageStyle
  defdelegate heading_container, to: PageStyle
end
```

**`lib/phx_i18n_example_web/views/styles/page_style.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageStyle do
  @article_classes ~w[
    dt
    vh-75
    w-100
  ] |> Enum.join(" ")

  @heading_container_classes ~w[
    dtc
    ph-3 ph4-l
    tc
    v-mid
  ] |> Enum.join(" ")

  @heading_classes ~w[
    f6 f2-m f-subheadline-l
    fw6
    tc
  ] |> Enum.join(" ")

  def article, do: @article_classes
  def heading_container, do: @heading_container_classes
  def heading, do: @heading_classes
end
```

- In order to make the Tachyons mnemonics easier to manage, they are in lists
  contained in module attributes, which get joined into a single string at
  compile time
- The attributes are then wrapped in functions so they become a part of the
  module's public interface

I think this is a nicer way to deal with CSS utility classes, rather than modify
them directly in a template. But, as with any subjective opinion, your mileage
may vary.

### Page Layout

Now, every template gets rendered inside of a layout, so let's look at the main
application layout next, and mark where we will make changes from the
Phoenix-generated defaults:

**`lib/phx_i18n_example_web/templates/layout/app.html.eex`**

```elixir
<!DOCTYPE html>
<html>
  <head>
    <!-- ... -->
    <title><%= gettext("Multilingualisation in Phoenix") %></title>
    <!-- ... -->
  </head>
  <body class="<%= body() %>">
    <%= render LanguageDropdownView,
               "language_dropdown.html",
               show_available_locales: @show_available_locales %>
    <main role="main">
      <%= render @view_module, @view_template, assigns %>
    </main>
    <!-- ... -->
  </body>
</html>
```

Like the `index.html.eex` template, the `<title>` uses the `gettext` macro to
get its translation, and the `<body>` calls out to a `body/0` view function in
`LayoutView` to fetch its Tachyons style classes:

**`lib/phx_i18n_example_web/views/layout_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.LayoutView do
  use PhxI18nExampleWeb, :view
  alias PhxI18nExampleWeb.{LanguageDropdownView, LayoutStyle}

  defdelegate body, to: LayoutStyle
end
```

**`lib/phx_i18n_example_web/views/styles/layout_style.ex`**

```elixir
defmodule PhxI18nExampleWeb.LayoutStyle do
  @body_classes ~w[
    bg-dark-pink
    overflow-container
    pt3
    sans-serif
    vh-100
    white
  ] |> Enum.join(" ")

  def body, do: @body_classes
end
```

### Language Dropdown Menu

Above the `main` section of `app.html.eex`, within which in this case
`index.html.eex` is rendered, we render a separate view and template for the
locale dropdown, passing in a `@show_available_locales` value, available here
as a module attribute due to `show_available_locales` being `assign`ed in the
`Plug.Conn` in `LocalePlug`:

**`lib/phx_i18n_example_web/templates/language_dropdown/language_dropdown.html.eex`**

```elixir
<div class="<%= dropdown_container() %>">
  <%= render LanguageDropdownView,
             "_current_locale_link.html",
             show_available_locales: @show_available_locales %>
  <ul class="<%= dropdown_list(@show_available_locales) %>">
    <%= render_many selectable_locales(),
                    LanguageDropdownView,
                    "_locale_link.html",
                    as: :locale %>
  </ul>
</div>
```

Using the same `LanguageDropdownView`, we render two partial templates:

- `_current_locale_link.html`, passing in the `@show_available_locales` value we
  received from `app.html.eex`
- `_locale_link.html`, which we are rendering for each of the non-current
  selectable locales, which we get from the `selectable_locales/0` function,
  using [`Phoenix.View.render_many/4`][]

Let's have a look at each of the partial templates:

**`lib/phx_i18n_example_web/templates/language_dropdown/_current_locale_link.html.eex`**

```elixir
<a href="?show_available_locales=<%= !@show_available_locales %>"
   class="<%= current_selection_link() %>">
  <p class="<%= current_selection(@show_available_locales) %>">
    <span><%= current_locale_string() %></span>
    <span class="<%= caret() %>">▾</span>
  </p>
</a>
```

- The `<a>` tag here links to the opposite value of whatever the passed-in
  `@show_available_locales` value is, so that we can implement a toggle-like
  action
- The styling of the dropdown is dependant on the value in
  `@show_available_locales`, which gets passed into the `current_selection/1`
  function

**`lib/phx_i18n_example_web/templates/language_dropdown/_locale_link.html.eex`**

```elixir
<a href="?locale=<%= @locale %>" class="<%= dropdown_list_item_link() %>">
  <li class="<%= dropdown_list_item() %>">
    <%= locale_string(@locale) %>
  </li>
</a>
```

- The `@locale` attribute comes from the `as: :locale` option used in the
  `render_many/4` function in `language_dropdown.html.eex`: each locale from
  the `selectable_locales/0` function (see below) that is passed in to the
  partial is referenced as `@locale`
- The `<a>` tag here links to its own locale as the target locale
- Displays the humanised version of the locale (eg locale `"en"` displays as
  "English")

All the functions in the previous two partial templates are contained in the
`LanguageDropdownView`:

**`lib/phx_i18n_example_web/views/language_dropdown_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownView do
  use PhxI18nExampleWeb, :view
  alias PhxI18nExampleWeb.LanguageDropdownStyle
  alias __MODULE__, as: LanguageDropdownView

  @locales Gettext.known_locales(PhxI18nExampleWeb.Gettext)
  @locale_strings %{
    "en" => "English",
    "it" => "Italiano",
    "ja" => "日本語"
  }

  defdelegate caret, to: LanguageDropdownStyle
  defdelegate current_selection(show_available_locales), to: LanguageDropdownStyle
  defdelegate current_selection_link, to: LanguageDropdownStyle
  defdelegate dropdown_container, to: LanguageDropdownStyle
  defdelegate dropdown_list(show_available_locales), to: LanguageDropdownStyle
  defdelegate dropdown_list_item, to: LanguageDropdownStyle
  defdelegate dropdown_list_item_link, to: LanguageDropdownStyle

  def locale_string(locale), do: @locale_strings[locale]
  def current_locale_string, do: locale_string(Gettext.get_locale())
  def selectable_locales, do: List.delete(@locales, Gettext.get_locale())
end
```

- The Tachyons style-related functions are all delegated off to this view's
  style module, `LanguageDropdownStyle`
- The `locale_string/1` and `current_locale_string/0` functions simply perform
  a lookup of the `@locale_strings` map to get the value to show in the menu:
  note that these strings are static, and the menu itself is not
  internationalised at all
- Notice that the `current_locale_string/0` function immediately calls the
  `locale_string/1` function, passing in the result of the
  `Gettext.get_locale/0` function as a parameter: we are always using Gettext
  as the source of truth for the application locale
- In the same way, to get the list of selectable locales to populate the locale
  menu, we are subtracting the current locale from the list of known locales
  that we configured in `config.exs`

The `LanguageDropdownStyle` module contains the following:

**`lib/phx_i18n_example_web/views/styles/language_dropdown_style.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownStyle do
  @caret_classes ~w[
    absolute
    ml2
  ] |> Enum.join(" ")

  @current_selection_classes ~w[
    b--white
    ba
    br2
    pa2
    pointer
    tc
    w4
  ]

  @current_selection_border_radius_classes "br--top"

  @current_selection_link_classes ~w[
    no-underline
    white
  ] |> Enum.join(" ")

  @dropdown_container_classes ~w[
    center
    f3
    flex
    h3
    items-center
    justify-end
    w-90
  ] |> Enum.join(" ")

  @dropdown_list_classes ~w[
    absolute
    b--white
    bb
    bl
    br
    br--bottom
    br2
    items-center
    list
    mt5
    pl0
    pointer
    pr0
    pt1
    tc
    top-0
    w4
  ]

  @dropdown_show_classes ~w[
    flex
    flex-column
  ] |> Enum.join(" ")

  @dropdown_hide_classes "dn"

  @dropdown_list_item_classes ~w[
    hover-bg-white
    hover-dark-pink
    ph1
    pv2
    pt0
    w-100
  ] |> Enum.join(" ")

  @dropdown_list_item_link_classes ~w[
    no-underline
    w-100
    white
  ] |> Enum.join(" ")

  def caret, do: @caret_classes

  def current_selection(show_available_locales) do
    display_classes =
      if show_available_locales do
        [@current_selection_border_radius_classes | @current_selection_classes]
      else
        @current_selection_classes
      end

    Enum.join(display_classes, " ")
  end

  def current_selection_link, do: @current_selection_link_classes

  def dropdown_container, do: @dropdown_container_classes

  def dropdown_list(show_available_locales) do
    display_classes =
      if show_available_locales do
        [@dropdown_show_classes | @dropdown_list_classes]
      else
        [@dropdown_hide_classes | @dropdown_list_classes]
      end

    Enum.join(display_classes, " ")
  end

  def dropdown_list_item, do: @dropdown_list_item_classes
  def dropdown_list_item_link, do: @dropdown_list_item_link_classes
end
```

You can see that things here are quite verbose, and hence extracting these
functions out into their own module creates a hard concern barrier between
style-related functions, and other utility-like functions that are typically
needed in view modules.

### Generate Translations

Now that we know all of the two places where we need the `gettext` macro, we
can generate translation placeholders for all of our known locales using the
following commands:

```text
mix gettext.extract
mix gettext.merge priv/gettext --locale en
mix gettext.merge priv/gettext --locale it
mix gettext.merge priv/gettext --locale ja
```

Now that we have our locale placeholders, let's put some translations in them!
The English locale file can be left as-is:

**`priv/gettext/en/LC_MESSAGES/default.po`**

```elixir
# ...

#, elixir-format
#: lib/phx_i18n_example_web/templates/layout/app.html.eex:7
msgid "Multilingualisation in Phoenix"
msgstr ""

#, elixir-format
#: lib/phx_i18n_example_web/templates/page/index.html.eex:4
msgid "Vertically centering things in css is easy!"
msgstr ""
```

**`priv/gettext/it/LC_MESSAGES/default.po`**

```elixir
# ...

#, elixir-format
#: lib/phx_i18n_example_web/templates/layout/app.html.eex:7
msgid "Multilingualisation in Phoenix"
msgstr "Multilingualizzazione in Phoenix"

#, elixir-format
#: lib/phx_i18n_example_web/templates/page/index.html.eex:4
msgid "Vertically centering things in css is easy!"
msgstr "Centrare verticalmente con css è facile!"
```

**`priv/gettext/ja/LC_MESSAGES/default.po`**

```elixir
# ...

#, elixir-format
#: lib/phx_i18n_example_web/templates/layout/app.html.eex:7
msgid "Multilingualisation in Phoenix"
msgstr "Phoenixにおける多言語化"

#, elixir-format
#: lib/phx_i18n_example_web/templates/page/index.html.eex:4
msgid "Vertically centering things in css is easy!"
msgstr "CSSで垂直センタリングは簡単だよ！"
```

And now, when you change your locale, you should see the language change on the
page content, as well as the page title!

![01-client-server Implementation][]

You can find the code for this iteration of the application in this post's
[companion Github repo][phx_i18n_example] on the [`01-client-server` branch][].
The branch is also deployed [here][phx-i18n-01-client-server] in its own
environment.  

### Client-Server Issues

So, we have language switching working, but what is wrong here?

- It takes time to open and close the menu, and to change locale, since we are
  doing a round trip to the server
- We cannot make the menu close if we click elsewhere on the page, since we
  cannot use Javascript [`onclick`][GlobalEventHandlers.onclick] handlers. We
  also cannot make the entire `<body>` content a link, since we would have the
  dropdown links inside that body content link, and [HTML][]
  [does not do nested links][Nested links are illegal].

Since we are missing a use case from the Elm implementation, let's compromise
and allow some Javascript "sprinkles" into the application.

## Javascript Sprinkles

For this next step, aside from introducing some Javascript code, the main
functionality of the application will not change very much.

### Add Tag Metadata

We will need to allow Javascript to target certain page elements in order to
manipulate them or perform some other actions, and that will take the form of
adding some `id`s and `roles` to tags. So, let's open up the following files and
make those small changes:

**`lib/phx_i18n_example_web/templates/layout/app.html.eex`**

```elixir
<!-- ... -->
  <body class="<%= body() %>" id="body">
    <!-- ... -->
  </body>
<!-- ... -->
```

**`lib/phx_i18n_example_web/templates/language_dropdown/language_dropdown.html.eex`**

```elixir
<!-- ... -->
<ul class="<%= dropdown_list(@show_available_locales) %>" id="locale_dropdown">
  <!-- ... -->
</ul>
<!-- ... -->
```

**`lib/phx_i18n_example_web/templates/language_dropdown/_current_locale_link.eex`**

```elixir
<a href="?show_available_locales=<%= !@show_available_locales %>"
   class="<%= current_selection_link() %>"
   id="current_locale_link">
  <p class="<%= current_selection(@show_available_locales) %>" id="current_locale">
    <!-- ... -->
  </p>
</a>
```

**`lib/phx_i18n_example_web/templates/language_dropdown/_locale_link.eex`**

```elixir
<a href="?locale=<%= @locale %>"
   class="<%= dropdown_list_item_link() %>"
   role="locale_link">
  <!-- ... -->
</a>
```

### Add Javascript

Now, in the main Javascript entry point for a Phoenix application, we are going
to add a click-handler to the `<body>` that tells the dropdown to hide itself:

**`assets/js/app.js`**

```js
// ...
// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"
import { LocaleDropdown } from "./locale_dropdown"

document.getElementById("body").onclick = () => {
  LocaleDropdown.hide()
}
```

I prefer Javascript with an interface that looks like it follows an Elixir-like
`Module.function()` convention. This was able to be done using an Immediately
Invoked Function Expression ([IIFE][]; pronounced "iffy") that
returns an [object][Javascript object] containing functions in its values:

**`assets/js/locale_dropdown.js`**

```js
export { LocaleDropdown }

const LocaleDropdown = ((document, window) => {
  const LOCALE_DROPDOWN_CLASSES = document.getElementById("locale_dropdown").classList
  const CURRENT_LOCALE_CLASSES = document.getElementById("current_locale").classList
  const CURRENT_LOCALE_LINK = document.getElementById("current_locale_link")
  const LOCALE_DROPDOWN_LINKS =
    document.querySelectorAll('[role="locale_link"], #current_locale_link')

  // REF: https://tachyons.io/docs/table-of-styles/
  const TOP_BORDER_RADIUS_ONLY = "br--top"
  const DROPDOWN_VISIBLE_CLASSES = ["flex", "flex-column"]
  const DROPDOWN_HIDDEN_CLASS = "dn"

  initLocaleDropdownLinks()

  return Object.freeze({
    hide: hide
  })

  function initLocaleDropdownLinks() {
    LOCALE_DROPDOWN_LINKS.forEach(link => {
      // NOTE: Prevent propagation to the onclick handler for the `body` tag.
      link.onclick = event => { event.stopPropagation() }
    })
  }

  function hide() {
    if (isVisible()) {
      hideLocaleDropdown()
      setCurrentLocaleLinkToOpenDropdownMenu()
      resetCurrentLocaleBottomBorderRadius()
      updateShowAvailableLocalesToHidden()
    }
  }

  function isVisible() {
    return (
      DROPDOWN_VISIBLE_CLASSES.some(value => {
        return LOCALE_DROPDOWN_CLASSES.contains(value)
      })
    )
  }

  function hideLocaleDropdown() {
    LOCALE_DROPDOWN_CLASSES.remove(...DROPDOWN_VISIBLE_CLASSES)
    LOCALE_DROPDOWN_CLASSES.add(DROPDOWN_HIDDEN_CLASS)
  }

  function setCurrentLocaleLinkToOpenDropdownMenu() {
    CURRENT_LOCALE_LINK.setAttribute("href", "/?show_available_locales=true")
  }

  function resetCurrentLocaleBottomBorderRadius() {
    CURRENT_LOCALE_CLASSES.remove(TOP_BORDER_RADIUS_ONLY)
  }

  function updateShowAvailableLocalesToHidden() {
    // NOTE: This is done purely from a UX standpoint: If the locale dropdown is
    // closed, do not have the search parameter say that it's open.
    if (window.location.search === "?show_available_locales=true") {
      window.history.pushState(
        {}, document.title, "/?show_available_locales=false"
      )
    }
  }
})(document, window)
```

Yes, this is a pretty liberal helping of Javascript "sprinkles", but, we needed
it. We won't go through all the details of this code, but there a few
peculiarities worth bringing up briefly:

- As the IIFE executes, it "initialises" itself by calling
  `initLocaleDropdownLinks()`. This sets up event handlers to make sure all
  links in the dropdown menu, including the current locale link, do not have
  events generated by their clicks inadvertently propagate down to `<body>` tag,
  causing `LocaleDropdown.hide()` to also be called
- The returned [frozen object][Object.freeze()] contains what is essentially the
  "public interface" for the IIFE: the `hide` function, which, as you can see,
  is called in `app.js`
- The `document` and `window` do not _technically_ need to be passed into the
  IIFE as arguments since they are globally available, but I think encapsulation
  is always a goal worth striving for. It is probably also better to have as
  many variables as possible resolve locally within the IIFE, rather than have
  to go out and get global variables every time you want to use them

Now, when you open the dropdown menu, and click anywhere else on the page, the
menu closes.

![02-js-sprinkles Implementation][]

You can find the code for this iteration of the application in this post's
[companion Github repo][phx_i18n_example] on the [`02-js-sprinkles` branch][].
The branch is also deployed [here][phx-i18n-02-js-sprinkles] in its own
environment.  

### Javascript Sprinkles Issues

We are now technically on-par feature-wise with the Elm implementation, but
there are still some lingering issues:

- It _still_ takes time to open and close the menu and change the locale
- Closing the menu via clicking somewhere else on the page is snappier than
  clicking the current locale, even though their function is the same, which is
  a bit awkward

You can really feel now that we are perhaps unnecessarily forcing the back end
to do things that the front end really wants us to do, so let's acquiesce to
Javascript and let it take over more functionality. Further, let's get rid of
any _mandatory_ state management via URL parameters: like the Elm app, I don't
want to see parameters that I don't have to.

## Javascript Takeover

### Remove Language Dropdown State Parameter

Dropdown state is currently managed via the `@show_available_locales` attribute,
which is initially set in the `LocalePlug`, and then used throughout the
templates and views. So, let's first purge our plug of this param: open up
`locale_plug.ex`, and delete the `determine_language_dropdown_state/1`
function entirely, since we are not determining the language dropdown state in
the plug anymore. Then, remove that function call from the `call/2` function as
follows:

**`lib/phx_i18n_example_web/plugs/locale_plug.ex`**

```elixir
defmodule PhxI18nExampleWeb.LocalePlug do
  # ...

  @impl Plug
  def call(conn, _opts) do
    locale = fetch_and_set_locale(conn)
    persist_locale(conn, locale)
  end

  # ...
end
```

Great! Now, let's go and remove any trace of the `@show_available_locales` in
our templates and views. First, in the layout:

**`lib/phx_i18n_example_web/templates/layout/app.html.eex`**

```elixir
<!-- ... -->
<%= render LanguageDropdownView, "language_dropdown.html" %>
<!-- ... -->
```

Then, in the dropdown menu template:

**`lib/phx_i18n_example_web/templates/language_dropdown/language_dropdown.html.eex`**

```elixir
<div class="<%= dropdown_container() %>">
  <%= render LanguageDropdownView, "_current_locale.html" %>
  <ul class="<%= dropdown_list() %>" id="locale_dropdown">
    <%= render_many selectable_locales(),
                    LanguageDropdownView,
                    "_locale_list_item.html",
                    as: :locale %>
  </ul>
</div>
```

Here, you can see that we have renamed the `_current_locale_link.html` and
`_locale_link.html` partials to `_current_locale.html` and
`_locale_list_item.html` respectively, as we will use handlers for click events
in them, rather than `<a>` links

The partials themselves look like the following:

**`lib/phx_i18n_example_web/templates/language_dropdown/_current_locale.html.eex`**

```elixir
<p class="<%= current_selection() %>" id="current_locale">
  <span><%= current_locale_string() %></span>
  <span class="<%= caret() %>">▾</span>
</p>
```

**`lib/phx_i18n_example_web/templates/language_dropdown/_locale_list_item.html.eex`**

```elixir
<li class="<%= dropdown_list_item() %>" id="<%= @locale %>" role="selectable_locale">
  <%= locale_string(@locale) %>
</li>
```

The number of styling-related functions has also decreased as a result of these
changes, so we change the view and styling module code accordingly:

**`lib/phx_i18n_example_web/views/language_dropdown_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownView do
  # ...

  defdelegate caret, to: LanguageDropdownStyle
  defdelegate current_selection, to: LanguageDropdownStyle
  defdelegate dropdown_container, to: LanguageDropdownStyle
  defdelegate dropdown_list, to: LanguageDropdownStyle
  defdelegate dropdown_list_item, to: LanguageDropdownStyle

  # ...
end
```

**`lib/phx_i18n_example_web/views/styles/language_dropdown_style.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownStyle do
  @caret_classes ~w[
    absolute
    ml2
  ] |> Enum.join(" ")

  @current_selection_classes ~w[
    b--white
    ba
    br2
    pa2
    pointer
    tc
    w4
  ] |> Enum.join(" ")

  @dropdown_container_classes ~w[
    center
    f3
    flex
    h3
    items-center
    justify-end
    w-90
  ] |> Enum.join(" ")

  # NOTE: Default visibility is `display: none` (`dn`).
  @dropdown_list_classes ~w[
    absolute
    b--white
    bb
    bl
    br
    br--bottom
    br2
    dn
    items-center
    list
    mt5
    pl0
    pointer
    pr0
    pt1
    tc
    top-0
    w4
  ] |> Enum.join(" ")

  @dropdown_list_item_classes ~w[
    hover-bg-white
    hover-dark-pink
    ph1
    pv2
    pt0
    w-100
  ] |> Enum.join(" ")

  def caret, do: @caret_classes
  def current_selection, do: @current_selection_classes
  def dropdown_container, do: @dropdown_container_classes
  def dropdown_list, do: @dropdown_list_classes
  def dropdown_list_item, do: @dropdown_list_item_classes
end
```

### Increase Javascript Responsibility

Finally, we update the locale dropdown Javascript so that it can:

- Open the dropdown, as well as close it
- Handle click events for each locale in the dropdown list, including the
  current locale
- Prompt a locale change by sending an [AJAX][] request, and then update the
  page with the server response

**`assets/js/locale_dropdown.js`**

```js
export { LocaleDropdown }

const LocaleDropdown = ((document, window) => {
  const LOCALE_DROPDOWN_CLASSES = document.getElementById("locale_dropdown").classList
  const CURRENT_LOCALE = document.getElementById("current_locale")
  const SELECTABLE_LOCALES = document.querySelectorAll("[role='selectable_locale']")

  // REF: https://tachyons.io/docs/table-of-styles/
  const TOP_BORDER_RADIUS_ONLY = "br--top"
  const DROPDOWN_VISIBLE_CLASSES = ["flex", "flex-column"]
  const DROPDOWN_HIDDEN_CLASS = "dn"

  initCurrentLocale()
  initSelectableLocales()

  return Object.freeze({
    hide: hide
  })

  function initCurrentLocale() {
    const currentLocaleClassList = CURRENT_LOCALE.classList
    CURRENT_LOCALE.onclick = event => {
      // NOTE: Prevent propagation to the onclick handler for the `body` tag.
      event.stopPropagation()
      if (isVisible()) {
        hideLocaleDropdown()
        removeCurrentLocaleBottomBorderRadius(currentLocaleClassList)
      } else {
        showLocaleDropdown()
        addCurrentLocaleBottomBorderRadius(currentLocaleClassList)
      }
    }
  }

  function initSelectableLocales() {
    SELECTABLE_LOCALES.forEach(locale => {
      locale.onclick = () => {
        changeLocale(locale)
      }
    })
  }

  function hide() {
    const currentLocaleClassList = CURRENT_LOCALE.classList
    if (isVisible()) {
      hideLocaleDropdown()
      removeCurrentLocaleBottomBorderRadius(currentLocaleClassList)
    }
  }

  function changeLocale(locale) {
    // Clear params in case the locale was originally set using them.
    window.history.replaceState({}, document.title, "/")
    const xhr = new XMLHttpRequest()
    xhr.open("GET", document.location.origin + `?locale=${locale.id}`)
    xhr.onreadystatechange = () => {
      document.open()
      document.write(xhr.responseText)
      document.close()
    }
    xhr.send()
  }

  function isVisible() {
    return (
      DROPDOWN_VISIBLE_CLASSES.some(value => {
        return LOCALE_DROPDOWN_CLASSES.contains(value)
      })
    )
  }

  function hideLocaleDropdown() {
    LOCALE_DROPDOWN_CLASSES.remove(...DROPDOWN_VISIBLE_CLASSES)
    LOCALE_DROPDOWN_CLASSES.add(DROPDOWN_HIDDEN_CLASS)
  }

  function showLocaleDropdown() {
    LOCALE_DROPDOWN_CLASSES.add(...DROPDOWN_VISIBLE_CLASSES)
    LOCALE_DROPDOWN_CLASSES.remove(DROPDOWN_HIDDEN_CLASS)
  }

  function removeCurrentLocaleBottomBorderRadius(currentLocaleClassList) {
    currentLocaleClassList.remove(TOP_BORDER_RADIUS_ONLY)
  }

  function addCurrentLocaleBottomBorderRadius(currentLocaleClassList) {
    currentLocaleClassList.add(TOP_BORDER_RADIUS_ONLY)
  }
})(document, window)
```

After applying those changes, you can see that the application is now as snappy
as the Elm version.

![03-js-takeover Implementation][]

You can find the code for this iteration of the application in this post's
[companion Github repo][phx_i18n_example] on the [`03-js-takeover` branch][].
The branch is also deployed [here][phx-i18n-03-js-takeover] in its own
environment.  

### Javascript Takeover Issues

In order to fetch translations, the application is still making a call out to
the server, so it will never be quite as fast as Elm there, but that's fine:
I would rather not give up using the gettext API for a potential front-end-based
solution.

But, the issue now is...we have a lot of Javascript :wink:! Wouldn't it be nicer
if we could handle all this "front-end" functionality in Elixir-land? Well,
let's see how much LiveView can help us in achieving that goal!

## LiveView

It feels like it's been a long evolution for this application, but we are
finally at the main event: leveraging the power of LiveView!

Before we begin changing our application logic, we have some new dependencies
to add and some configuration ceremony to perform, so let's do that.

### Installation and Configuration

> **NOTE**: The method of installation/configuration below is current as of
LiveView 0.3.1, but since LiveView is a rapidly evolving project as of this
writing, make sure to check the [Phoenix LiveView README][] file for the
latest information if you run into any issues.

First, we need to install the LiveView hex package, so add the following entries
to your mix file:

**`mix.exs`**

```elixir
defmodule PhxI18nExample.MixProject do
  # ...

  defp deps do
    [
      # ...
      {:phoenix_live_view, "~> 0.3.0"},
      {:floki, ">= 0.0.0", only: :test}
    ]
  end
```

Then, run `mix deps.get`.

Next, we need to add configuration for a signing salt. Generate one by running
`mix phx.gen.secret 32`, and then add it as follows:

**`config/config.exs`**

```elixir
config :phx_i18n_example, PhxI18nExampleWeb.Endpoint,
  # ...
  live_view: [
    signing_salt: "<YOUR_SECRET_SALT>"
  ]
```

Add the LiveView flash to the browser pipeline:

**`lib/phx_i18n_example_web/router.ex`**

```elixir
defmodule PhxI18nExampleWeb.Router do
  # ...

  pipeline :browser do
    # ...
    plug :fetch_flash
    plug Phoenix.LiveView.Flash
    # ...
  end

  # ...
end
```

Add some LiveView configuration to your controllers, views, and router in
your web file:

**`lib/phx_i18n_example_web.ex`**

```elixir
defmodule PhxI18nExampleWeb do
  # ...

  def controller do
    quote do
      # ...
      import Phoenix.LiveView.Controller
    end
  end

  def view do
    quote do
      # ...
      import Phoenix.LiveView,
        only: [
          live_render: 2,
          live_render: 3,
          live_link: 1,
          live_link: 2
        ]
    end
  end

  def router do
    quote do
      # ...
      import Phoenix.LiveView.Router
    end
  end

  # ...
end
```

Expose a new websocket for LiveView updates:

**`lib/phx_i18n_example_web/endpoint.ex`**

```elixir
defmodule PhxI18nExampleWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :phx_i18n_example

  socket "/live", Phoenix.LiveView.Socket

  # ...
end
```

Add LiveView to the [Node][] dependencies:

**`assets/package.json`**

```js
{
  // ...
  "dependencies": {
    // ...
    "phoenix_live_view": "file:../deps/phoenix_live_view"
  },
  // ...
}
```

Install the dependencies with:

```text
npm install --prefix assets
```

Finally, enable connecting to a LiveView socket from Javascript:

**`assets/js/app.js`**

```js
// ...

import { Socket } from "phoenix"
import LiveSocket from "phoenix_live_view"

let liveSocket = new LiveSocket("/live", Socket)
liveSocket.connect()
```

Okay, configuration ceremony complete! Now, let's move over to actually changing
the application.

### From Conn to Session

We will start, yet again, with the locale plug, where we find that there are
some significant changes from before:

**`lib/phx_i18n_example_web/plugs/locale_plug.ex`**

```elixir
defmodule PhxI18nExampleWeb.LocalePlug do
  alias Plug.Conn
  @behaviour Plug

  @locales Gettext.known_locales(PhxI18nExampleWeb.Gettext)
  @cookie "phxi18nexamplelanguage"

  defguard known_locale?(locale) when locale in @locales

  @impl Plug
  def init(_opts), do: nil

  @impl Plug
  def call(conn, _opts) do
    locale = fetch_locale(conn)

    conn
    |> Conn.assign(:locale, locale)
    |> Conn.put_session(:locale, locale)
  end

  defp fetch_locale(conn) do
    case locale_from_params(conn) || locale_from_cookies(conn) do
      nil ->
        # NOTE: This will fallback to the default locale set in `config.exs`
        Gettext.get_locale()

      locale ->
        locale
    end
  end

  defp locale_from_params(%Conn{params: %{"locale" => locale}})
       when known_locale?(locale) do
    locale
  end

  defp locale_from_params(_conn), do: nil

  defp locale_from_cookies(%Conn{cookies: %{@cookie => locale}})
       when known_locale?(locale) do
    locale
  end

  defp locale_from_cookies(_conn), do: nil
end
```

A few notes on this file:

- In the `fetch_locale/1` function, we are still attempting to fetch the locale
  from values potentially given in the params, or in the cookies. If we cannot
  find it, we ask gettext to give us the default locale; that part has not
  changed. However, if we do find the locale, we are simply returning it,
  without calling [`Gettext.put_locale/1`][] to set the locale globally, because
  LiveViews _run in their own process_. As opposed to before, where the
  application was essentially _single process_, the application will now be
  _multi-process_, which means that there is no global locale for a LiveView to
  refer to, even if we do set it: each process can only rely on its own
  encapsulated state, and hence will need a local reference to a locale
- This relates directly to why we are using [`Plug.Conn.put_session/3`][]: we
  provide `session` data to LiveViews, not `conn` data, to initialise their
  state
- We are also providing the exact same locale data to the `conn` assigns,
  though. Why store the same data in two different places? Because the layout
  template the LiveView is rendered in, `app.html.eex`, needs it. A layout, or
  at least the main layout (I have not tested nested layouts), as far as I can
  gather, can have LiveViews rendered within in it, but _cannot itself_ be a
  LiveView (this took me far too long to finally figure out)
- All code related to persisting the locale value in the cookie has been removed
  since a [`Phoenix.LiveView.Socket`][] does not have the ability to directly
  access or assign values to cookies. So how do we make sure the application
  can remember our locale choice? Using a Javascript escape hatch called
  "[hooks][JS Interop and client controlled DOM]" to get at the cookies, which
  we will see more of later...

### Goodbye Controller, Hello LiveView

Now, let's see about getting a LiveView rendered. First, to the router:

**`lib/phx_i18n_example_web/router.ex`**

```elixir
defmodule PhxI18nExampleWeb.Router do
  # ...

  scope "/", PhxI18nExampleWeb do
    pipe_through :browser
    live "/", PageLive, session: [:locale]
  end
end
```

- Rather than routing the root path to the `PageController`, we can route
  directly to a LiveView with [`Phoenix.LiveView.Router.live/3`][]. LiveViews
  are responsible for setting up state within their own process, so they pretty
  much fulfil the role that a controller would. So, if you would like, you can
  safely delete the `lib/phx_i18n_example_web/controllers/page_controller.ex`
  file. (Note that we could have continued to use `PageController`, and just
  converted the `index` function's [`render/3`][`Phoenix.View.render/3`] to a
  [`live_render/3`][`Phoenix.LiveView.render/3`], but it's purpose would have
  only been to manually extract the `locale` out of `conn.assigns` and assign
  it to the `session`, so I figured going straight to a `live` route would feel
  more "LiveView-y", if that's even a thing...)
- The `session: [:locale]` option here indicates that we want to pass the
  session `locale` value we populated in the `LocalePlug` to `PageLive`, our
  named LiveView

Speaking of which, let's create a `PageLive` module, which, by what seems
like an emerging convention, should be placed in a `live/` web directory:

**`lib/phx_i18n_example_web/live/page_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLive do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.PageView

  def mount(%{locale: locale}, socket) do
    socket = assign(socket, locale: locale)
    {:ok, socket}
  end

  def render(assigns) do
    PageView.render("index.html", assigns)
  end
end
```

A LiveView has two main callback functions that you must implement:

- [`mount/2`][`Phoenix.LiveView.mount/2`], where you set up your initial state
  from session values and assign them to the `socket` state
- [`render/1`][`Phoenix.LiveView.render/1`], which is responsible for returning
  rendered content, which in this case is the `index.html` template, passing it
  the `assigns` information, which comes from the `socket`. So, in this case,
  `assigns` could contain `%{locale: "en"}` if that is what was set in the
  socket, either from `mount/2`, or an event handler, which we will look at
  later

As for the `index.html` template that gets `render`ed in the LiveView, it looks
fairly similar to before, but we now need to give it a `.leex` extension for
Live Embedded Elixir:

**`lib/phx_i18n_example_web/templates/page/index.html.leex`**

```elixir
<%= with_locale(@locale, fn -> %>
  <article class="<%= article() %>" phx-click="hide-dropdown">
    <div class="<%= heading_container() %>">
      <h1 class="<%= heading() %>">
        <%= gettext("Vertically centering things in css is easy!") %>
      </h1>
    </div>
  </article>
<% end) %>
```

- As mentioned previously, we can no longer rely on `Gettext.get_locale/0` to
  be our global source of truth for the application locale, since each LiveView
  is its own process. So, we need to specifically provide a locale to every
  template that needs translating. I initially thought that I could use
  `Gettext.get_locale/0` and `Gettext.put_locale/1` within a LiveView to set a
  global locale _within the LiveView process_: I tried using them in `mount/2`,
  `render/1`, and even within the above template, but I had no luck in getting
  the string-to-translate to re-evaluate until I used
  [`Gettext.with_locale/2`][] with the `@locale` that was set in the
  `socket.assigns`.  So, please be aware of that potentially time-consuming
  gotcha, or, if you found a way to use them in LiveView, please let me know!
- The `<article>` tag now has a `phx-click="hide-dropdown"` binding on it,
  which will send `PageLive` a `"hide-dropdown"` message when it is clicked
  (remember that clicking outside the dropdown menu while it is open should
  close the menu). We haven't put the message-handling code in `PageLive` just
  yet, but we will come back to it

In order to get `with_locale/2` available in the template, make sure to update
the `PageView`:

**`lib/phx_i18n_example_web/views/page_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageView do
  use PhxI18nExampleWeb, :view
  import Gettext, only: [with_locale: 2]

  # ...
end
```

### Every LiveView in its own Process

In the layout, the standard
`<%= render @view_module, @view_template, assigns %>` statement renders the
`PageLive` LiveView, but that is not the only place where we need dynamic
functionality. The language dropdown needs to open, close, and change locale,
and the page title needs to change when the locale changes.

We cannot wrap the entire page in a single LiveView (there's no equivalent for
`document.getElementById("body").onclick` for us here), so we are going to need
separate LiveViews for the dropdown menu and title, rendered from the layout:

**`lib/phx_i18n_example_web/templates/layout/app.html.eex`**

```elixir
<!DOCTYPE html>
<html>
  <head>
    <!-- ... -->
    <%= live_render @conn, TitleLive, session: %{locale: @locale} %>
  </head>
  <body class="<%= body() %>">
    <%= live_render @conn, LanguageDropdownLive, session: %{locale: @locale} %>
    <main role="main">
      <%= render @view_module, @view_template, assigns %>
    </main>
    <!-- ... -->
  </body>
</html>
```

The [`live_render/3`][`Phoenix.LiveView.render/3`] function "renders a LiveView
within an originating plug request or within a parent LiveView". If we were
rendering these LiveViews from another LiveView, we would pass in the parent
LiveView's `@session` attribute. But, since the layout is within a plug request,
we do not have a session yet, and, therefore, need to create one for the new
LiveViews. Hence, we use `@conn` as the first argument, and make sure to pass in
the `@locale` attribute from the conn, that we set up in the `LocalePlug`
(remember, we set the same locale value in both the `conn` and in the
`session`), into both the `TitleLive` and `LanguageDropdownLive`'s `session`.

In order to have `TitleLive` aliased properly in the layout template, make sure
to make the following minor change to the `LayoutView`:

**`lib/phx_i18n_example_web/views/layout_view.ex`**

```elixir
# ...
alias PhxI18nExampleWeb.{LanguageDropdownLive, LayoutStyle, TitleLive}
```

We will get into the details of `TitleLive` and `LanguageDropdownLive` soon, but
an important thing to understand is that we now have 3 LiveViews, each running
in their own _separate process_, which conceptually looks like this:

![LiveView Summary][]

Now, even though each of these LiveViews exist in isolated processes, they still
need to be able to _talk to each other_ when certain events occur:

- When `LocaleDropdownLive` changes the locale, `PageLive` and `TitleLive` need
  to know what the locale has been changed to so they can re-render themselves
  with the correct string for the locale
- When the current locale is clicked, it needs to look at what the state of the
  available locales dropdown menu is, open or closed, and toggle it
- If the dropdown menu is open in `LocaleDropdownLive`, and a click occurs
  either in `PageLive` or in `LocaleDropdownLive` outside of the dropdown menu,
  `LocaleDropdownLive` needs to know so that it can re-render itself with a
  closed menu

![LiveView Messages][]

In order to get these LiveViews chatting, we will call on [Phoenix PubSub][] to
help us out.

## LiveView Event Handling

Since we're already most familiar with `PageLive`, let's code up message
handling there first:

**`lib/phx_i18n_example_web/live/page_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLive do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, PageView}

  @locale_changes "locale-changes"
  @dropdown_changes "dropdown-changes"

  def mount(%{locale: locale}, socket) do
    Endpoint.subscribe(@locale_changes)
    socket = assign(socket, locale: locale)
    {:ok, socket}
  end

  def render(assigns) do
    PageView.render("index.html", assigns)
  end

  def handle_event("hide-dropdown", _value, socket) do
    Endpoint.broadcast_from(self(), @dropdown_changes, "hide-dropdown", %{})
    {:noreply, socket}
  end

  def handle_info(%{event: "change-locale", payload: %{locale: locale}}, socket) do
    socket = assign(socket, :locale, locale)
    {:noreply, socket}
  end
end
```

![PageLive Events][]

- There are two different types of messages that `PageView` has to concern
  itself with: locale change messages, and dropdown change messages, which we
  have set up as two different [Phoenix Channel][] names: `@locale_changes` and
  `@dropdown_changes`. Not all LiveViews will need to care about all kinds of
  messages, which is why we are not using a single channel for all message
  types
- When the `PageView` `mount`s, it calls [`Phoenix.Endpoint.subscribe/2`] to set
  up a subscription to `@locale_changes` messages, since it needs to be told
  when the locale changes so it can render the correct language string. The
  message we are looking out for from `@locale_changes` is called
  `"change-locale"`, which we handle with [`Phoenix.LiveView.handle_info/2`][].
  When we get the `"change-locale"` message, we extract the `locale` from its
  `payload`, and assign it to the `socket`. `render/1` will then be called
  automatically, and any necessary template re-rendering will occur
- The `PageView` also needs to listen out for `"hide-dropdown"` messages that
  its own template, `index.html.leex` could send to it (remember we set
  `phx-click="hide-dropdown"` on the `<article>` tag). When a `"hide-dropdown"`
  message is received by [`Phoenix.LiveView.handle_event/3`][], the `PageView`
  does not need to do anything to itself, but it instead calls
  [`Phoenix.Endpoint.broadcast_from/4`][] to send out a broadcast to anything
  that's listening on the `@dropdown_changes` channel telling it that they
  should hide their dropdown; you can probably guess what would be listening out
  for that

Let's now create a `TitleLive` module:

**`lib/phx_i18n_example_web/live/title_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.TitleLive do
  use Phoenix.LiveView
  import PhxI18nExampleWeb.Gettext, only: [gettext: 1]
  import Gettext, only: [with_locale: 2]
  alias PhxI18nExampleWeb.Endpoint

  @locale_changes "locale-changes"

  def mount(%{locale: locale}, socket) do
    Endpoint.subscribe(@locale_changes)
    socket = assign(socket, locale: locale)
    {:ok, socket}
  end

  def render(assigns) do
    ~L"""
    <%= with_locale(@locale, fn -> %>
      <title>
        <%= gettext("Multilingualisation in Phoenix") %>
      </title>
    <% end) %>
    """
  end

  def handle_info(%{event: "change-locale", payload: %{locale: locale}}, socket) do
    socket = assign(socket, :locale, locale)
    {:noreply, socket}
  end
end
```

![TitleLive Events][]

- As you can see, the `mount/1` and `handle_info/2` functions are identical to
  `PageView`: they both subscribe to the `@locale_changes` channel and
  specifically handle `"change-locale"` messages to change their own locales
- For `render/1`, though, because there is not much code, we will render it
  inline rather than create a new template just for the `<title>` tag
- When I initially wrote the inline template, I figured that I could get away
  with leaving the `<title>` tag in `app.html.eex`, and just render the
  `gettext` macro, since that's the only thing that changes. However, a LiveView
  _must contain at least one HTML tag_ in order to render, so just be aware of
  that gotcha

Let's now create our last, and busiest, LiveView: `LanguageDropdownLive`.

**`lib/phx_i18n_example_web/live/language_dropdown_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLive do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, LanguageDropdownView}

  @locales Gettext.known_locales(PhxI18nExampleWeb.Gettext)
  @locale_changes "locale-changes"
  @dropdown_changes "dropdown-changes"

  def mount(%{locale: locale}, socket) do
    Endpoint.subscribe(@dropdown_changes)
    socket = init_dropdown_state(socket, locale)
    {:ok, socket}
  end

  def render(assigns) do
    LanguageDropdownView.render("language_dropdown.html", assigns)
  end

  # Event handling code will go here...

  defp init_dropdown_state(socket, locale) do
    selectable_locales = List.delete(@locales, locale)

    assign(
      socket,
      %{
        locale: locale,
        selectable_locales: selectable_locales,
        show_available_locales: false
      }
    )
  end
end
```

For the time-being, we will leave out any event handling code, and instead
gradually add it in as we look through the templates that will fire off the
events that `LanguageDropdownLive` needs to handle. The major points we need to
know about at this stage are:

- `LanguageDropdownLive` subscribes to the `@dropdown_changes` channel, since
  clicks could occur within itself, outside of the actual dropdown menu, as well
  as from `PageLive`, that would necessitate it to close the dropdown menu
- We have also set up a `@locale_changes` channel, that we will broadcast on to
  let `PageLive` and `TitleLive` know about locale changes, and which we will
  use in an event handler soon
- On `mount`, the `init_dropdown_state/2` function is called to...initialise the
  dropdown state. Note that we have _brought back_ the `show_available_locales`
  attribute that we initially _got rid of_ when we migrated from client-server
  to Javascript. It is now back to being a part of the overall language dropdown
  state, and so we need to deal with it here in the LiveView

## A Quick Styling Detour

The re-emergence of `show_available_locales` affects the way we deal with
the Tachyons styling, so we will make a quick detour to handle re-writing of the
`LanguageDropdownView` and `LanguageDropdownStyle` files to re-incorporate
the `show_available_locales` attribute:

**`lib/phx_i18n_example_web/views/language_dropdown_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownView do
  use PhxI18nExampleWeb, :view
  alias PhxI18nExampleWeb.LanguageDropdownStyle
  alias __MODULE__, as: LanguageDropdownView

  @locale_strings %{
    "en" => "English",
    "it" => "Italiano",
    "ja" => "日本語"
  }

  defdelegate caret, to: LanguageDropdownStyle
  defdelegate current_selection(show_available_locales), to: LanguageDropdownStyle
  defdelegate dropdown_container, to: LanguageDropdownStyle
  defdelegate dropdown_list(show_available_locales), to: LanguageDropdownStyle
  defdelegate dropdown_list_item, to: LanguageDropdownStyle

  def locale_string(locale), do: @locale_strings[locale]
end
```

**`lib/phx_i18n_example_web/views/styles/language_dropdown_style.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownStyle do
  @caret_classes ~w[
    absolute
    ml2
  ] |> Enum.join(" ")

  @current_selection_classes ~w[
    b--white
    ba
    br2
    pa2
    pointer
    tc
    w4
  ]

  @current_selection_border_radius_classes "br--top"

  @current_selection_link_classes ~w[
    no-underline
    white
  ] |> Enum.join(" ")

  @dropdown_container_classes ~w[
    center
    f3
    flex
    h3
    items-center
    justify-end
    w-90
  ] |> Enum.join(" ")

  @dropdown_list_classes ~w[
    absolute
    b--white
    bb
    bl
    br
    br--bottom
    br2
    items-center
    list
    mt5
    pl0
    pointer
    pr0
    pt1
    tc
    top-0
    w4
  ]

  @dropdown_show_classes ~w[
    flex
    flex-column
  ] |> Enum.join(" ")

  @dropdown_hide_classes "dn"

  @dropdown_list_item_classes ~w[
    hover-bg-white
    hover-dark-pink
    ph1
    pv2
    pt0
    w-100
  ] |> Enum.join(" ")

  @dropdown_list_item_link_classes ~w[
    no-underline
    w-100
    white
  ] |> Enum.join(" ")

  def caret, do: @caret_classes

  def current_selection(show_available_locales) do
    display_classes =
      if show_available_locales do
        [@current_selection_border_radius_classes | @current_selection_classes]
      else
        @current_selection_classes
      end

    Enum.join(display_classes, " ")
  end

  def current_selection_link, do: @current_selection_link_classes

  def dropdown_container, do: @dropdown_container_classes

  def dropdown_list(show_available_locales) do
    display_classes =
      if show_available_locales do
        [@dropdown_show_classes | @dropdown_list_classes]
      else
        [@dropdown_hide_classes | @dropdown_list_classes]
      end

    Enum.join(display_classes, " ")
  end

  def dropdown_list_item, do: @dropdown_list_item_classes
  def dropdown_list_item_link, do: @dropdown_list_item_link_classes
end
```

## Language Dropdown Event Handling

Back to our scheduled event handling programming. Let's dive straight into the
language dropdown template:

**`lib/phx_i18n_example_web/templates/language_dropdown/language_dropdown.html.leex`**

```elixir
<div class="<%= dropdown_container() %>" phx-click="hide">
  <%= render LanguageDropdownView,
             "_current_locale.html",
             locale: @locale,
             show_available_locales: @show_available_locales %>
  <ul class="<%= dropdown_list(@show_available_locales) %>">
    <%= render_many @selectable_locales,
                    LanguageDropdownView,
                    "_locale_list_item.html",
                    as: :locale %>
  </ul>
</div>
```

- As expected, the language dropdown template is now a `.leex` file since it is
  being rendered by a LiveView
- The full set of dropdown state that was set in the `socket` is on display
  here, with the `@locale` and `@show_available_locales` attributes now being
  passed into the `_current_locale.html` partial, and `@selectable_locales` now
  being used to determine what locales need to have `_locale_list_items.html`
  partials rendered for them, rather than a `selectable_locales/0` view function
  that we used previously
- Notice that the partials are being `render`-ed "normally", as in, they are not
  being `live_render`ed. This is because the partials are not meant to be run in
  a separate process to the parent template and they are essentially "a part" of
  the parent template itself, and hence are automatically "live rendered".
  [Nested LiveViews][] are possible, but that is not what is occurring in this
  case

We can see the first event that `LanguageDropdownLive` needs to handle is a
`"hide"` event, occurring whenever somewhere in the template that is not the
dropdown menu is clicked, so let's write the function to handle that:

**`lib/phx_i18n_example_web/live/language_dropdown_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLive do
  # ...

  def handle_event("hide", _value, socket) do
    socket = assign(socket, :show_available_locales, false)
    {:noreply, socket}
  end

  # ...
end
```

![LanguageDropdownLive Hide Event][]

Okay, first event handled! Let's now see what the `_current_locale.html` needs
us to do:

**`lib/phx_i18n_example_web/templates/language_dropdown/_current_locale.html.eex`**

```elixir
<p class="<%= current_selection(@show_available_locales) %>"
   name="current_locale"
   id="<%= @locale %>"
   phx-click="toggle"
   phx-hook="currentLocale">
  <span><%= locale_string(@locale) %></span>
  <span class="<%= caret() %>">▾</span>
</p>
```

Compared to before, the `<p>` tag now:

- has an `id` attribute containing the `@locale` passed into it from its parent
  template
- fires a `"toggle"` message when clicked
- has a binding to a hook named `"currentLocale"`

Let's handle the message first, and then the hook.

**`lib/phx_i18n_example_web/live/language_dropdown_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLive do
  # ...

  def handle_event("toggle", _value, socket) do
    %{assigns: %{show_available_locales: show_available_locales}} = socket
    socket = assign(socket, :show_available_locales, !show_available_locales)
    {:noreply, socket}
  end

  # ...
end
```

To handle the `"toggle"` message, we take the current value of the
`show_available_locales` attribute from the `socket`, flip the value, and then
re-assign it back to the socket.

![LanguageDropdownLive Toggle Event][]

## Hooks

LiveView provides life-cycle callback functions to handle custom client-side
Javascript when an element is added, updated, or removed by the server. In our
case, we are going to want to use two of those callback functions, `mounted` and
`updated`, for the exact same purpose:

**`assets/js/app.js`**

```js
// ...

import { Socket } from "phoenix"
import LiveSocket from "phoenix_live_view"
import { Cookie } from "./cookie"

const Hooks = {
  currentLocale: {
    mounted() {
      Cookie.set(this.el.id)
      // Clear params in case the locale was originally set using them.
      window.history.replaceState({}, document.title, "/")
    },
    updated() {
      Cookie.set(this.el.id)
    }
  }
}

let liveSocket = new LiveSocket("/live", Socket, { hooks: Hooks })
liveSocket.connect()
```

- In the `mounted()` callback, executed when the current locale has been mounted
  into the DOM (eg when first opening the application or after a page refresh),
  we are able to access the `<p>` tag element from `_current_locale.html.eex`
  itself in by calling `this.el`.  Since we set an `id` attribute on the `<p>`
  tag containing the current locale, we can access it using `this.el.id`.
- Since we have not explicitly disallowed setting the locale by params, but we
  do not want them to hang around after mounting, we clear them out using
  [`History.replaceState`][]
- Since we want to make sure that the locale is stored in cookies on _every_
  locale change, which could happen during a mount (application first starts),
  and an update (locale is selected from the dropdown menu), we set the cookie
  in the `updated()` callback as well
- Make sure you pass a `{ hooks: Hooks }` options object to `LiveSocket` in
  order to initialise the hooks

The Javascript to set the cookie looks like the following:

**`assets/js/cookie.js`**

```js
export { Cookie }

const Cookie = (document => {
  const NAME = "phxi18nexamplelanguage"

  return { set: set }

  function set(locale) {
    document.cookie = `${NAME}=${locale}; expires=${expires()}`
  }

  function expires() {
    let expiry = new Date()
    // Set expiry to ten days
    expiry.setDate(expiry.getDate() + 10)
    return expiry.toGMTString()
  }
})(document)
```

For some reason, it took me longer than expected to get the
[`Document.cookie`][] code working properly. Setting the cookie did not seem to
work unless its name _only_ contained letters and numbers, and no other
characters. Maybe you will have better luck if you decide to re-write any of
this code.

## Passing Values in Bindings

Back in Elixir-land, we now need to look at what messages should sent when a
locale in the language dropdown menu gets clicked:

**`lib/phx_i18n_example_web/templates/language_dropdown/_locale_list_item.html.eex`**

```elixir
<li class="<%= dropdown_list_item() %>"
    id="<%= @locale %>"
    role="selectable_locale"
    phx-click="locale-changed"
    phx-value-locale="<%= @locale %>">
  <%= locale_string(@locale) %>
</li>
```

When a locale is clicked, it fires a `"locale-changed"` message, and in order to
tell the LiveView _what_ the new locale should be, it uses a `phx-value-`
prefixed attribute called, unsurprisingly, `locale`. So, let's handle this
message and parameter in `LanguageDropdownLive`:

**`lib/phx_i18n_example_web/live/language_dropdown_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLive do
  # ...

  def handle_event("locale-changed", %{"locale" => locale}, socket) do
    Endpoint.broadcast_from(self(), @locale_changes, "change-locale", %{locale: locale})
    socket = init_dropdown_state(socket, locale)
    {:noreply, socket}
  end

  # ...
end
```

- Here, we get told that "the locale has changed" (passive voice), at which
  point we broadcast out to anything that is listening on the `@locale_changes`
  channel that they should "change their locale" (active voice) to the specified
  `locale` value
- Then, we re-use the `init_dropdown_state/2` function, that we also used in
  `mount/2`, to reset the language dropdown menu to its initial state, and
  re-render it

![LanguageDropdownLive Locale Changed Event][]

The final message that `LanguageDropdownLive` needs to deal with, is the
`"hide-dropdown"` message that it would receive when a click is registered on
`PageLive`. The implementation for this is the same as handling the `"hide"`
message we did earlier, so let's just include it in for the final version of the
full `LanguageDropdownLive` code:

**`lib/phx_i18n_example_web/live/language_dropdown_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLive do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, LanguageDropdownView}

  @locales Gettext.known_locales(PhxI18nExampleWeb.Gettext)
  @locale_changes "locale-changes"
  @dropdown_changes "dropdown-changes"

  def mount(%{locale: locale}, socket) do
    Endpoint.subscribe(@dropdown_changes)
    socket = init_dropdown_state(socket, locale)
    {:ok, socket}
  end

  def render(assigns) do
    LanguageDropdownView.render("language_dropdown.html", assigns)
  end

  def handle_event("hide", _value, socket) do
    socket = assign(socket, :show_available_locales, false)
    {:noreply, socket}
  end

  def handle_event("toggle", _value, socket) do
    %{assigns: %{show_available_locales: show_available_locales}} = socket
    socket = assign(socket, :show_available_locales, !show_available_locales)
    {:noreply, socket}
  end

  def handle_event("locale-changed", %{"locale" => locale}, socket) do
    Endpoint.broadcast_from(self(), @locale_changes, "change-locale", %{
      locale: locale
    })

    socket = init_dropdown_state(socket, locale)
    {:noreply, socket}
  end

  def handle_info(%{event: "hide-dropdown"}, socket) do
    socket = assign(socket, :show_available_locales, false)
    {:noreply, socket}
  end

  defp init_dropdown_state(socket, locale) do
    selectable_locales = List.delete(@locales, locale)

    assign(
      socket,
      %{
        locale: locale,
        selectable_locales: selectable_locales,
        show_available_locales: false
      }
    )
  end
end
```

We have now completed our LiveView implementation, and the application's final
form :tada:! Open up a browser and give it and try, and hopefully you should
see or feel no discernable difference between the Javascript takeover version of
the application and the LiveView version.

You can find the code for this iteration of the application in this post's
[companion Github repo][phx_i18n_example] on the [`04-liveview` branch][].
The branch is also deployed [here][phx-i18n-04-liveview] in its own environment.

## Conclusion

So, after all this, was using LiveView to implement locale switching worth it?
As a toy application to learn all about and get more of an intuitive feel for
LiveView, absolutely! How about a production application? Now that I have spent
so much time on this application, chances are the next time I do a LiveView
project, development may not take me quite as long, so, maybe! Is it overkill
for functionality like locale switching, which will likely be done very rarely?
Probably!

Regardless of the actual value of this example application, I think that on my
next Phoenix project, where possible, I will very likely be reaching for
LiveView first before Javascript, and only resort to the Javascript when I hit
the limits of what LiveView is able to do, wherever they happen to be.

## Update (18 January 2020)

It was brought to my attention that the application, as it stands, has a bit of
an issue. Open up the application in two separate browsers and see if you can
spot it.

![PubSub Static Channel Issue][]

That's right: if you change the locale in one browser, then the locale changes
for _every_ client that is using the application. If we are using the
application at the same time, I really should not be able to control what
language you are viewing, and vice versa.

Furthermore, the language dropdown menu itself is not aware of what is going on
because it is not listening out for locale-change events; it believes that _it_
is the sole source of locale-change events, and not some other parallel-universe
language dropdown menu that is reaching across its barrier and pulling the
language rug out from underneath it.

So, what is the cause of this issue?

## Static PubSub Channels

Currently, all the LiveView files are broadcasting and subscribing to exactly
the same static channels. For example:

**`lib/phx_i18n_example_web/live/language_dropdown_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLive do
  # ...

  @locale_changes "locale-changes"
  @dropdown_changes "dropdown-changes"

  def mount(%{locale: locale}, socket) do
    Endpoint.subscribe(@dropdown_changes)
    # ...
  end

  # ...

  def handle_event("locale-changed", %{"locale" => locale}, socket) do
    Endpoint.broadcast_from(self(), @locale_changes, "change-locale", %{
      locale: locale
    })
    # ..
  end

  # ...
end
```

`Endpoint.subscribe/1` and `Endpoint.broadcast_from/4` are using only the static
string channel names defined in the `@locale_changes` and `@dropdown_changes`
module attributes. Consequently, all clients are subscribing and broadcasting
message changes to the same channel, resulting in all the unexpected state
sharing issues.

## Arbitrary User IDs

This kind of behaviour might be desired in some situations, but for this
application, we want PubSub actions to be siloed to specific users: channel
names should look something like `@locale_changes <> id`, where `id`
is some identifier unique to the browser client or user, so that PubSub messages
and updates would only apply for that client/user.

In some Phoenix applications, this could take the form of the database ID of a
`User` or `Account`, but for something as trivial as this application, we do not
have a concept of "users" or "accounts".

So, in the absence of database-backed users with unique IDs, let's create the
next best thing with the lowest barrier to entry, and arbitrarily assign a
unique "`user_id`" to each application browser connection. We will need this ID
in both the `conn` and the `session` to make sure all the application LiveViews
can utilise it. So, let's handle the `user_id` problem in a similar way to how
we handled the `locale`: generate it in a Plug.

First, tell the router that we will use a `UserIdPlug` in the `browser`
pipeline:

**`lib/phx_i18n_example_web/router.ex`**

```elixir
defmodule PhxI18nExampleWeb.Router do
  use PhxI18nExampleWeb, :router
  alias PhxI18nExampleWeb.{LocalePlug, UserIdPlug}

  pipeline :browser do
    # ...
    plug UserIdPlug
    plug LocalePlug
  end

  # ...
end
```

Next define the plug: generate a random ID and assign it to the `conn` and the
`session`:

**`lib/phx_i18n_example_web/plugs/user_id_plug.ex`**

```elixir
defmodule PhxI18nExampleWeb.UserIdPlug do
  alias Plug.Conn
  @behaviour Plug

  @num_bytes 16

  @impl Plug
  def init(_opts), do: nil

  @impl Plug
  def call(conn, _opts) do
    random_id = generate_random_id()

    conn
    |> Conn.assign(:user_id, random_id)
    |> Conn.put_session(:user_id, random_id)
  end

  defp generate_random_id do
    @num_bytes
    |> :crypto.strong_rand_bytes()
    |> Base.encode64()
  end
end
```

Then, provide the `user_id` to the LiveView `session`:

**`lib/phx_i18n_example_web/router.ex`**

```elixir
defmodule PhxI18nExampleWeb.Router do
  # ...

  scope "/", PhxI18nExampleWeb do
    pipe_through :browser
    live "/", PageLive, session: [:locale, :user_id]
  end
end
```

The `user_id` is now available in `PageLive` via the `session`, and in
the `app.html.eex` layout via the `conn`, so we can pass it off to `TitleLive`
and `LanguageDropdownLive`. Let's first make sure that the LiveViews rendered
from the layout get given a `user_id`:

**`lib/phx_i18n_example_web/templates/layout/app.html.eex`**

```elixir
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
    <%= live_render @conn,
                    TitleLive,
                    session: %{locale: @locale, user_id: @user_id} %>
    <!-- ... -->
  </head>
  <body class="<%= body() %>">
    <%= live_render @conn,
                    LanguageDropdownLive,
                    session: %{locale: @locale, user_id: @user_id} %>
    <!-- ... -->
  </body>
</html>
```

Now, for each LiveView, add the `user_id` to the static PubSub channel names,
as well as make any other minor adjustments to make everything work:

**`lib/phx_i18n_example_web/live/title_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.TitleLive do
  # ...

  @locale_changes "locale-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@locale_changes <> user_id)
    socket = assign(socket, :locale, locale)
    {:ok, socket}
  end

  # ...
end
```

**`lib/phx_i18n_example_web/live/language_dropdown_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLive do
  # ...
  @locale_changes "locale-changes:"
  @dropdown_changes "dropdown-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@dropdown_changes <> user_id)
    state = init_state(locale, user_id)
    socket = assign(socket, state)
    {:ok, socket}
  end

  # ...

  def handle_event("locale-changed", %{"locale" => locale}, socket) do
    Endpoint.broadcast_from(
      self(),
      @locale_changes <> socket.assigns.user_id,
      "change-locale",
      %{locale: locale}
    )

    state = init_dropdown_state(locale)
    socket = assign(socket, state)
    {:noreply, socket}
  end

  defp init_state(locale, user_id) do
    Map.merge(
      %{user_id: user_id},
      init_dropdown_state(locale)
    )
  end

  defp init_dropdown_state(locale) do
    selectable_locales = List.delete(@locales, locale)

    %{
      locale: locale,
      selectable_locales: selectable_locales,
      show_available_locales: false
    }
  end
end
```

**`lib/phx_i18n_example_web/live/page_live.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLive do
  # ...

  @locale_changes "locale-changes:"
  @dropdown_changes "dropdown-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@locale_changes <> user_id)
    socket = assign(socket, locale: locale, user_id: user_id)
    {:ok, socket}
  end

  def handle_event("hide-dropdown", _value, socket) do
    Endpoint.broadcast_from(
      self(),
      @dropdown_changes <> socket.assigns.user_id,
      "hide-dropdown",
      %{}
    )

    {:noreply, socket}
  end

  def handle_info(%{event: "change-locale", payload: payload}, socket) do
    socket = assign(socket, :locale, payload.locale)
    {:noreply, socket}
  end
end
```

Note that `user_id` is deliberately not passed into the `socket` in `TitleLive`,
since it is only ever used in `mount/2` when setting up its subscriptions, as
opposed to the other LiveViews which need the `user_id` when they send out
broadcasts.

Now, when you use the application with multiple browsers, you should see that it
works as expected:

![PubSub Static Channel Issue Fixed][]

You can find the code for this iteration of the application in this post's
[companion Github repo][phx_i18n_example] on the [`05-liveview-fix` branch][].
The branch is also deployed [here][phx-i18n-05-liveview-fix] in its own
environment.

Follow the next steps of this application's journey in _[Internationalisation
with Phoenix LiveComponents][]_!

[`01-client-server` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/01-client-server
[01-client-server Implementation]: /assets/images/2019-11-03/01-client-server.gif "Client-Server Implementation"
[`02-js-sprinkles` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/02-js-sprinkles
[02-js-sprinkles Implementation]: /assets/images/2019-11-03/02-js-sprinkles.gif "Javascript Sprinkles Implementation"
[`03-js-takeover` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/03-js-takeover
[03-js-takeover Implementation]: /assets/images/2019-11-03/03-js-takeover.gif "Javascript Takeover Implementation"
[`04-liveview` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/04-liveview
[`05-liveview-fix` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/05-liveview-fix
[AJAX]: https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started
[`Document.cookie`]: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
[Ecto]: https://github.com/elixir-ecto/ecto
[Elixir]: https://elixir-lang.org/
[Elixir Gettext]: https://github.com/elixir-gettext/gettext
[Elixir Plug]: https://github.com/elixir-plug/plug
[Elm]: http://elm-lang.org/
[Elm I18n Example]: https://github.com/paulfioravanti/elm-i18n-example
[Elm I18n Example Demo]: https://elm-i18n-example.herokuapp.com/
[Full Screen Centered Title component documentation page]: http://tachyons.io/components/layout/full-screen-centered-title/index.html
[gettext]: https://www.gnu.org/software/gettext/
[`Gettext.get_locale/0`]: https://hexdocs.pm/gettext/Gettext.html#get_locale/0
[`Gettext.put_locale/1`]: https://hexdocs.pm/gettext/Gettext.html#put_locale/1
[`Gettext.with_locale/2`]: https://hexdocs.pm/gettext/Gettext.html#with_locale/2
[GIF Pronunciation]: https://en.wikipedia.org/wiki/GIF#Pronunciation_of_GIF
[GlobalEventHandlers.onclick]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick
[`History.replaceState`]: https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
[HTML]: https://developer.mozilla.org/en-US/docs/Web/HTML
[I18n Application]: /assets/images/2019-11-03/i18n-application.gif "Internationalisation Application"
[IIFE]: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
[Internationalisation with Phoenix LiveComponents]: https://www.paulfioravanti.com/blog/internationalisation-with-phoenix-live-components/
[Internationalisation with Phoenix Live Layouts]: https://www.paulfioravanti.com/blog/internationalisation-with-phoenix-live-layouts/
[Internationalization naming]: https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming
[Javascript]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Javascript object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
[JS Interop and client controlled DOM]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#module-js-interop-and-client-controlled-dom
[LanguageDropdownLive Hide Event]: /assets/images/2019-11-03/language-dropdown-live-hide-event.jpg "LanguageDropdownLive Hide Event"
[LanguageDropdownLive Locale Changed Event]: /assets/images/2019-11-03/language-dropdown-live-locale-changed-event.jpg "LanguageDropdownLive Locale Changed Event"
[LanguageDropdownLive Toggle Event]: /assets/images/2019-11-03/language-dropdown-live-toggle-event.jpg "LanguageDropdownLive Toggle Event"
[LiveView Messages]: /assets/images/2019-11-03/live-view-messages.jpg "Inter-LiveView Messaging"
[LiveView Summary]: /assets/images/2019-11-03/live-view-summary.jpg "LiveView Summary"
[Nested links are illegal]: https://www.w3.org/TR/html401/struct/links.html#h-12.2.2
[Nested LiveViews]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#module-nested-liveviews
[Node]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[Object.freeze()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
[PageLive Events]: /assets/images/2019-11-03/page-live-events.jpg "PageLive Events"
[Phoenix]: https://phoenixframework.org/
[Phoenix Channel]: https://hexdocs.pm/phoenix/channels.html
[`Phoenix.Endpoint.broadcast_from/4`]: https://hexdocs.pm/phoenix/Phoenix.Endpoint.html#c:broadcast_from/4
[`Phoenix.Endpoint.subscribe/2`]: https://hexdocs.pm/phoenix/Phoenix.Endpoint.html#c:subscribe/2
[Phoenix LiveView]: https://github.com/phoenixframework/phoenix_live_view
[`Phoenix.LiveView.handle_event/3`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#c:handle_event/3
[`Phoenix.LiveView.handle_info/2`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#c:handle_info/2
[`Phoenix.LiveView.mount/2`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#c:mount/2
[`Phoenix.LiveView.render/1`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#c:render/1
[Phoenix LiveView README]: https://github.com/phoenixframework/phoenix_live_view/blob/master/README.md
[`Phoenix.LiveView.Socket`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.Socket.html
[`Phoenix.LiveView.Router.live/3`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.Router.html#live/3
[`Phoenix.LiveView.render/3`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#live_render/3
[Phoenix PubSub]: https://github.com/phoenixframework/phoenix_pubsub
[Phoenix Routing Pipelines]: https://hexdocs.pm/phoenix/routing.html#pipelines
[`Phoenix.View.render_many/4`]: https://hexdocs.pm/phoenix/Phoenix.View.html#render_many/4
[`Phoenix.View.render/3`]: https://hexdocs.pm/phoenix/Phoenix.View.html#render/3
[phx-i18n-01-client-server]: https://phx-i18n-01-client-server.herokuapp.com/
[phx-i18n-02-js-sprinkles]: https://phx-i18n-02-js-sprinkles.herokuapp.com/
[phx-i18n-03-js-takeover]: https://phx-i18n-03-js-takeover.herokuapp.com/
[phx-i18n-04-liveview]: https://phx-i18n-04-liveview.herokuapp.com/
[phx-i18n-05-liveview-fix]: https://phx-i18n-05-liveview-fix.herokuapp.com/
[phx_i18n_example]: https://github.com/paulfioravanti/phx_i18n_example
[`Plug.Conn.put_session/3`]: https://hexdocs.pm/plug/Plug.Conn.html#put_session/3
[PubSub Static Channel Issue]: /assets/images/2019-11-03/pubsub-static-channel-issue.gif "PubSub Static Channel Issue"
[PubSub Static Channel Issue Fixed]: /assets/images/2019-11-03/pubsub-static-channel-issue-fixed.gif "PubSub Static Channel Issue Fixed"
[Query string]: https://en.wikipedia.org/wiki/Query_string
[Runtime Language Switching in Elm]: https://www.paulfioravanti.com/blog/internationalisation-with-phoenix-liveview/
[Tachyons]: http://tachyons.io/
[Tachyons Elm]: /assets/images/2019-11-03/tachyons-elm.gif "Animated GIF of Tachyons page implemented in Elm"
[TitleLive Events]: /assets/images/2019-11-03/title-live-events.jpg "TitleLive Events"
