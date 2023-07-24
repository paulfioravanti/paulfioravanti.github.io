---
redirect_from:
  - /blog/2020/01/27/internationalisation-with-phoenix-live-components/
  - /blog/internationalisation-with-phoenix-live-components/
title: "Internationalisation with Phoenix LiveComponents"
date: 2020-01-27 10:00 +1100
last_modified_at: 2023-07-24 16:08 +1100
tags: elixir phoenix liveview live-components i18n japanese italian 日本語 italiano
header:
  image: /assets/images/2020-01-27/jason-leung-jCBzW_Q_UGI-unsplash.jpg
  image_description: "photo of assorted-color nation flags on wall during daytime"
  teaser: /assets/images/2020-01-27/jason-leung-jCBzW_Q_UGI-unsplash.jpg
  overlay_image: /assets/images/2020-01-27/jason-leung-jCBzW_Q_UGI-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Jason Leung](https://unsplash.com/@ninjason?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/s/photos/flags?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Draw the responsibility demarcation lines between your LiveView-managed state, markup, and events with
  LiveComponents.
---

This blog post is the second in a series on the creation of a small
[I18n][Internationalization Naming] application using [Phoenix LiveView][],
which updates page content based on the language chosen from a dropdown menu:

1. _[Internationalisation with Phoenix LiveView][]_
2. _Internationalisation with Phoenix LiveComponents_
3. _[Internationalisation with Phoenix Live Layouts][]_

{: refdef: style="text-align: center;"}
![I18n Application][]
{: refdef}

Development on LiveView is currently proceeding at a cracking pace, and one of
the newer additions to it is the ability to "compartmentalize state, markup, and
events in LiveView" using [LiveComponent][]. So, let's introduce LiveComponents
to the application, and see what effect it has on the codebase.

> The software versions used for this version of the application have changed
> slightly, and are now the following:
>
> - Elixir: 1.9.4
> - Erlang: 22.2.1
> - Phoenix: 1.4.11
> - Gettext: 0.17.4
> - LiveView: 0.4.1
> - Node: 13.6.0
> - Tachyons: 4.11.1

## Current State of Play

We are going to pick the application up where we left off from the end of
_[Internationalisation with Phoenix LiveView][]_, which is its state
on the [`05-liveview-fix` branch][] of the [phx_i18n_example][] Github
repository. So, if you do not have the repository already, just run these
commands and the internet shall provide it to you:

```sh
git clone git@github.com:paulfioravanti/phx_i18n_example.git
cd phx_i18n_example
git checkout 05-liveview-fix
```

## Housekeeping

### Upgrading dependencies

Before beginning, we will need to upgrade the version of LiveView being used
in the application from 0.3.1 to 0.4.1:

**`mix.exs`**

```elixir
defmodule PhxI18nExample.MixProject do
  # ...
  defp deps do
    [
      # ...
      {:phoenix_live_view, "~> 0.4.1"},
      # ...
    ]
  end
end
```

Then, upgrade the Elixir dependencies with `mix`:

```sh
mix deps.upgrade --all
```

Updating Javascript asset dependencies should not be an issue for introducing
LiveComponents, but if you do find you have front end issues, or you just need
to have all the latest packages all the time, then by all means, check what's
outdated and update to your heart's content:

```sh
npm outdated --prefix assets
```

### Enabling LiveComponent Functions

In order to use LiveComponents from LiveViews, we are going to need access to
the [`Phoenix.LiveView.Helpers.live_component/4`][] function (and its lower
[arity][] cousins), so add it to the list of LiveView-related imports:

**`lib/phx_i18n_example_web.ex`**

```elixir
defmodule PhxI18nExampleWeb do
  # ...
  def view do
    quote do
      # ...
      import Phoenix.LiveView,
        only: [
          live_render: 2,
          live_render: 3,
          live_link: 1,
          live_link: 2,
          live_component: 2,
          live_component: 3,
          live_component: 4
        ]
    end
  end
  # ...
end
```

### File Structure and Naming Changes

It would seem that there has been an informal(?) convention to name LiveView
files with a pattern of `FooLive` and `BarLive`, and place them inside a
directory called `live/` directly under the Phoenix application `web/`
directory. The application currently follows this convention.

However, with the advent of LiveComponents, we now have more than one type of
"LiveThing", with the likely potential for more "LiveThings" in the future. So,
in the absence of any set conventions, we shall:

- Move all LiveView files under a new `live/views/` directory
- Re-name all LiveView files from `FooLive` to `FooLiveView`, and change all
  of their references throughout the application (specifically, do search and
  replaces for `TitleLive` -> `TitleLiveView`, `LanguageDropdownLive` ->
  `LanguageDropdownLiveView`, and `PageLive` -> `PageLiveView`)
- Create an empty `live/components/` directory to store LiveComponent files

Once you have done that, check to see that the application still runs without
error, and you will be ready to start the actual fun component-y stuff!

## LiveComponent Flavours

There are two different officially-named types of LiveComponents: Stateless and
Stateful.

Personally, I find this naming quite confusing as both types of component do
hold some kind of state, and the difference would seem to lie rather in the
_degree of independence_ that the LiveComponent has from its parent LiveView in
updating its state, handling messages etc:

- Stateless, in diapers, is completely dependent on its parent for any changes
- Stateful is moved out of home, doing most things independently, but
  occasionally needs help from its parent for things it cannot do

Anyway, regardless of my opinions about the current naming, use of shared
language is important to convey information coherently, so Stateless and
Stateful it is.

## Update to Stateless Component

Let's first update the LiveViews to [Stateless Components][], starting with the
one that has the least amount of logic in it: the `TitleLiveView`.

It is currently responsible for:

- Setting up a subscription to locale-change messages, so it knows when it
  should change languages, and then handling those locale-change events
- Keeping track of the `locale` in its `socket`
- Rendering a LiveView template, in this case inline

At present, the code looks like this:

**`lib/phx_i18n_example_web/live/views/title_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.TitleLiveView do
  use Phoenix.LiveView
  import PhxI18nExampleWeb.Gettext, only: [gettext: 1]
  import Gettext, only: [with_locale: 2]
  alias PhxI18nExampleWeb.Endpoint

  @locale_changes "locale-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@locale_changes <> user_id)
    socket = assign(socket, :locale, locale)
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

  def handle_info(%{event: "change-locale", payload: payload}, socket) do
    socket = assign(socket, :locale, payload.locale)
    {:noreply, socket}
  end
end
```

In introducing a stateless component, we are not interested in giving the
component very much agency or responsibility: we just want to offload
view-related functionality to it, and have it render the inline template. So,
let's extract out some code into our first new LiveComponent!

**`lib/phx_i18n_example_web/live/components/title_live_component.ex`**

```elixir
defmodule PhxI18nExampleWeb.TitleLiveComponent do
  use Phoenix.LiveComponent
  import PhxI18nExampleWeb.Gettext, only: [gettext: 1]
  import Gettext, only: [with_locale: 2]

  def render(assigns) do
    ~L"""
    <%= with_locale(@locale, fn -> %>
      <title>
        <%= gettext("Multilingualisation in Phoenix") %>
      </title>
    <% end) %>
    """
  end
end
```

Not much to it, is there? Every component _does_ actually require a `mount/1`
and an `update/2` function, but LiveComponent provides default implementations
of those functions that look something like this:

```elixir
def mount(socket) do
  {:ok, socket}
end

def update(assigns, socket) do
  {:ok, assign(socket, assigns)}
end
```

If any finer-grained control over mounting and updating is needed, these
functions would need to be overridden, but for this LiveComponent, the defaults
work just fine.

Back in `TitleLiveView`, we make a call out to
[`live_component`][`Phoenix.LiveView.Helpers.live_component/4`] to spawn off
the child LiveComponent:

**`lib/phx_i18n_example_web/live/views/title_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.TitleLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, TitleLiveComponent}

  @locale_changes "locale-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@locale_changes <> user_id)
    socket = assign(socket, :locale, locale)
    {:ok, socket}
  end

  def render(assigns) do
    ~L"""
    <%= live_component @socket, TitleLiveComponent, locale: @locale %>
    """
  end

  def handle_info(%{event: "change-locale", payload: payload}, socket) do
    socket = assign(socket, :locale, payload.locale)
    {:noreply, socket}
  end
end
```

## A Quick Detour

A few things initially confused me as I was implementing this.

I thought that because the `locale` had already been assigned to the `socket`
belonging to `TitleLiveView` in `mount/2`, it would flow through automatically
to the `@socket` that gets passed into the `live_component` function. This is
because if you inspect the `@socket` in the `render/1` function like so:

```elixir
def render(assigns) do
  ~L"""
  <% IO.inspect(@socket) %>
  <%= live_component @socket, TitleLiveComponent, locale: @locale %>
  """
end
```

The output you get is:

```elixir
#Phoenix.LiveView.Socket<
  assigns: %{locale: "en", user_id: "mlZvNkbr/5DxyM9hq2TS0w=="},
  changed: %{locale: true, user_id: true},
  endpoint: PhxI18nExampleWeb.Endpoint,
  id: "phx-VwPm6nt2",
  parent_pid: nil,
  view: PhxI18nExampleWeb.PageLiveView,
  ...
>
```

So, I would have thought that the `assigns` would carry through to the `socket`
in `TitleLiveComponent`, but when I overrode the `mount/1` function there to
inspect the state of the `socket` like so:

```elixir
def mount(socket) do
  IO.inspect(socket)
  {:ok, socket}
end
```

The output was:

```elixir
#Phoenix.LiveView.Socket<
  assigns: %{},
  changed: %{locale: true, user_id: true},
  endpoint: PhxI18nExampleWeb.Endpoint,
  id: "phx-VwPm6nt2",
  parent_pid: nil,
  view: PhxI18nExampleWeb.PageLiveView,
  ...
>
```

The information in the `assigns` disappears...? But the socket `id`
(`"phx-VwPm6nt2"` in this case) is the same in the LiveView and the
LiveComponent! What happened here?  This is when a part of the
[`live_component` documentation][`Phoenix.LiveView.Helpers.live_component/4`]
finally clicked:

> "A LiveComponent provides similar functionality to LiveView, except
> they run in the same process as the LiveView, with its own encapsulated state"

So, if my understanding is correct, the `id` for the `socket` is the same since
it is the same process, but the `assigns` states of the LiveView and
LiveComponent are isolated from each other, and we essentially get a "blank
slate" socket `assigns` in the LiveComponent.

The `assigns` values we pass in to the `live_component` function (in this case
`locale: @locale`), become available to us in `update/2` (which the parent
LiveView will call during the initialisation process), where we can then
assign them to the LiveComponent `socket`.

## Finishing Up Stateless

Now that we have cleared up some LiveComponent socket-related gotchas, let's
finish up porting over the remaining two LiveViews to use Stateless components.
The way we will do this will be very similar to `TitleLiveView`, with the
content in the `render/1` functions being extracted out into LiveComponents:

### LanguageDropdownLiveView

**`lib/phx_i18n_example_web/live/views/language_dropdown_live_view.ex`**

**Before:**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, LanguageDropdownView}

  # ...
  def render(assigns) do
    LanguageDropdownView.render("language_dropdown.html", assigns)
  end
  # ...
