---
redirect_from:
  - /blog/all-i-want-is-a-timestamp/
title: "All I want is a Timestamp"
date: 2020-07-25 18:35 +1100
last_modified_at: 2023-07-24 18:29 +1100
tags: google-sheets javascript keyboards ergodox mechanical-keyboards
header:
  image: /assets/images/2020-07-25/all-i-want-is-a-timestamp.png
  image_description: "Marty McFly from Back to the Future exclaiming that all he wants is a Pepsi."
  teaser: /assets/images/2020-07-25/all-i-want-is-a-timestamp.png
  overlay_image: /assets/images/2020-07-25/all-i-want-is-a-timestamp.png
excerpt: >
  Google Sheets can insert the current date and time in your spreadsheet, if you
  know where to look.
---

Inserting the current date and time into a [Google Sheets][] cell can be done
with the following [keyboard shortcut][Google Sheets keyboard shortcuts]:

{: refdef:
  style="margin: auto; width: 50%; font-size: larger; margin-bottom: 1rem;"
}
| Platform | Shortcut              |
|:--------:|:---------------------:|
| PC       | Ctrl + Alt + Shift + ;|
| Mac      | ⌘ + Option + Shift + ;|
{: refdef}

If you have found this page via searching specifically for this information,
then please consider your objective fulfilled. You're welcome!

There is a story around me getting to this point, though, since behind the
simple table above is a small journey involving Google Sheets'
[functions][Google Sheets function list] and [macros][Automate tasks in Google
Sheets], [Javascript][], and eventually [QMK Firmware][] for mechanical
keyboards. Still with me? Read on...

## To-Do List

![To-Do List][]{:
  style="width: 50%; float: right; margin-left: 1rem; margin-bottom: 1rem;"
}

Using Google Sheets, I wanted to have a task list, similar to this screenshot,
where I could log the start and end times of my tasks.

I made the assumption that there was a built-in function that could generate
a timestamp for me, and when I went looking, I found [`NOW`][].

![Start Now][]{:
  style="width: 50%; float: right; margin-left: 1rem; margin-bottom: 1rem;"
}

Using it in the spreadsheet would seem to have given me what I wanted, formatted
in the way that I expect. Great!

When a task is finished, all I should have to do is make another call to
`NOW`, and I would get a new generated date and time, right? Well, that
happened, but also...

![Finish Now][]{:
  style="width: 50%; float: right; margin-left: 1rem; margin-bottom: 1rem;"
}

...the _start time_ also got re-generated, ending up the same value as the
finish time!

I thought that surely this could not be correct behaviour, but deleting the
finish time caused the start time to be re-generated _yet again_!

So, it would seem that cells that use the `NOW` function get re-calculated
whenever _any change_ occurs in the spreadsheet. Perhaps there is a way to
adjust this behaviour...?

{: refdef: style="margin: auto; width: 70%; margin-bottom: 1rem;"}
![Spreadsheet Settings image][]
{: refdef}

In the [Spreadsheet Settings][], located under the
`File > Spreadsheet Settings > Calculation` menu options, there are three
re-calculation options for the spreadsheet, but none of them _turn off_
re-calculation.

Looking back at the [documentation for `NOW`][`NOW`], which I really should have
viewed in more detail earlier, brings into focus that I'm using the wrong tool
for the job:

> - Note that NOW is a volatile function, updating on every edit made to the
  spreadsheet, and can hurt spreadsheet performance.
> - NOW will always represent the current date and time the last time the
  spreadsheet was recalculated, rather than remaining at the date and time when
  it was first entered.

Now that I know I have a _dynamic_ values problem, I wonder if there is any way
to get a _static_ datetime _value_, rather than what seems like a reference to a
function that gets executed periodically?

At first glance, it looks like there are potentially two other functions that
could fit the bill, since they return "values":

- [`DATEVALUE`][]
- [`TIMEVALUE`][]

However, both of these functions require a static string parameter, and
"return integers that can be used in formulas", those integers being a [serial
number representation][] of the date or time.

I definitely know that this is not what I want, so no need to go further down
this [rabbit hole][].

## Custom Behaviour with Macros

At this stage, it looks like I will need to create my own custom
function/behaviour to get what I want. In Google Sheets, you do this with
[Macros][Automate tasks in Google Sheets].

