---
title: "Escape the defaults and Control your keyboard with QMK"
date: 2018-07-31 09:10 +1100
categories: ergodox keyboards mechanical-keyboards qmk clang
header:
  image: /assets/images/2018-07-31/ergodox-ez.jpg
  teaser: /assets/images/2018-07-31/ergodox-ez.jpg
  overlay_image: /assets/images/2018-07-31/ergodox-kit.jpg
  overlay_filter: 0.5
excerpt: >
  Getting a keyboard with programmable firmware can enable you to uniquely
  personalise how you use your keyboard.
---

I love [mechanical keyboards][], and have been using an [Ergodox][] as my daily
driver since 2014.

![Ergodox EZ](/assets/images/2018-07-31/ergodox-ez.jpg)

If you are someone who spends a lot of time using a keyboard, and are likely to
continue to do so in the future, then I would:

- [encourage you to learn touch typing][Hand Coded] if you haven't already
- consider ergonomic keyboard options to increase comfort, as well as reduce
  strain on your shoulders and wrists (the keyboard you choose does not
  necessarily have to be mechanical, or a split-hand option like the Ergodox)

If you are programmer or tinkerer, then getting a keyboard with programmable
firmware can enable you to personalise how you use your keyboard, allowing your
brain (or hand muscle memory) a say in assigning functionality to keys, rather
than you having to train yourself to adapt to some product's specification.

![Massdrop Configurator](/assets/images/2018-07-31/massdrop-configurator.png)