end
```

**After:**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, LanguageDropdownLiveComponent}

  # ...
  def render(assigns) do
    ~L"""
    <%= live_component @socket,
                       LanguageDropdownLiveComponent,
                       locale: @locale,
                       selectable_locales: @selectable_locales,
                       show_available_locales: @show_available_locales %>
    """
  end
  # ...
end
```

**`lib/phx_i18n_example_web/live/components/language_dropdown_live_component.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLiveComponent do
  use Phoenix.LiveComponent
  alias PhxI18nExampleWeb.LanguageDropdownView

  def render(assigns) do
    LanguageDropdownView.render("language_dropdown.html", assigns)
  end
end
```

### PageLiveView

**`lib/phx_i18n_example_web/live/views/page_live_view.ex`**

**Before:**

```elixir
defmodule PhxI18nExampleWeb.PageLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, PageView}

  # ...
  def render(assigns) do
    PageView.render("index.html", assigns)
  end
  # ...
end
```

**After:**

```elixir
defmodule PhxI18nExampleWeb.PageLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, PageLiveComponent}

  # ...
  def render(assigns) do
    ~L"""
    <%= live_component @socket, PageLiveComponent, locale: @locale %>
    """
  end
  # ...
end
```

**`lib/phx_i18n_example_web/live/components/page_live_component.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveComponent do
  use Phoenix.LiveComponent
  alias PhxI18nExampleWeb.PageView

  def render(assigns) do
    PageView.render("index.html", assigns)
  end
end
```