Since what I wanted was a `NOW` value, I will call the macro the next best
thing: `_now`, and get it to do the following:

> When I type `_now` into a cell, and the cell loses "focus" (ie I move the
cursor to another cell), the value of that cell changes from the string `_now`,
to the current date and time.

In Google Sheets, [custom functions][] are created using Javascript, and are
written in the Script Editor (`Tools > Script Editor`).

To get the desired behaviour, the `_now` function will need to hook into Sheets'
[Simple Triggers][], specifically the `onEdit(e)` trigger function, which
"runs when a user changes a value in a spreadsheet."

Opening up the Script Editor provides a default file called `macros.gs`, so
that's where the function will go:

**`macros.gs`**

```js
/** @OnlyCurrentDoc */
function onEdit(e) {
  if (e.range.getValue() == "_now") {
    let date = new Date();
    let formattedDate =
      date
        .toLocaleString("en-AU", { timeZone: "Australia/Sydney", hour12: false })
        .replace(",", "");
    e.range.setValue(formattedDate);
  }
}
```

This function does the following:

- Whenever an edit occurs in the spreadsheet, the content of the cell is checked
  to see if it contains the string `"_now"` (technically, the value of the
  [range][] of the [event object][] `e` is checked)
- If it does contain `"_now"`, then it uses Javascript to create a new date
- From that date object, a new date string is created and formatted according to
  my current locale (Sydney, Australia), and in 24-hour time
- The content of the cell is then set to the formatted date string

Let's see how this works back in the spreadsheet:

{: refdef: style="text-align: center;"}
![Now Macro][]
{: refdef}

Looks good to me! We're done here now, right?

Well, something about this still did not sit right with me: surely the desire
for a current date and time could not be so uncommon that all this ceremony and
customisation was needed...?

The punch line is that, as you already know, if I had _just_ looked into Google
Sheets' [keyboard shortcuts][Google Sheets keyboard shortcuts], I could have
saved myself all this time (though I would probably not have learned about all
the things I've covered here, nor written this blog post at all, so I guess
that is a good thing...?).

Opening up the shortcut search modal (⌘ + /) and searching for "time" displays
the following:

![Time Shortcut Search][]

The solution was unfortunately hidden away from me, but it was simpler than what
I had created. So, rather than keep the custom function, I removed it in favour
of using the "Insert current date and time" shortcut.

The only issue I can see now, though, is that a 4-key "shortcut" is a bit
unwieldy, and since I will be using this a lot moving forward, I want it to be
shorter. And, just for fun, I want to actually map it to a key on my keyboard.

So, it's time to crack open [QMK][QMK Firmware] and make this happen!