When I got my first Ergodox, I used [Massdrop's Ergodox Configurator][] to
generate firmware for the keyboard. As I got to know my Ergodox better, and my
brain started to tell me that it was expecting certain keys to be in different
places from the default setup, I was able to use the Configurator's nice user
interface to make basic changes, and then re-generate the firmware in a matter
of minutes.

It was only when I started wanting to have a keystroke represent a combination
of keys, rather than a single key, that I hit the limitations of what the
web-based Configurator enabled me to do. So, I decided to bypass it and go
straight to the source code that the Configurator itself was using to generate
its firmware: [Ben Blazak][]'s [Ergodox Firmware][].

I am not a C language programmer, but after a period of tinkering, I was able to
cobble together a [custom keymap layout][Ergodox Custom Layout], and
successfully flash it on to my keyboard firmware. It worked great, and I happily
used it for years.

Then, one day, I wanted to make some updates, and realised that some code
libraries that the firmware used were now so old and outdated that I was unable
to compile a new version of the firmware on my computer.

As of this writing, it looks like development on the firmware has stalled, and
so if I really wanted to update my keyboard layout, I would need re-write it
for a new platform.

## Enter QMK

After some investigation, I came to the conclusion that the
[Quantum Mechanical Keyboard (QMK) Firmware][QMK Firmware] would likely be my
best choice, given its popularity with Ergodox users, and because it supports
[many other keyboard types][QMK Supported Keyboards]. So, I can continue to use
it if, somehow, I _accidentally_ end up buying other different types of
mechanical keyboards (if you are into mechs, you know how it is...
:money_with_wings:)

So, let's grab the firmware from Github:

```sh
git clone git@github.com:qmk/qmk_firmware.git
cd qmk_firmware
```

Now, open up the [QMK Ergodox EZ default layout][] (so called, I believe,
because [Ergodox EZ][] is now the pre-eminent retailer of original version
Ergodoxes) to use as a base, and see about getting a feel for how to use it.

### Keyboard Layout

![Ergodox Left Hand](/assets/images/2018-07-31/ergodox-left-hand.jpg)

Below is an abbreviated part of the default layout, focusing on one layer for
the left side of an Ergodox keyboard:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/default/keymap.c`**

```c
// ...
/* Keymap 0: Basic layer
 *
 * ,--------------------------------------------------.
 * |   =    |   1  |   2  |   3  |   4  |   5  | LEFT |
 * |--------+------+------+------+------+-------------|
 * | Del    |   Q  |   W  |   E  |   R  |   T  |  L1  |
 * |--------+------+------+------+------+------|      |
 * | BkSp   |   A  |   S  |   D  |   F  |   G  |------|
 * |--------+------+------+------+------+------| Hyper|
 * | LShift |Z/Ctrl|   X  |   C  |   V  |   B  |      |
 * `--------+------+------+------+------+-------------'
 *   |Grv/L1|  '"  |AltShf| Left | Right|
 *   `----------------------------------'
 *                                        ,-------------.
 *                                        | App  | LGui |
 *                                 ,------|------|------|
 *                                 |      |      | Home |
 *                                 | Space|Backsp|------|
 *                                 |      |ace   | End  |
 *                                 `--------------------'
 */
[BASE] = LAYOUT_ergodox(  // layer 0 : default
  // left hand
  KC_EQL,          KC_1,        KC_2,          KC_3,    KC_4,    KC_5, KC_LEFT,
  KC_DELT,         KC_Q,        KC_W,          KC_E,    KC_R,    KC_T, TG(SYMB),
  KC_BSPC,         KC_A,        KC_S,          KC_D,    KC_F,    KC_G,
  KC_LSFT,         CTL_T(KC_Z), KC_X,          KC_C,    KC_V,    KC_B, ALL_T(KC_NO),
  LT(SYMB,KC_GRV), KC_QUOT,     LALT(KC_LSFT), KC_LEFT, KC_RGHT,
                                                        ALT_T(KC_APP), KC_LGUI,
                                                                       KC_HOME,
                                               KC_SPC,  KC_BSPC,       KC_END,
  // ..
)
```

Here, we can see:

- Constant variables that begin with `KC_`. These represent a single basic key
  code, like the "A" or "1" keys.
- Other mappings that do not begin with `KC_`. These are functions that
  take arguments, and can represent actions like holding down one key while
  pressing another.

All these constants and functions (and more representing every key on a
keyboard, as well as various key combinations) are enumerated in the
[QMK Keycodes Documentation][], and are available to use in the layout without
any further configuration.

That's all well and good, but what if there is no built-in mapping for a key
combination you want to perform?

### Custom Key Mappings

Let's say that on the layout above, instead of having the top left corner key be
the "=" character (ie `KC_EQL`) when tapped, you would like it to perform some
custom combination of key presses, which we'll name `MY_KEY_COMBO`.

Where does `MY_KEY_COMBO` get declared, and where do we define what it is
supposed to actually do? Well, there are three main steps for this, but before
we do them, let's create a copy of the default keymap folder, put it into a
`custom` directory, and make our edits on that:

```sh
cp -r qmk_firmware/keyboards/ergodox_ez/keymaps/default qmk_firmware/keyboards/ergodox_ez/keymaps/custom
```

First, we need to add a new `MY_KEY_COMBO` type to the existing
`custom_keycodes` enumerated types list, which is declared towards the top of
the keymap file:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/custom/keymap.c`**

```c
enum custom_keycodes {
  // ...
  MY_KEY_COMBO
};
```

Now, we can replace `KC_EQL` with `MY_KEY_COMBO` in the keyboard layout:

```c
// ...
[BASE] = LAYOUT_ergodox(  // layer 0 : default
  // left hand
  MY_KEY_COMBO, KC_1, KC_2, KC_3, KC_4, KC_5, KC_LEFT,
  // ...
```

To give this new type some behaviour, we need to register it inside a function
called `process_record_user()`, which can be found towards the bottom of the
keymap file:

```c
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  switch (keycode) {
    case MY_KEY_COMBO:
      if (record->event.pressed) {
        // Do whatever it is that MY_KEY_COMBO is supposed to do when pressed
      }
      return false;
      break;
    // other case statements ...
  }
  return true;
}
```

`process_record_user()` will get called automatically whenever a key on your
keyboard is pressed or released, so there is no need to add any code that
specifically calls it. More information about this function, as well as how to
define a new key code, can be found on the [QMK Custom Quantum Functions][]
documentation page.

> You will, of course, see more code and functions in the keymap file, but for
what we want to accomplish, we just need to concern ourselves with a limited
section of code. If there is anything you see that we do not cover, and that you
do not understand, and you want more information about, then definitely give the
[QMK documentation][] a search.

So, now that we know _where_ we need to put code for custom key actions, _what_
kind of implementation code can we actually put in there? We will answer this
with a few examples of the actions I have in my personal keymap.

## Key Requirements

My main use cases for custom key actions pretty much fall into the following
categories:

- Output a string of characters on screen, which enables single-key mappings to
  programming-related operators like the
  [pipe operator (`|>`)][Elixir Pipe Operator] from [Elixir][],
  [ERB tags (`<%=`, `%>`)][ERB tags] from [Ruby][], and emoji codes like
  :+1: (`:+1:`)
- Key Hold/Key Press combinations of varying complexity, which enable single key
  mappings for application start up or manipulation. For example, Option-Space
  for [Alfred][], Shift-Command-Space for [Divvy][], and Alt-Command-Left/Right
  for moving web browser tabs to the left or right.
- Modifying a key based on its state. For example, re-mapping the Caps Lock key
  to be Control when held, and Escape when tapped: a popular mod for [Vim][]
  users.

QMK does have built-in functionality for some of these use-cases:

- The [Mod Tap][] function `LCTL_T(kc)` is Left Control when held, and `kc` when
  tapped. So, `LCTL_T(KC_ESC)` will provide the desired "Left Control when held,
  Escape when tapped" functionality. All that needs to be done is assign that
  function to a key, and you will be a happy Vimmer.
- [Modifier Key][] functions like `LALT(kc)` (apply Left Alt to `kc`), and
  `SGUI(kc)` (Hold Left Shift and GUI — read: ⌘Command — and press `kc`), cover
  Alfred and Divvy commands (`LALT(KC_SPACE)` and `SGUI(KC_SPACE)`
  respectively).

For the rest though, we will need to write some custom implementation code.

### Sending Strings

Let's get started with the programming-related operators and emoji codes. Like
before, first add the new types:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/custom/keymap.c`**

```c
enum custom_keycodes {
  // ...
  FORWARD_PIPE
  LEFT_ERB
  PLUS_ONE
  RIGHT_ERB
};
```

Assign the types to some keys (these key locations are illustrative only, you
probably don't _actually_ want these keys at the top left of the board):

```c
// ...
[BASE] = LAYOUT_ergodox(  // layer 0 : default
  // left hand
  FORWARD_PIPE, LEFT_ERB, PLUS_ONE, RIGHT_ERB, KC_4, KC_5, KC_LEFT,
  // ...
```

And now, let's use the `SEND_STRING` [Feature Macro][] to type out the strings:

```c
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  if (record->event.pressed) {
    switch (keycode) {
      case FORWARD_PIPE:
        SEND_STRING("|>");
        return false;
      case LEFT_ERB:
        SEND_STRING("<%=");
        return false;
      case PLUS_ONE:
        SEND_STRING(":+1:");
        return false;
      case RIGHT_ERB:
        SEND_STRING("%>");
        return false;
    }
  }
  return true;
}
```

That wasn't too bad! All we have left now is getting Alt-Command-Left/Right
working for navigating browser tabs. Unfortunately, the
[list of Modifier Keys][Modifiers], although comprehensive, does not have a
function available for holding down Alt, Command, and pressing a key. So, we
will have to manually re-create it.

Create two new types, `LEFT_PANE` and `RIGHT_PANE`, add them to the
`custom_keycodes` enumerated types list, and assign them to keys, just like
with the previous types. Then, their implementation will look something like
this:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/custom/keymap.c`**

```c
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  if (record->event.pressed) {
    switch (keycode) {
      // ...
      case LEFT_PANE:
        SEND_STRING(SS_DOWN(X_LALT)SS_DOWN(X_LGUI));
        SEND_STRING(SS_TAP(X_LEFT));
        SEND_STRING(SS_UP(X_LGUI)SS_UP(X_LALT));
        return false;
      case RIGHT_PANE:
        SEND_STRING(SS_DOWN(X_LALT)SS_DOWN(X_LGUI));
        SEND_STRING(SS_TAP(X_RIGHT));
        SEND_STRING(SS_UP(X_LGUI)SS_UP(X_LALT));
        return false;
    }
  }
  return true;
}
```

Let's take a look at what's going on here:

- `SS_DOWN`, `SS_UP`, and `SS_TAP` are
  [specific Feature Macros][TAP, DOWN and UP] that cover pressing (but not
  releasing) a key, releasing a key, and pressing-and-releasing a key
  respectively. So, we are issuing three commands in our `case` statements:
  press (and hold) Left Alt and Left GUI, then tap the Left (or Right) Arrow
  key, then release the Left GUI and Left Alt keys.
- Keycodes, when used with the `SEND_STRING` function, apparently need to have
  an `X_` prefix, rather than `KC_`,
  ["because of some pre-processor magic"][Update send_string pull request]...
  ¯\\\_(ツ)\_/¯

## Compile Time

At this point, we should have a compilable program, so if you wanted to generate
the firmware, return to the root `qmk_firmware` directory, and after
[installing the build tools][Installing Build Tools] for your system, run the
following command:

```sh
make ergodox_ez:custom
```

This should result in an `ergodox_ez_custom.hex` file being generated in the
`qmk_firmware` root directory, which can then be used to flash the Ergodox
keyboard firmware, instructions for which are in the video on the
[ErgoDox EZ Graphical Configurator page][] (consult your keyboard's
documentation for its specific firmware-flashing instructions).

Rather than _actually_ compiling and using the layout we have created here,
though, use what we have done as a base for thinking about what custom keys you
would like to have, and then creating your own personal keymap layout.

There is plenty of inspiration in the [QMK Ergodox EZ keymaps][] directory
(or in the keymaps directory of whatever type of keyboard you may be using),
and please feel free to take anything of use from
[my own keymap layout][Paul's QMK Keymaps].

## Other Resources

- If you like emoji, but would prefer to have your mappings send Unicode
  characters, rather than emoji codes (eg `SEND_STRING(SS_LALT("D83D+DC4D"))`
  rather than `SEND_STRING(":+1:")`), then check out the
  [One-keystroke Unicode characters in QMK on macOS][] blog post by
  [Rebecca Le][].

## Bonus: Software-based Key Mapping for Mac

Sometimes, you just cannot get to an external keyboard and need to use the
keyboard built-in to your laptop computer. If you need key mappings in that
situation, then I can definitely recommend [Karabiner Elements][]. My mappings
look like the following from the user interface:

![Karabiner Mappings](/assets/images/2018-07-31/karabiner-mappings.png)

Some notes on these rules:

- In order to get a mirroring "Caps Lock to Control/Escape" key on the right
  side of the keyboard for Vim, using a combination of rules, I mapped
  Enter/Return to be "Control when held, Return/Enter when tapped". Works great
  for touch typing Vimmers that want to stay close to the home row!
- The final rule represents the following mappings: when Left-⌘ is tapped
  (not held), send the "英数" (_eisū_, alphanumeric) key, and when Right-⌘  is
  tapped (not held), send the "かな" (_kana_, Japanese) key. These two keys are
  often found on Japanese Mac OS keyboards and make it easy to switch between
  the inputting English and Japanese. More info
  [here][Keys for Japanese Keyboards] if you are interested.

You can also get the config details in [`karabiner.json`][] from
[my Dotfiles][Paul's Dotfiles].

Happy Clacking!

[Alfred]: https://www.alfredapp.com/
[Ben Blazak]: https://github.com/benblazak
[Divvy]: http://mizage.com/divvy/
[Elixir]: https://elixir-lang.org/
[Elixir Pipe Operator]: https://hexdocs.pm/elixir/Kernel.html#%7C%3E/2
[ERB tags]: https://ruby-doc.org/stdlib-2.5.1/libdoc/erb/rdoc/ERB.html#class-ERB-label-Recognized+Tags
[Ergodox]: https://www.ergodox.io/
[Ergodox Custom Layout]: https://github.com/paulfioravanti/ergodox-firmware/blob/custom-layout/firmware/keyboard/ergodox/layout/custom-layout.c
[Ergodox EZ]: https://ergodox-ez.com/
[Ergodox EZ Configurator]: https://configure.ergodox-ez.com/keyboard_layouts/new
[ErgoDox EZ Graphical Configurator page]: https://ergodox-ez.com/pages/graphical-configurator
[Ergodox Firmware]: https://github.com/benblazak/ergodox-firmware
[Feature Macro]: https://docs.qmk.fm/#/feature_macros
[Hand Coded]: https://speakerdeck.com/paulfioravanti/hand-coded
[Installing Build Tools]: https://docs.qmk.fm/#/getting_started_build_tools
[`karabiner.json`]: https://github.com/paulfioravanti/dotfiles/blob/master/config/karabiner/karabiner.json
[Karabiner Elements]: https://github.com/tekezo/Karabiner-Elements
[Keys for Japanese Keyboards]: https://en.wikipedia.org/wiki/Language_input_keys#Keys_for_Japanese_Keyboards
[Massdrop's Ergodox Configurator]: https://www.massdrop.com/configurator/ergodox
[mechanical keyboards]: https://www.reddit.com/r/MechanicalKeyboards/
[Mod Tap]: https://docs.qmk.fm/#/feature_advanced_keycodes?id=mod-tap
[Modifier Key]: https://docs.qmk.fm/#/feature_advanced_keycodes?id=modifier-keys
[Modifiers]: https://docs.qmk.fm/#/keycodes?id=modifiers
[One-keystroke Unicode characters in QMK on macOS]: https://sevenseacat.net/posts/2018/unicode-in-qmk-on-osx/
[Paul's Dotfiles]: https://github.com/paulfioravanti/dotfiles
[Paul's QMK keymaps]: https://github.com/paulfioravanti/qmk_keymaps
[QMK Custom Quantum Functions]: https://docs.qmk.fm/#/custom_quantum_functions
[QMK documentation]: https://docs.qmk.fm/#/
[QMK Ergodox EZ default layout]: https://github.com/qmk/qmk_firmware/blob/master/keyboards/ergodox_ez/keymaps/default/keymap.c
[QMK Ergodox EZ keymaps]: https://github.com/qmk/qmk_firmware/tree/master/keyboards/ergodox_ez/keymaps
[QMK Firmware]: https://qmk.fm/
[QMK Keycodes Documentation]: https://docs.qmk.fm/#/keycodes
[QMK Supported Keyboards]: https://qmk.fm/keyboards/
[Rebecca Le]: https://sevenseacat.net/about/
[Ruby]: https://www.ruby-lang.org/en/
[Update send_string pull request]: https://github.com/qmk/qmk_firmware/pull/1657
[TAP, DOWN and UP]: https://docs.qmk.fm/#/feature_macros?id=tap-down-and-up
[Vim]: https://www.vim.org/