And that's it! The application is now using Stateless LiveComponents!

You can find the code for this iteration of the application in this post's
[companion Github repo][phx_i18n_example] on the [`06-live-stateless` branch][].

## Optional Refactor

Before we move on to stateful components, I would just like to bring up that if
you do not like to have inline LiveView templates (aka Live Embedded Elixir
(`leex`), ie `~L"""` code) in _any_ of your LiveViews, then it is possible to
refactor them out completely into separate files. For example, in
`PageLiveView`, our `render/1` function looks like:

**`lib/phx_i18n_example_web/live/views/page_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveView do
  # ...
  def render(assigns) do
    ~L"""
    <%= live_component @socket, PageLiveComponent, locale: @locale %>
    """
  end
  # ...
end
```

Rather than have this inline template, we _could_ refactor this into something
like the following:

**`lib/phx_i18n_example_web/live/views/page_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, PageLiveViewView}

  # ...
  def render(assigns) do
    PageLiveViewView.render("component.html", assigns)
  end
  # ...
end
```

And then create a new view and template to call the component:

**`lib/phx_i18n_example_web/views/page_live_view_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveViewView do
  use PhxI18nExampleWeb, :view
  alias PhxI18nExampleWeb.PageLiveComponent
end
```

**`lib/phx_i18n_example_web/templates/page_live_view/component.html.leex`**

