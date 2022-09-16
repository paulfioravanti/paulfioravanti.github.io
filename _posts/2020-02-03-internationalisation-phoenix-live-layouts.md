---
redirect_from:
  - /blog/2020/02/03/internationalisation-with-phoenix-live-layouts/
  - /blog/internationalisation-with-phoenix-live-layouts/
title: "Internationalisation with Phoenix Live Layouts"
date: 2020-02-03 17:00 +1100
last_modified_at: 2020-11-01 22:00 +1100
tags: elixir phoenix liveview live-components live-layout i18n japanese italian 日本語 italiano
header:
  image: /assets/images/2020-02-03/kyle-glenn-nXt5HtLmlgE-unsplash.jpg
  image_description: "desk globe on table"
  teaser: /assets/images/2020-02-03/kyle-glenn-nXt5HtLmlgE-unsplash.jpg
  overlay_image: /assets/images/2020-02-03/kyle-glenn-nXt5HtLmlgE-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Kyle Glenn](https://unsplash.com/@kylejglenn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/s/photos/international?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
badges:
  - image: https://img.shields.io/badge/Elixir%20Weekly-%23187-blueviolet.svg
    alt: "Elixir Weekly #187"
    link: https://elixirweekly.net/issues/187
  - image: https://img.shields.io/badge/Elixir%20Weekly-%23210-blueviolet.svg
    alt: "Elixir Weekly #210"
    link: https://elixirweekly.net/issues/210
excerpt: >
  Phoenix layouts are now live-powered, giving LiveViews more flexibility and
  control over a template's surrounding content.
---

This blog post is the third in a series on the creation of a small
[I18n][Internationalization Naming] application using [Phoenix LiveView][],
which updates page content based on the language chosen from a dropdown menu:

1. _[Internationalisation with Phoenix LiveView][]_
2. _[Internationalisation with Phoenix LiveComponents][]_
3. _Internationalisation with Phoenix Live Layouts_

{: refdef: style="text-align: center;"}
![I18n Application][]
{: refdef}

[LiveView version 0.5.0][] introduced [Live Layouts][], a mechanism that allows
LiveViews to move view-specific layout code into separate sub-layout files.
This enables an individual LiveView's template to nest itself within content
that can dynamically update.

We will continue developing the application where we left off from the end of
_[Internationalisation with Phoenix LiveComponents][]_, which is its state on
the [`08-live-stateful-0-6` branch][] of the [phx_i18n_example][] Github
repository. That branch does not use Live Layouts, so we will see what the
issues are with _not_ using them, and then proceed to implement them.

If you do not have the repository already, just run these commands and it shall
find its way to you:

```sh
git clone git@github.com:paulfioravanti/phx_i18n_example.git
cd phx_i18n_example
git checkout 08-live-stateful-0-6
```

> The software versions used for this version of the application are the
> following:
>
> - Elixir: 1.10.0
> - Erlang: 22.2.1
> - Phoenix: 1.4.12
> - Gettext: 0.17.4
> - LiveView: 0.6.0
> - Node: 13.6.0
> - Tachyons: 4.11.1

## Current State of Play

There are three LiveViews in the application, each operating independently,
containing their own [LiveComponent][], and communicating with each other by
[PubSub][Phoenix PubSub] where needed:

![LiveView Summary][]

`LanguageDropdownLiveView` and `TitleLiveView` are live rendered from the
(static) layout:

**`lib/phx_i18n_example_web/templates/layout/app.html.eex`**

```elixir
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
    <%= live_render @conn,
                    TitleLiveView,
                    session: %{"locale" => @locale, "user_id" => @user_id} %>
    <!-- ... -->
  </head>
  <body class="<%= body() %>">
    <%= live_render @conn,
                    LanguageDropdownLiveView,
                    session: %{"locale" => @locale, "user_id" => @user_id} %>
    <main role="main">
      <%= render @view_module, @view_template, assigns %>
    </main>
  </body>
</html>
```

## The Problem

For the application in its current form, this presents no issue. However, what
if we wanted to add another routed LiveView (a LiveView used from `router.ex`)
to the application to complement `PageLiveView`? What if we wanted to have this
new LiveView set its own page title, or what if its content did not need to be
internationalised, and hence we would not need the language dropdown menu to
display?

The `app.html.eex` file is the main layout template within which all other
template content is embedded, which means that any new LiveView would not
have any control over the content that surrounds its template code:

- its title would be set according to whatever `TitleLiveView` renders, rather
  than being able to provide its own page title logic
- `LanguageDropdownLiveView` will always be rendered (meaning also that the new
  LiveView would have to unnecessarily implement handlers for the
  `"change-locale"` events that the dropdown menu emits)

So, let's set about giving our routed LiveView, in this case `PageLiveView`,
more control over its surrounding content, starting with the page title.

## LiveView-Controlled Page Title Updates

With LiveView 0.5.0, [updating the HTML document title][] of a page becomes
possible through _specific use_ of an assigns variable called `@page_title`.
Normally, the content of `app.html.eex`, or any non-`.leex` template, cannot be
dynamically changed. But, Phoenix LiveView special-cases the page title,
enabling a LiveView module to set the page title in
[`Phoenix.LiveView.mount/3`][], and update it in any event handling callback
functions.

So, in the layout, let's switch out `TitleLiveView` for `@page_title`:

**`lib/phx_i18n_example_web/templates/layout/app.html.eex`**

```elixir
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
     <title><%= @page_title %></title>
    <!-- ... -->
  </head>
  <!-- ... -->
</html>
<!DOCTYPE html>
```

Now, in `PageLiveView`, let's initialise the `page_title` assigns in `mount/3`,
and update its value when the locale changes (ie we receive an external
`"change-locale"` PubSub message):

**`lib/phx_i18n_example_web/live/views/page_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveView do
  # ...
  require Gettext
  require PhxI18nExampleWeb.Gettext

  @title "Multilingualisation in Phoenix"
  @locale_changes "locale-changes:"

  def mount(
        %{} = _params,
        %{"locale" => locale, "user_id" => user_id},
        socket
      ) do
    Endpoint.subscribe(@locale_changes <> user_id)

    socket =
      assign(
        socket,
        locale: locale,
        user_id: user_id,
        page_title: page_title(locale)
      )

    {:ok, socket}
  end

  # ...

  def handle_info(
        %{event: "change-locale", payload: %{locale: locale}},
        socket
      ) do
    send_update(PageLiveComponent, id: :page, locale: locale)
    socket = assign(socket, locale: locale, page_title: page_title(locale))
    {:noreply, socket}
  end

  defp page_title(locale), do: Gettext.with_locale(locale, &title/0)
  defp title, do: PhxI18nExampleWeb.Gettext.gettext(@title)
end
```

You should now see that the application continues to work as expected.

Just by virtue of setting and updating the `page_title` assigns value, Phoenix
does all the heavy lifting of dynamically updating the `@page_title` module
attribute. `PageLiveView` now has complete control over the page title when its
template is rendered, which means the `TitleLiveView` and `TitleLiveComponent`
modules have become completely obsolete. So, we can reduce our maintenance
burden by removing them entirely. Hurray!

## Live Layouts

Let's now move our focus over to enabling LiveViews to choose whether they want
to display a language selection dropdown menu or not, by extracting code for it
into a separate layout.

We will start by removing the call to live render the `LanguageDropdownLiveView`
from the main layout's `<body>` tag:

**`lib/phx_i18n_example_web/templates/layout/app.html.eex`**

```elixir
<!DOCTYPE html>
<html lang="en">
  <!-- ... -->
  <body class="<%= body() %>">
    <%= render @view_module, @view_template, assigns %>
  </body>
</html>
```

That code will now go directly inside a new page Live Layout file (note the
`.leex` filename):

**`lib/phx_i18n_example_web/templates/layout/page.html.leex`**

```elixir
<%= live_render @socket,
                LanguageDropdownLiveView,
                id: :language_dropdown,
                session: %{"locale" => @locale, "user_id" => @user_id} %>
<main role="main">
  <%= @live_view_module.render(assigns) %>
</main>
```

In this case, the `@live_view_module` attribute refers to the `PageLiveView`
module.

Now, we need to specify that `PageLiveView` will be using this layout to wrap
its template content:

**`lib/phx_i18n_example_web/live/views/page_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveView do
  alias PhxI18nExampleWeb.{Endpoint, LayoutView, PageLiveComponent}
  use Phoenix.LiveView, layout: {LayoutView, "page.html"}
  # ...
end
```

Note that the `LayoutView` is doing double-duty here as the view file for _both_
`app.html.eex` _and_ `page.html.leex`. If we were to extract the template code
inline with the view code, it would look like this (also note the differences
in sigils used; `~E` for standard embedded Elixir templates vs `~L` for
LiveView templates):

**`lib/phx_i18n_example_web/views/layout_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.LayoutView do
  use PhxI18nExampleWeb, :view
  alias PhxI18nExampleWeb.{LanguageDropdownLiveView, LayoutStyle}

  defdelegate body, to: LayoutStyle

  def render("app.html", assigns) do
    ~E"""
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <%= csrf_meta_tag() %>
        <title><%= @page_title %></title>
        <link rel="stylesheet"
              href="<%= Routes.static_path(@conn, "/css/app.css") %>"/>
        <script type="text/javascript"
                src="<%= Routes.static_path(@conn, "/js/app.js") %>">
        </script>
      </head>
      <body class="<%= body() %>">
        <%= render @view_module, @view_template, assigns %>
      </body>
    </html>
    """
  end

  def render("page.html", assigns) do
    ~L"""
    <%= live_render @socket,
                    LanguageDropdownLiveView,
                    id: :language_dropdown,
                    session: %{"locale" => @locale, "user_id" => @user_id} %>
    <main role="main">
      <%= @live_view_module.render(assigns) %>
    </main>
    """
  end
end
```

The layout code extraction is now complete, and the application works as
expected! Or, at least I thought it did, until I tried out the specific use case
of opening the language dropdown menu, and then clicking the text on the
page, which closes it:

![Live Layout Issue][]

Looks like there is a glitch in the LiveView Matrix... Why is the open language
dropdown menu disappearing momentarily before re-appearing closed? Ultimately,
all we did was cut code from one file, and paste it in another...right?

Although I'm not entirely sure of the specifics, it looks like perhaps the
communication processes via PubSub between `PageLiveView` and
`DropdownLanguageLiveView` are clobbering each other, and thus a re-think of how
these two LiveViews and their LiveComponents talk to each other is in order, as
well as deciding whether all these LiveView modules are even needed at all.

## Too Many LiveViews?

Each of the LiveViews we had in the application at the beginning of this blog
post, `PageLiveView`, `LanguageDropdownLiveView`, and `TitleLiveView`, were like
isolated islands, functionality-wise.

![LiveView Summary][]

There was no coupling between any of them;
naturally, there was coupling between parent LiveViews and their child
LiveComponents, but not between the LiveViews themselves.

With the introduction of Live Layouts, this has changed: now, `PageLiveView`, as
well as being the parent of its own `PageLiveComponent`, is also, via the Live
Layout, the parent of `LanguageDropdownLiveView`, which renders
`LanguageDropdownLiveComponent`.

![LiveView Component Summary][]

With `TitleLiveView` gone, the only place that `LanguageDropdownLiveComponent`
needs to notify about locale changes is the `PageLiveView`, its "grandparent".
Similarly, `LanguageDropdownLiveView` would only seem to exist to let its child,
`LanguageDropdownLiveComponent`, know about any `"hide-dropdown"` messages that
it receives.

Given that the `"hide-dropdown"` messages come from `PageLiveComponent`,
wouldn't it be easier, and maybe less message-clobbery, to:

- get rid of the `LanguageDropdownLiveView` middleman
- let `LanguageDropdownLiveComponent` be `PageLiveView`'s child, rather than
  grandchild
- have `PageLiveComponent` and `LanguageDropdownLiveComponent` talk to each
  other as siblings through `PageLiveView`?

Let's find out!

## Family Tree Engineering

Okay, first thing's first, `LanguageDropdownLiveView` is now _gone_. What do we
need to do to get this working again? Let's start with `PageLiveView`'s Live
Layout, which now needs to directly render `LanguageDropdownLiveComponent`:

**`lib/phx_i18n_example_web/views/layout_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.LayoutView do
  use PhxI18nExampleWeb, :view
  alias PhxI18nExampleWeb.{LanguageDropdownLiveComponent, LayoutStyle}
  # ...
end
```

**`lib/phx_i18n_example_web/templates/layout/page.html.leex`**

```elixir
<%= live_component @socket,
                   LanguageDropdownLiveComponent,
                   id: :language_dropdown,
                   locale: @locale,
                   user_id: @user_id %>
<main role="main">
  <%= @live_view_module.render(assigns) %>
</main>
```

Now, in the `LanguageDropdownLiveComponent`, whenever we get a local
`"locale-changed"` event, rather than blast out a PubSub message, we instead
want to send that message to the now-direct parent, `PageLiveView`:

**`lib/phx_i18n_example_web/live/components/language_dropdown_live_component.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLiveComponent do
  use Phoenix.LiveComponent
  alias PhxI18nExampleWeb.LanguageDropdownView

  @locales Gettext.known_locales(PhxI18nExampleWeb.Gettext)

  # ...
  def handle_event("locale-changed", %{"locale" => locale}, socket) do
    send(self(), {:change_locale, locale})

    state = update_locale_changed_state(socket.assigns, locale)
    socket = assign(socket, state)
    {:noreply, socket}
  end
  # ...
end
```

Note here that because the LiveComponent and the LiveView run in the same
process, sending a message to `self()` [sends the message from the component to
the parent LiveView][LiveView as the source of truth].

While we are purging PubSub message passing, let's go next to `PageLiveView`'s
other child, `PageLiveComponent`, and perform a similar refactor for when it
receives `"hide-dropdown"` messages:

**`lib/phx_i18n_example_web/live/components/page_live_component.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveComponent do
  use Phoenix.LiveComponent
  alias PhxI18nExampleWeb.PageView

  # ...
  def handle_event("hide-dropdown", _value, socket) do
    send(self(), :hide_dropdown)

    {:noreply, socket}
  end
end
```

All message-passing from child LiveComponents to parent LiveViews is now being
done without PubSub. Finally, we need to make changes in the parent
`PageLiveView` to swap any PubSub-related subscription and message-handling code
for taking messages directly from children:

**`lib/phx_i18n_example_web/live/views/page_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveView do
  alias PhxI18nExampleWeb.{
    LanguageDropdownLiveComponent,
    LayoutView,
    PageLiveComponent
  }

  # ...
  def mount(
        %{} = _params,
        %{"locale" => locale, "user_id" => user_id},
        socket
      ) do
    socket =
      assign(
        socket,
        locale: locale,
        user_id: user_id,
        page_title: page_title(locale)
      )

    {:ok, socket}
  end

  # ...

  def handle_info(:hide_dropdown, socket) do
    send_update(
      LanguageDropdownLiveComponent,
      id: :language_dropdown,
      show_available_locales: false
    )

    {:noreply, socket}
  end

  def handle_info({:change_locale, locale}, socket) do
    send_update(PageLiveComponent, id: :page, locale: locale)
    socket = assign(socket, locale: locale, page_title: page_title(locale))
    {:noreply, socket}
  end
  # ...
end
```

Notice that in the `handle_info/2` functions, the parameters are now atoms or
tuples, and not the maps (eg
`%{event: "change-locale", payload: %{locale: locale}}`) that we had before.

The application should now be flicker-less when hiding an open dropdown by
clicking the page.

You can find the code for this iteration of the application in this post's
[companion Github repo][phx_i18n_example] on the [`09-live-layout` branch][].
The branch is also deployed [here][phx-i18n-09-live-layout] in its own
environment.

## Wrapping Up

The use of Live Layouts, even in this small application, has affected its
architecture greatly. It has been interesting, at least for myself as the
author, to have seen the codebase expand initially with lots of LiveViews and
LiveComponents, and now contract back as we purge half of them away.

Deleted code is the easiest kind to maintain, though, so I do not mourn for it.
Rather, I think it's great that Live Layouts have enabled more flexibility in
architecting LiveView functionality, and I look forward to using them more
moving forward!

[`08-live-stateful-0-6` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/08-live-stateful-0-6
[`09-live-layout` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/09-live-layout
[I18n Application]: /assets/images/2020-02-03/i18n-application.gif "Internationalisation Application"
[Internationalization naming]: https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming
[Internationalisation with Phoenix LiveComponents]: http://www.paulfioravanti.com/blog/internationalisation-with-phoenix-live-components/
[Internationalisation with Phoenix LiveView]: https://www.paulfioravanti.com/blog/internationalisation-with-phoenix-liveview/
[LiveComponent]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html
[Live Layout Issue]: /assets/images/2020-02-03/live-layout-issue.gif "Live Layout Issue"
[Live Layouts]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#module-live-layouts
[LiveView as the source of truth]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html#module-liveview-as-the-source-of-truth
[LiveView Component Summary]: /assets/images/2020-02-03/live-view-component-summary.jpg "LiveView Component Summary"
[LiveView Summary]: /assets/images/2020-02-03/live-view-summary.jpg "LiveView Summary"
[LiveView version 0.5.0]: https://github.com/phoenixframework/phoenix_live_view/blob/master/CHANGELOG.md#050-2020-01-15
[Phoenix LiveView]: https://github.com/phoenixframework/phoenix_live_view
[`Phoenix.LiveView.mount/3`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#c:mount/3
[Phoenix PubSub]: https://github.com/phoenixframework/phoenix_pubsub
[phx-i18n-09-live-layout]: https://phx-i18n-09-live-layout.herokuapp.com/
[phx_i18n_example]: https://github.com/paulfioravanti/phx_i18n_example
[updating the HTML document title]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#module-updating-the-html-document-title