(I know I could potentially make the shortcut a bit shorter using an
[operating-system level custom keyboard shortcut][How to Create Custom Keyboard
Shortcuts in Mac OS], rather than go down to the metal of my keyboard firmware,
but where's the fun in that?)

## Configuring a Google Sheets Datetime Key

I have gone into the details on how to create new keyboard keycodes that map to
custom actions in a couple of other blog posts:

- _[Escape the defaults and Control your keyboard with QMK][]_
- _[Chording QWERTY with QMK Combos][]_

So, I will just summarise the changes I needed to make to get a datetime
appearing on a key press of my [Ergodox EZ][], and the blog posts above should
be able to fill in any areas you may be uncertain about. You can also view the
final result in [my QMK Keymaps][paulfioravanti/qmk_keymaps].

### Custom Keycode

Add a custom keycode for a Google Sheets timestamp, which I will call
`GS_TIMESTAMP`, to the `custom_keycodes` list:

```c
enum custom_keycodes {
  // ....
  GS_TIMESTAMP,
  // ...
};
```

[My `custom_keycodes`][].

### Custom Action

Add a custom action for when the key corresponding to the `GS_TIMESTAMP` is
pressed. In this case, I want to map it to the Google Sheets shortcut:
⌘ + Option + Shift + ;.

This gets coded up in the `process_record_user()` function as one of the `case`
options in the `switch` statement:

```c
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  if (record->event.pressed) {
    switch (keycode) {
      // ...
      case GS_TIMESTAMP:
        SEND_STRING(SS_DOWN(X_LGUI)SS_DOWN(X_LALT)SS_DOWN(X_LSHIFT));
        SEND_STRING(SS_TAP(X_SCOLON));
        SEND_STRING(SS_UP(X_LGUI)SS_UP(X_LALT)SS_UP(X_LSHIFT));
        return false;
      // ...
    }
  }
  return true;
}
```

[My `process_record_user` function][].

### Assign Keycode to Key

Now that `GS_TIMESTAMP` has a definition and an action that it performs, it
needs to be assigned to a key on the keyboard:

```c
// ...
[BASE] = LAYOUT_ergodox(  // layer 0 : default
  // left hand
  GS_TIMESTAMP, KC_1, KC_2, KC_3, KC_4, KC_5, KC_LEFT,
  // ...
),
// ...
```

Note that the positioning of the `GS_TIMESTAMP` keycode on the top left key of
the keyboard, before the "1" key, is just meant to be illustrative of the kind
of code change required. I ended up defining it
[somewhere else on my keymap][GS_TIMESTAMP keymap location].

If you followed along with your own QMK keyboard mapping, you can now re-compile
your keymap, and enjoy one-key timestamp-ing in any of your Google Sheets!

And remember, if you come across a problem in Google Sheets that _surely_ should
have a solution, make sure to read every bit of documentation you can find
before reaching for that text editor!

[Automate tasks in Google Sheets]: https://support.google.com/docs/answer/7665004
[Chording QWERTY with QMK Combos]: https://www.paulfioravanti.com/blog/chording-qwerty-with-qmk-combos/
[custom functions]: https://developers.google.com/apps-script/guides/sheets/functions
[`DATEVALUE`]: https://support.google.com/docs/answer/3093039
[Ergodox EZ]: https://ergodox-ez.com/
[Escape the defaults and Control your keyboard with QMK]: https://www.paulfioravanti.com/blog/escape-the-defaults-and-control-your-keyboard-with-qmk/
[event object]: https://developers.google.com/apps-script/guides/triggers/events
[Finish Now]: /assets/images/2020-07-25/finish-now.gif
[Google Sheets]: https://www.google.com/sheets/about/
[Google Sheets function list]: https://support.google.com/docs/table/25273
[Google Sheets keyboard shortcuts]: https://support.google.com/docs/answer/181110
[GS_TIMESTAMP keymap location]: https://github.com/paulfioravanti/qmk_keymaps/blob/dbd332f153eff5f7779f2363264e4d3eb6d908af/keyboards/ergodox_ez/keymaps/paulfioravanti/keymap.c#L96
[How to Create Custom Keyboard Shortcuts in Mac OS]: https://osxdaily.com/2017/08/08/create-custom-keyboard-shortcut-mac/
[Javascript]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[My `custom_keycodes`]: https://github.com/paulfioravanti/qmk_keymaps/blob/master/keyboards/ergodox_ez/keymaps/paulfioravanti/user/process_record_user.c
[My `process_record_user` function]: https://github.com/paulfioravanti/qmk_keymaps/blob/master/keyboards/ergodox_ez/keymaps/paulfioravanti/user/process_record_user.c
[`NOW`]: https://support.google.com/docs/answer/3092981
[Now Macro]: /assets/images/2020-07-25/now-macro.gif
[paulfioravanti/qmk_keymaps]: https://github.com/paulfioravanti/qmk_keymaps
[QMK Firmware]: https://qmk.fm/
[rabbit hole]: https://www.dictionary.com/e/slang/rabbit-hole/
[range]: https://developers.google.com/apps-script/reference/spreadsheet/range
[serial number representation]: https://www.lifewire.com/serial-number-serial-date-3123991
[Simple Triggers]: https://developers.google.com/apps-script/guides/triggers
[Spreadsheet Settings]: https://support.google.com/docs/answer/58515
[Spreadsheet Settings image]: /assets/images/2020-07-25/spreadsheet-settings.png
[Start Now]: /assets/images/2020-07-25/start-now.gif
[`TIMEVALUE`]: https://support.google.com/docs/answer/3267350
[Time Shortcut Search]: /assets/images/2020-07-25/time-shortcuts-search.png
[To-Do List]: /assets/images/2020-07-25/todo-list.png