```elixir
<%= live_component @socket, PageLiveComponent, locale: @locale %>
```

This refactor works, but, to me at least, it just feels awkward to have such few
lines of code spread out over multiple files, not to mention the even more
awkward `PageLiveViewView` naming.

I do like having longer templates in their own file, with their own dedicated
view file, but for a `live_component` one-liner like this, I think inline is
fine. But, your mileage may vary, and by all means use your best judgement to
determine if this kind of refactor is to your benefit or liking.

## Update to Stateful Components

Now, we will move on to giving our LiveComponents more responsibility for
managing their own state, by making them [Stateful Components][]. Like before,
let's start with the least complex LiveView/LiveComponent set for the page
title. Here is the finished product:

**`lib/phx_i18n_example_web/live/views/title_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.TitleLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, TitleLiveComponent}

  @locale_changes "locale-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@locale_changes <> user_id)
    socket = assign(socket, :locale, locale)
    {:ok, socket}
  end

  def render(assigns) do
    ~L"""
    <%= live_component @socket,
                       TitleLiveComponent,
                       id: :title,
                       locale: @locale %>
    """
  end

  def handle_info(%{event: "change-locale", payload: payload}, socket) do
    socket = assign(socket, :locale, payload.locale)
    {:noreply, socket}
  end
end
```

No, your eyes do not deceive you: literally the only change from before has
been the addition of the `id: title` keyword argument in the `live_component`
function call. No changes to `TitleLiveComponent` were necessary. And now it is
stateful.

If you are thinking that this does not really represent a change in
responsibilities of the `TitleLiveComponent`, you would be absolutely correct.

