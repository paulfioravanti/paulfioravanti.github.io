---
title: "Internationalisation with Phoenix Live Layouts"
date: 2020-02-03 10:00 +1100
last_modified_at: 2020-02-03 10:00 +1100
tags: elixir phoenix liveview live-components live-layout i18n
header:
  image: /assets/images/2020-02-03/kyle-glenn-nXt5HtLmlgE-unsplash.jpg
  image_description: "desk globe on table"
  teaser: /assets/images/2020-02-03/kyle-glenn-nXt5HtLmlgE-unsplash.jpg
  overlay_image: /assets/images/2020-02-03/kyle-glenn-nXt5HtLmlgE-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Kyle Glenn](https://unsplash.com/@kylejglenn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/s/photos/international?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Phoenix layouts are now live-powered, giving LiveViews more flexibility and
  control over a template's surrounding content.
---

This blog post is the third in a series on the creation of a small
[I18n][Internationalization Naming] application using [Phoenix LiveView][],
which updates page content based on the language chosen from a dropdown menu:

1. _[Internationalisation with Phoenix LiveView][]_
2. _[Internationalisation with Phoenix LiveComponents][]_
3. Internationalisation with Phoenix Live Layouts

{: refdef: style="text-align: center;"}
![I18n Application][]
{: refdef}

[LiveView version 0.5.0][] introduced [Live Layouts][], a mechanism that allows
LiveViews to move view-specific layout code into a separate sub-layout file.
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

The `LanguageDropdownLive` and `TitleLive` LiveViews are live rendered from the
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

For the application in its current form, this presents no issue, but what if we
wanted to add another routed LiveView to the application aside from
`PageLiveView`? What if we wanted to have this new LiveView set its own page
title, or what if its content did not need to be internationalised, and hence
we did not need the language dropdown menu to display?

The `app.html.eex` file is the main layout template within which all other
template content is embedded, which means that any new LiveView would not
have any control over the content that surrounds its template code:

- its title would be set according to whatever `TitleLiveView` renders, rather
  than being able to provide its own page title logic
- `LanguageDropdownLiveView` will always be rendered (meaning also that the new
  LiveView would have to unnecessarily implement handlers for the
  `"change-locale"` events that the dropdown menu emits)

[`08-live-stateful-0-6` branch]: https://github.com/paulfioravanti/phx_i18n_example/tree/08-live-stateful-0-6
[I18n Application]: /assets/images/2020-02-03/i18n-application.gif "Internationalisation Application"
[Internationalization naming]: https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming
[Internationalisation with Phoenix LiveComponents]: http://paulfioravanti.com/blog/2020/01/27/internationalisation-with-phoenix-live-components/
[Internationalisation with Phoenix LiveView]: https://paulfioravanti.com/blog/2019/11/03/internationalisation-with-phoenix-liveview/
[LiveComponent]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html
[Live Layouts]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html#module-live-layouts
[LiveView Summary]: /assets/images/2020-02-03/live-view-summary.jpg "LiveView Summary"
[LiveView version 0.5.0]: https://github.com/phoenixframework/phoenix_live_view/blob/master/CHANGELOG.md#050-2020-01-15
[Phoenix LiveView]: https://github.com/phoenixframework/phoenix_live_view
[Phoenix PubSub]: https://github.com/phoenixframework/phoenix_pubsub
[phx_i18n_example]: https://github.com/paulfioravanti/phx_i18n_example