Although I would very much like to allow the `TitleLiveComponent` to receive and
handle `"change-locale"` messages, ["components do not have a `handle_info/2`
callback"][LiveComponent as the source of truth], and so this is one of the
areas where a stateful LiveComponent must depend on its parent.

Technically, we could have moved the `Endpoint.subscribe/1` function call into
the LiveComponent, and it would have worked, but I think the demarcation lines
of responsibility are clearer if we say that the parent LiveView is entirely
responsible for handling external [PubSub][Phoenix PubSub] communication.

Therefore, for this particular LiveView/LiveComponent set, there is probably not
much value in making it Stateful.

## Moving on

So, that was rather anti-climactic. Let's move on to the `PageLiveView` where
we will hopefully have more luck with making at least some consequential
changes.  Currently, it looks like:

**`lib/phx_i18n_example_web/live/views/page_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, PageLiveComponent}

  @locale_changes "locale-changes:"
  @dropdown_changes "dropdown-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@locale_changes <> user_id)
    socket = assign(socket, locale: locale, user_id: user_id)
    {:ok, socket}
  end

  def render(assigns) do
    ~L"""
    <%= live_component @socket, PageLiveComponent, locale: @locale %>
    """
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

Like `TitleLiveView`, there is some external PubSub message handling here around
`"change-locale"` events that we need to leave in the parent LiveView, but
handling `"hide-dropdown"` events is definitely something that a LiveComponent
can perform, so let's extract the `handle_event/3` code out to
`PageLiveComponent`:

**`lib/phx_i18n_example_web/live/components/page_live_component.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveComponent do
  use Phoenix.LiveComponent
  alias PhxI18nExampleWeb.{Endpoint, PageView}

  @dropdown_changes "dropdown-changes:"

  def render(assigns) do
    PageView.render("index.html", assigns)
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
end
```

Great! The LiveComponent is now broadcasting out `"hide-dropdown"` messages if
it, itself, receives a `"hide-dropdown"` event. This extraction leaves the
parent LiveView with slightly less code, and one less thing to worry about:

**`lib/phx_i18n_example_web/live/views/page_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.PageLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, PageLiveComponent}

  @locale_changes "locale-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@locale_changes <> user_id)
    socket = assign(socket, locale: locale, user_id: user_id)
    {:ok, socket}
  end

  def render(assigns) do
    ~L"""
    <%= live_component @socket,
                       PageLiveComponent,
                       id: :page,
                       locale: @locale,
                       user_id: @user_id %>
    """
  end

  def handle_info(%{event: "change-locale", payload: payload}, socket) do
    send_update(PageLiveComponent, id: :page, locale: payload.locale)
    {:noreply, socket}
  end
end
```

Note that as opposed to the `TitleLiveView`, in which we only passed the
`@locale` parameter into the call to `live_component`, in the `PageLiveView`,
we are also passing through the `@user_id`, since `PageLiveComponent` needs it
to perform the `"hide-dropdown"` broadcasts. Parent LiveViews can keep a tight
leash on what information child LiveComponents need to know about.

## Filial Piety

We have been taking baby-steps towards LiveComponent independence, but now it's
time to take a bigger step: let's move on to the busiest LiveView in the
application, `LanguageDropdownLiveView`, and see how much we can lighten its
load. Currently, it does quite a lot:

**`lib/phx_i18n_example_web/live/views/language_dropdown_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, LanguageDropdownLiveComponent}

  @locales Gettext.known_locales(PhxI18nExampleWeb.Gettext)
  @locale_changes "locale-changes:"
  @dropdown_changes "dropdown-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@dropdown_changes <> user_id)
    state = init_state(locale, user_id)
    socket = assign(socket, state)
    {:ok, socket}
  end

  def render(assigns) do
    ~L"""
    <%= live_component @socket,
                       LanguageDropdownLiveComponent,
                       locale: @locale,
                       selectable_locales: @selectable_locales,
                       show_available_locales: @show_available_locales %>
    """
  end

  def handle_event("hide", _value, socket) do
    socket = assign(socket, :show_available_locales, false)
    {:noreply, socket}
  end

  def handle_event("toggle", _value, socket) do
    socket =
      assign(
        socket,
        :show_available_locales,
        !socket.assigns.show_available_locales
      )

    {:noreply, socket}
  end

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

  def handle_info(%{event: "hide-dropdown"}, socket) do
    socket = assign(socket, :show_available_locales, false)
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

Like the other LiveViews, there is external PubSub communication that we must
keep as-is, but I would say _every other function_ can be shipped out wholesale
to `LanguageDropdownLiveComponent`, lightening `LanguageDropdownLiveView`'s
load considerably:

**`lib/phx_i18n_example_web/live/views/language_dropdown_live_view.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLiveView do
  use Phoenix.LiveView
  alias PhxI18nExampleWeb.{Endpoint, LanguageDropdownLiveComponent}

  @dropdown_changes "dropdown-changes:"

  def mount(%{locale: locale, user_id: user_id}, socket) do
    Endpoint.subscribe(@dropdown_changes <> user_id)
    socket = assign(socket, locale: locale, user_id: user_id)
    {:ok, socket}
  end

  def render(assigns) do
    ~L"""
    <%= live_component @socket,
                       LanguageDropdownLiveComponent,
                       id: :language_dropdown,
                       locale: @locale,
                       user_id: @user_id %>
    """
  end

  def handle_info(%{event: "hide-dropdown"}, socket) do
    send_update(
      LanguageDropdownLiveComponent,
      id: :language_dropdown,
      show_available_locales: false
    )

    {:noreply, socket}
  end
end
```

It now does not need to worry about setting up internal state for the dropdown
menu, nor handle any of its events. It does still continue to handle external
PubSub messages, but it completely delegates responsibility of what action
should be performed to `LanguageDropdownLiveComponent` via the
[`send_update/2`][] function.

So, let's see where all that logic has
gone:

**`lib/phx_i18n_example_web/live/components/language_dropdown_live_component.ex`**

```elixir
defmodule PhxI18nExampleWeb.LanguageDropdownLiveComponent do
  use Phoenix.LiveComponent
  alias PhxI18nExampleWeb.{Endpoint, LanguageDropdownView}

  @locales Gettext.known_locales(PhxI18nExampleWeb.Gettext)
  @locale_changes "locale-changes:"

  def update(%{locale: locale} = assigns, socket) do
    state = Map.merge(assigns, init_dropdown_state(locale))
    socket = assign(socket, state)
    {:ok, socket}
  end

  def update(%{show_available_locales: false}, socket) do
    socket = assign(socket, :show_available_locales, false)
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
    socket =
      assign(
        socket,
        :show_available_locales,
        !socket.assigns.show_available_locales
      )

    {:noreply, socket}
  end

  def handle_event("locale-changed", %{"locale" => locale}, socket) do
    Endpoint.broadcast_from(
      self(),
      @locale_changes <> socket.assigns.user_id,
      "change-locale",
      %{locale: locale}
    )

    state = update_locale_changed_state(socket.assigns, locale)
    socket = assign(socket, state)
    {:noreply, socket}
  end

  defp update_locale_changed_state(assigns, locale) do
    assigns
    |> Map.merge(%{locale: locale})
    |> Map.merge(init_dropdown_state(locale))
  end

  defp init_dropdown_state(locale) do
    selectable_locales = List.delete(@locales, locale)

    %{
      selectable_locales: selectable_locales,
      show_available_locales: false
    }
  end
end
```

The LiveComponent now has responsibilities over:

- Manually handling updating its state by overriding the `update/2` function,
  since the LiveComponent default implementation does not cut it any more
- Handling the two different flavours of `update` that the component needs to
  know about (via the `update` function heads), which are:
  - when the `locale` is updated, upon which it needs to re-initialise its
    state (which, by the by, the parent LiveView does not need to know anything
    about)
  - when `show_available_locales` is explicitly set to `false` (ie from when
    `LanguageDropdownLiveView` calls `send_update/2`), at which point the menu
    needs to be hidden
- Handling _all_ its local events
- Broadcasting `"change-locale"` messages when it gets a `"locale-changed"`
  message

Easily the most independent of the three LiveComponents in the application.

You can find the code for this iteration of the application in this post's
[companion Github repo][phx_i18n_example] on the [`07-live-stateful` branch][].

## Stateless or Stateful?

In this application, I think the benefits of using Stateless versus Stateful
LiveComponents are largely subjective, and really depend on personal preferences
about how to divide up logic between LiveViews and LiveComponents.

If you have an application that has more moving parts and complexity, like
fetching from a database to populate multiple LiveComponents on a
page, in which you may need to consider [preloading][Preloading and update]
using [`preload/1`][] (not covered in this blog post), then the decision to
specifically use Stateful components may become clearer.

Regardless of your preferred flavour of LiveComponent, I think they are a
welcome addition to the Phoenix's Live Toolbox, and I'm sure I will be making
more use of them in the future.

## Update (29-01-2020)

Well, the cracking pace of development on new libraries like LiveView can mean
that even minor version changes can result in having the rug pulled out from
under you, and this application is no exception.

On updating the application to LiveView [version 0.6.0][LiveView version 0.6.0],
everything stopped working, and my LiveComponents mysteriously stopped handling
events.

If you are following along, [here is the diff][07-live-stateful and
08-live-stateful-0-6 diff] between the [`07-live-stateful` branch][] you have
already seen, and a new [`08-live-stateful-0-6` branch][], all updated and
working with LiveView 0.6.0 (with a couple of small refactors).

It is not worth going into the deep details of how to upgrade, since I think the
diff, as well as the [LiveView 0.6 Installation instructions][] and the
[Changelog][LiveView version 0.6.0], provide enough information, but I will
outline a few points:

- The socket `session` now accepts only string keys. This affected code in Plugs
  as well as LiveViews. It does seem a bit strange now to have
  `Conn.assign(:locale, locale)` with an atom key, and
  `Conn.put_session("locale", locale)` with a string key
- I think it's great that any `session` variables set in plugs are available
  automatically in LiveViews now, without having to explicitly indicate a set of
  session keys in the route. (eg
  `live "/", PageLiveView, session: [:locale, :user_id]`). You could explicitly
  override values here using a map, though, if you wanted to (eg
  `live "/", PageLiveView, session: %{"locale" => "en"}`)
- [Targeting Component Events][] is where the Stateful LiveComponent trip ups
  occurred. With 0.6.0, if template code managed by a LiveComponent does not
  have a `phx-target` attribute, then the LiveComponent's `handle_event/3`
  function that previously may have worked will now _not_ pick up the event, and
  instead event handling will go straight to the parent LiveView. In this case,
  I got an error complaining that I did not have `handle_event/3`
  implementations in the LiveView to handle the events that it was receiving.
  See the [Targeting Component Events][] documentation and the `.eex`/`.leex`
  template files in [the diff][07-live-stateful and 08-live-stateful-0-6 diff]
  for details on getting your Stateful LiveComponents back on the job of
  handling events

You can find the code for this iteration of the application in this post's
[companion Github repo][phx_i18n_example] on the
[`08-live-stateful-0-6` branch][].

Follow the next steps of this application's journey in _[Internationalisation
with Phoenix Live Layouts][]_!

[`05-liveview-fix` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/05-liveview-fix
[`06-live-stateless` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/06-live-stateless
[`07-live-stateful` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/07-live-stateful
[07-live-stateful and 08-live-stateful-0-6 diff]: https://github.com/paulfioravanti/phx_i18n_example/compare/07-live-stateful...08-live-stateful-0-6
[`08-live-stateful-0-6` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/08-live-stateful-0-6
[arity]: https://en.wikipedia.org/wiki/Arity
[I18n Application]: /assets/images/2020-01-27/i18n-application.gif "Internationalisation Application"
[Internationalisation with Phoenix LiveView]: https://www.paulfioravanti.com/blog/internationalisation-with-phoenix-liveview/
[Internationalisation with Phoenix Live Layouts]: https://www.paulfioravanti.com/blog/internationalisation-with-phoenix-live-layouts/
[Internationalization naming]: https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming
[LiveComponent]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html
[LiveComponent as the source of truth]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html#module-livecomponent-as-the-source-of-truth
[LiveView 0.6 Installation instructions]: https://github.com/phoenixframework/phoenix_live_view/blob/924fe4aa53e690751cdc063883a356b7c8165f08/guides/introduction/installation.md
[LiveView version 0.6.0]: https://github.com/phoenixframework/phoenix_live_view/blob/master/CHANGELOG.md#deprecations
[Phoenix LiveView]: https://github.com/phoenixframework/phoenix_live_view
[`Phoenix.LiveView.Helpers.live_component/4`]: https://hexdocs.pm/phoenix_live_view/0.4.1/Phoenix.LiveView.html#live_component/4
[Phoenix PubSub]: https://github.com/phoenixframework/phoenix_pubsub
[phx_i18n_example]: https://github.com/paulfioravanti/phx_i18n_example
[`preload/1`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html#c:preload/1
[Preloading and update]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html#module-preloading-and-update
[`send_update/2`]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#send_update/2
[Stateful Components]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html#module-stateful-components-life-cycle
[Stateless Components]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html#module-stateless-components-life-cycle
[Targeting Component Events]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html#module-targeting-component-events
