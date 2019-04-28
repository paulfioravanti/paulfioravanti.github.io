---
title: "Chording QWERTY with QMK Combos"
date: 2019-04-28 01:30 +1100
last_modified_at: 2019-04-28 12:00 +1100
tags: ergodox keyboards mechanical-keyboards qmk clang stenography
header:
  image: /assets/images/2019-04-28/samuel-ramos-1319769-unsplash.jpg
  image_description: "close-up photography of yellow typewriter"
  teaser: /assets/images/2019-04-28/samuel-ramos-1319769-unsplash.jpg
  overlay_image: /assets/images/2019-04-28/samuel-ramos-1319769-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Samuel Ramos](https://unsplash.com/photos/nREufpxxM8o?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/typewriter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Why let stenographers have all the fun? Get more keyboard output using less
  keys.
---

As a current learner of stenography and mechanical keyboard enthusiast, I was
pretty excited to learn about the [Georgi][] keyboard.

![Georgi][Georgi image]{:class="img-responsive"}

Aside from its cool form factor, one of the things that caught my eye was that
although the hardware is dedicated to replicating a [steno machine keymap][],
the Georgi firmware also manages to squeeze a QWERTY layout keymap into
its two rows using [stenographic-style chording][Stenotype].

![Chorded QWERTY][Chorded QWERTY image]{:class="img-responsive"}

Here, in order to output an "A", you need to press the "Q" and "Z" keys
together. As you can see, there are also similar rules for the rest of the
standard QWERTY middle row keys.

I do not think I have ever seen QWERTY used this way until now, so I would
absolutely like to give it a go. But, I do not feel I can justify a Georgi
purchase as of this writing because I would not consider my stenography skills
to even be at novice level yet.

What I _do_ have, though, is an [Ergodox set up for stenography][Starting
Stenography with an Ergodox] that uses [Quantum Mechanical Keyboard (QMK)
firmware][QMK firmware], which is coincidentally what the Georgi uses for [its
firmware][Georgi QMK firmware] as well.

Looking through the Georgi firmware for inspiration (or code to steal) to
achieve a chorded QWERTY layout on an Ergodox left me a bit perplexed. I felt a
little bit better when I found that authors acknowledge that it ["is the most
nonQMK layout you will come across"][Georgi is the most nonQMK layout], but that
only left me wondering whether there was an "official" QMK way to chord keys.

As you may have guessed, there most certainly is.

[QMK Combos][] are "a chording type solution for adding custom actions" that
let you "hit multiple keys at once and produce a different effect". This looks
like the configuration we are looking for, so let's try adding them to a layout!

### What You Need

- A keyboard that at least supports [_N_-Key Rollover][] (NKRO).
  The easiest way to confirm whether you have NKRO enabled is to perform
  [Plover][]'s [Keyboard Ghosting Test][]. In the
  [Plover in-browser steno demo][], if you find that only 6 keys light up on
  screen when you press the `ASDFJKL;` keys all at once, then you either
  currently do not have NKRO enabled, or your keyboard does not support it.
  The default Ergodox QMK firmware does not enable it by default, but we will
  fix this soon.
- For easier chording, the keyboard should also _preferably_ have a matrix
  layout (read: straight column layout, like the Ergodox or [Planck][]), rather
  than a staggered layout like most QWERTY keyboards, and use flat keycaps like
  [G20][], but these points _do not_ represent blockers to getting QWERTY
  chording to work as expected.
- QMK Firmware — see my blog post
  _[Escape the defaults and Control your keyboard with QMK][]_ for a guide to
  set up an Ergodox with QMK from scratch, otherwise find your firmware from
  [QMK's list of supported keyboards][].

## Initial Setup

For this post, we will use the [QMK default Ergodox EZ keymap][] as a base, and
make changes to it to add functionality for QWERTY chording. Feel free to follow
along as-is, or make appropriate changes to your own custom keymaps. You can
also see the finished layout on this post's companion
[QMK Ergodox Chorded QWERTY Example][] keymap.

After [installing the build tools][QMK Installing Build Tools] for your
operating system, make a clone of the QMK Firmware repository from Github if you
do not have one already. Then, create a copy of the default Ergodox EZ
keymaps directory into a new directory that we will call
`chorded_qwerty`:

```sh
git clone git@github.com:qmk/qmk_firmware.git
cd qmk_firmware
cp -r keyboards/ergodox_ez/keymaps/default keyboards/ergodox_ez/keymaps/chorded_qwerty
```

## Enable NKRO and Combos

Before adding a new keyboard layout to our keymap, the first thing we will need
to do is ensure that we have NKRO and combos enabled. We will do this by adding
two new files:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/rules.mk`**

```sh
FORCE_NKRO = yes
COMBO_ENABLE = yes
```

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/config.h`**

```c
#include "../../config.h"

#define FORCE_NKRO
#define COMBO_COUNT 1
```

- The `FORCE_NKRO` config makes sure that we have NKRO enabled by default
- The `COMBO_COUNT 1` specifies the number of combos used in the layout. For
  now, we will keep this at `1` to focus on just getting a "Q and Z to A" combo
  working, and then add more later.

## New Chorded QWERTY layer

The [QMK default Ergodox EZ keymap][] has three layers: a base layer, a layer
for symbols, and a layer for media keys (for our purposes, we can safely ignore
the symbol and media keys layers). Rather than change the base layer directly,
let's copy it into a new layer we will call `CHORD`.

We will then (arbitrarily) assign the top right-most key on the left hand of the
`BASE` layer to be the toggle to turn the `CHORD` layer on and off, using QMK's
[`TG(layer)` function][]:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/keymap.c`**

```c
// ...
#define BASE 0  // default layer
#define SYMB 1  // symbols
#define MDIA 2  // media keys
#define CHORD 3 // chorded QWERTY layer

// Helpers to make keymaps a bit easier to read at a glance
#define ___ KC_TRNS
#define _x_ KC_NO

// ...
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
/* Keymap 0: Basic layer
 *
 * ,--------------------------------------------------. ...
 * |   =    |   1  |   2  |   3  |   4  |   5  |CHORD | ...
 * |--------+------+------+------+------+-------------| ...
 * | Del    |   Q  |   W  |   E  |   R  |   T  |  L1  | ...
 * |--------+------+------+------+------+------|      | ...
 * | BkSp   |   A  |   S  |   D  |   F  |   G  |------| ...
 * |--------+------+------+------+------+------| Hyper| ...
 * | LShift |Z/Ctrl|   X  |   C  |   V  |   B  |      | ...
 * `--------+------+------+------+------+-------------' ...
 * ...
 */
[BASE] = LAYOUT_ergodox(  // layer 0 : default
  // left hand
  KC_EQL,  KC_1,        KC_2, KC_3, KC_4, KC_5, TG(CHORD),
  KC_DELT, KC_Q,        KC_W, KC_E, KC_R, KC_T, TG(SYMB),
  KC_BSPC, KC_A,        KC_S, KC_D, KC_F, KC_G,
  KC_LSFT, CTL_T(KC_Z), KC_X, KC_C, KC_V, KC_B, ALL_T(KC_NO),
  // ...
),
// ...
[SYMB] = LAYOUT_ergodox(
  // ...
),
// ...
[MDIA] = LAYOUT_ergodox(
  // ...
),
/* Keymap 3: Chorded QWERTY
 *
 * ,--------------------------------------------------. ...
 * |   =    |   1  |   2  |   3  |   4  |   5  |      | ...
 * |--------+------+------+------+------+-------------| ...
 * | Del    |  [x] |   W  |   E  |   R  |   T  |  L1  | ...
 * |--------+------+------+------+------+------|      | ...
 * | BkSp   |   Q  |   S  |   D  |   F  |   G  |------| ...
 * |--------+------+------+------+------+------| Hyper| ...
 * | LShift |   Z  |   X  |   C  |   V  |   B  |      | ...
 * `--------+------+------+------+------+-------------' ...
 * ...
 */
[CHORD] = LAYOUT_ergodox( // Layer 3: Chorded QWERTY
  // left hand
  KC_EQL,  KC_1, KC_2, KC_3, KC_4, KC_5, ___,
  KC_DELT, _x_,  KC_W, KC_E, KC_R, KC_T, TG(SYMB),
  KC_BSPC, KC_Q, KC_S, KC_D, KC_F, KC_G,
  KC_LSFT, KC_Z, KC_X, KC_C, KC_V, KC_B, ALL_T(KC_NO),
  // ...
)
};
// ...
```

Let's briefly compare the (abbreviated) `CHORD` layer to the `BASE` layer:

- The right-most key of the first row uses `___` (`KC_TRNS`) as a "transparent"
  mapping.  In this case, it means that the key will "fall back" to the
  `TG(CHORD)` function on the `BASE` layer. This is really just a convenience
  so that we don't need to specify `TG(CHORD)` again on the `CHORD` layer.
- The "Q" key's original position has been replaced with `_x_` (`KC_NO`) for
  the time being, specifically indicating that pressing the key results in a
  [NOOP][]: the keystroke is ignored. We will do something else with this key
  later.
- The "A" key has been removed, and replaced with the "Q" key.
- The default base layer of the Ergodox EZ keymap uses the
  [Mod-Tap][QMK Mod-Tap] advanced keycode shortcut `CTL_T(KC_Z)` to make the
  "Z" key Left Control when held, and "Z" when pressed. Combos only support QMK
  [basic keycodes][QMK basic keycodes], so we've changed the "Z" key to be
  _just_ the "Z" key (`KC_Z`).
  
So, now that we are without a way to print "A" to the screen, let's actually add
in configuration for a combo to enable pressing both "Q" and "Z" to do just
that.

## Opening Combo

The first thing we need to do is give our combo a name. You may have previously
created your own custom keycodes, so if you would like, you may add any named
combos to your `custom_keycodes` list.

However, for this example, let's keep the focus on combos and put them in
their own enumerated type list called `combos`, and place it underneath the
`custom_keycodes` list. Let's also use a naming convention of
`<key 1><key 2>_<output key>` for the entries. So, we'll name a "Q and Z to A"
combo as `QZ_A`:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/keymap.c`**

```c
// ...
enum custom_keycodes {
  // ...
};

enum combos {
  QZ_A
};
// ...
```

Next, we need to define a sequence of keys for our combo in a list, terminated
by [`COMBO_END`][]. Our sequence will consist of the "Q" and "Z" keys, and let's
use a similar naming convention as `combos` and call it `qz_combo`:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/keymap.c`**

```c
// ...
enum combos {
  QZ_A
};

const uint16_t PROGMEM qz_combo[] = {KC_Q, KC_Z, COMBO_END};
// ...
```

The final piece of the combo puzzle is to now create a list of length
`COMBO_COUNT` called [`key_combos`][] that will map our combo sequences to their
resulting actions:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/keymap.c`**

```c
// ...
enum combos {
  QZ_A
};

const uint16_t PROGMEM qz_combo[] = {KC_Q, KC_Z, COMBO_END};

combo_t key_combos[COMBO_COUNT] = {
  [QZ_A] = COMBO(qz_combo, KC_A)
};
// ...
```

> Currently, `key_combos` only has one element, but when we eventually add more
to it, we will need to change the `COMBO_COUNT` value in `config.h` accordingly.

Great, we have now configured our first combo! Let's now generate the firmware
from the `qmk_firmware` directory root path:

```sh
make ergodox_ez:chorded_qwerty
```

This should generate an `ergodox_ez_chorded_qwerty.hex` file, which you can then
use to [flash your Ergodox firmware][Ergodox EZ Graphical Configurator Page].

Once you have flashed your firmware, switch over to the `CHORD` layer, press
the "Q" and "Z" keys together, and it should output "a". As expected, if you
hold down Shift and press "Q" and "Z" together, it should output uppercase "A".

## Finishing Combos

Now that we have one combo working, the same principles apply in combos for the
remaining QWERTY middle row keys. We will end up with 10 combos total, so first,
let's update `COMBO_COUNT`:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/config.h`**

```c
// ...
#define COMBO_COUNT 10
```

Now, let's add in configuration for the rest of the combos:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/keymap.c`**

```c
// ...
enum combos {
  QZ_A,
  WX_S,
  EC_D,
  RV_F,
  TB_G,
  YN_H,
  UM_J,
  ICOMMA_K,
  ODOT_L,
  PSLASH_SCOLON
};

const uint16_t PROGMEM qz_combo[] = {KC_Q, KC_Z, COMBO_END};
const uint16_t PROGMEM wx_combo[] = {KC_W, KC_X, COMBO_END};
const uint16_t PROGMEM ec_combo[] = {KC_E, KC_C, COMBO_END};
const uint16_t PROGMEM rv_combo[] = {KC_R, KC_V, COMBO_END};
const uint16_t PROGMEM tb_combo[] = {KC_T, KC_B, COMBO_END};
const uint16_t PROGMEM yn_combo[] = {KC_Y, KC_N, COMBO_END};
const uint16_t PROGMEM um_combo[] = {KC_U, KC_M, COMBO_END};
const uint16_t PROGMEM icomma_combo[] = {KC_I, KC_COMMA, COMBO_END};
const uint16_t PROGMEM odot_combo[] = {KC_O, KC_DOT, COMBO_END};
const uint16_t PROGMEM pslash_combo[] = {KC_P, KC_SLASH, COMBO_END};

combo_t key_combos[COMBO_COUNT] = {
  [QZ_A] = COMBO(qz_combo, KC_A),
  [WX_S] = COMBO(wx_combo, KC_S),
  [EC_D] = COMBO(ec_combo, KC_D),
  [RV_F] = COMBO(rv_combo, KC_F),
  [TB_G] = COMBO(tb_combo, KC_G),
  [YN_H] = COMBO(yn_combo, KC_H),
  [UM_J] = COMBO(um_combo, KC_J),
  [ICOMMA_K] = COMBO(icomma_combo, KC_K),
  [ODOT_L] = COMBO(odot_combo, KC_L),
  [PSLASH_SCOLON] = COMBO(pslash_combo, KC_SCOLON)
};

// ...
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
// ...
/* Keymap 3: Chorded QWERTY
 *
 * ,--------------------------------------------------.  ,--------------------------------------------------.
 * |   =    |   1  |   2  |   3  |   4  |   5  |CHORD |  | RIGHT|   6  |   7  |   8  |   9  |   0  |   -    |
 * |--------+------+------+------+------+-------------|  |------+------+------+------+------+------+--------|
 * | Del    |  [x] |  [x] |  [x] |  [x] |  [x] |  L1  |  |  L1  |  [x] |  [x] |  [x] |  [x] |  [x] |   \    |
 * |--------+------+------+------+------+------|      |  |      |------+------+------+------+------+--------|
 * | BkSp   |   Q  |   W  |   E  |   R  |   T  |------|  |------|   Y  |   U  |   I  |   O  |   P  |' / Cmd |
 * |--------+------+------+------+------+------| Hyper|  | Meh  |------+------+------+------+------+--------|
 * | LShift |   Z  |   X  |   C  |   V  |   B  |      |  |      |   N  |   M  |   ,  |   .  |   /  | RShift |
 * `--------+------+------+------+------+-------------'  `-------------+------+------+------+------+--------'
 * ...
 */
[CHORD] = LAYOUT_ergodox( // Layer 3: Chorded QWERTY
  // left hand
  KC_EQL,  KC_1, KC_2, KC_3, KC_4, KC_5, ___,
  KC_DELT, _x_,  _x_,  _x_,  _x_,  _x_,  TG(SYMB),
  KC_BSPC, KC_Q, KC_W, KC_E, KC_R, KC_T,
  KC_LSFT, KC_Z, KC_X, KC_C, KC_V, KC_B, ALL_T(KC_NO),
  // ...

  // right hand
  KC_RGHT,      KC_6, KC_7, KC_8,    KC_9,   KC_0,    KC_MINS,
  TG(SYMB),     _x_,  _x_,  _x_,     _x_,    _x_,     KC_BSLS,
                KC_Y, KC_U, KC_I,    KC_O,   KC_P,    GUI_T(KC_QUOT),
  MEH_T(KC_NO), KC_N, KC_M, KC_COMM, KC_DOT, KC_SLSH, KC_RSFT,
  // ...
)
};
// ...
```

Now, re-generate your firmware:

```sh
make ergodox_ez:chorded_qwerty
```

Flash your firmware and you should now have a chorded middle QWERTY row!

You now have a full row of keys to re-assign values as you please. You could
bring the number keys down a row, or perhaps create some more `custom_keycodes`
to assign to them. Just for fun, let's get those keys to mimic a [stenotype
number bar][].

## Steno Number Combos

To successfully imitate a stenotype number bar and the chords for stenotype
numbers, we will need to do the following:

- create a new custom keycode that represents a number bar press - let's call it
  `NUM`
- assign `NUM` to _all_ of the keys we are currently not using
- create the following combos:
  - Pressing `NUM` and each of the `QWER` keys will output numbers `1-4`
  - Pressing `NUM` and each of the `UIOP` keys will output numbers `6-9`
  - Pressing `NUM` and the `Space` key will output `5`
  - Pressing `NUM` and the `Backspace` key will output `0`

> The Space and Backspace keys here represent where I would place the stenotype
keyboard "A" and "O" keys respectively on an Ergodox using the default QMK
layout we have been modifying.

Here is what those changes will entail:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/config.h`**

```c
// ...
#define COMBO_COUNT 20
```

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/keymap.c`**

```c
// ...
enum custom_keycodes {
  // ...
  NUM
}

enum combos {
  // ...
  NUMQ_1,
  NUMW_2,
  NUME_3,
  NUMR_4,
  NUMSPACE_5,
  NUMU_6,
  NUMI_7,
  NUMO_8,
  NUMP_9,
  NUMBSPACE_0
};

// ...
const uint16_t PROGMEM numq_combo[] = {NUM, KC_Q, COMBO_END};
const uint16_t PROGMEM numw_combo[] = {NUM, KC_W, COMBO_END};
const uint16_t PROGMEM nume_combo[] = {NUM, KC_E, COMBO_END};
const uint16_t PROGMEM numr_combo[] = {NUM, KC_R, COMBO_END};
const uint16_t PROGMEM numspace_combo[] = {NUM, KC_SPACE, COMBO_END};
const uint16_t PROGMEM numu_combo[] = {NUM, KC_U, COMBO_END};
const uint16_t PROGMEM numi_combo[] = {NUM, KC_I, COMBO_END};
const uint16_t PROGMEM numo_combo[] = {NUM, KC_O, COMBO_END};
const uint16_t PROGMEM nump_combo[] = {NUM, KC_P, COMBO_END};
const uint16_t PROGMEM numbspace_combo[] = {NUM, KC_BSPACE, COMBO_END};

combo_t key_combos[COMBO_COUNT] = {
  // ...
  [NUMQ_1] = COMBO(numq_combo, KC_1),
  [NUMW_2] = COMBO(numw_combo, KC_2),
  [NUME_3] = COMBO(nume_combo, KC_3),
  [NUMR_4] = COMBO(numr_combo, KC_4),
  [NUMSPACE_5] = COMBO(numspace_combo, KC_5),
  [NUMU_6] = COMBO(numu_combo, KC_6),
  [NUMI_7] = COMBO(numi_combo, KC_7),
  [NUMO_8] = COMBO(numo_combo, KC_8),
  [NUMP_9] = COMBO(nump_combo, KC_9),
  [NUMBSPACE_0] = COMBO(numbspace_combo, KC_0)
};

// ...
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
// ...
/* Keymap 3: Chorded QWERTY
 *
 * ,--------------------------------------------------.           ,--------------------------------------------------.
 * |   =    |   1  |   2  |   3  |   4  |   5  |CHORD |           | RIGHT|   6  |   7  |   8  |   9  |   0  |   -    |
 * |--------+------+------+------+------+-------------|           |------+------+------+------+------+------+--------|
 * | Del    |  NUM |  NUM |  NUM |  NUM |  NUM |  L1  |           |  L1  |  NUM |  NUM |  NUM |  NUM |  NUM |   \    |
 * |--------+------+------+------+------+------|      |           |      |------+------+------+------+------+--------|
 * | BkSp   |   Q  |   W  |   E  |   R  |   T  |------|           |------|   Y  |   U  |   I  |   O  |   P  |' / Cmd |
 * |--------+------+------+------+------+------| Hyper|           | Meh  |------+------+------+------+------+--------|
 * | LShift |   Z  |   X  |   C  |   V  |   B  |      |           |      |   N  |   M  |   ,  |   .  |   /  | RShift |
 * `--------+------+------+------+------+-------------'           `-------------+------+------+------+------+--------'
 *   |Grv/L1|  '"  |AltShf| Left | Right|                                       |  Up  | Down |   [  |   ]  | ~L1  |
 *   `----------------------------------'                                       `----------------------------------'
 *                                        ,-------------.       ,-------------.
 *                                        | App  | LGui |       | Alt  |Ctrl/Esc|
 *                                 ,------|------|------|       |------+--------+------.
 *                                 |      |      | Home |       | PgUp |        |      |
 *                                 | Space|Backsp|------|       |------|  Tab   |Enter |
 *                                 |      |ace   | End  |       | PgDn |        |      |
 *                                 `--------------------'       `----------------------'
 */
[CHORD] = LAYOUT_ergodox( // Layer 3: Chorded QWERTY
  // left hand
  KC_EQL,          KC_1,        KC_2,          KC_3,    KC_4,    KC_5,    ___,
  KC_DELT,         NUM,         NUM,           NUM,     NUM,     NUM,     TG(SYMB),
  KC_BSPC,         KC_Q,        KC_W,          KC_E,    KC_R,    KC_T,
  KC_LSFT,         KC_Z,        KC_X,          KC_C,    KC_V,    KC_B,    ALL_T(KC_NO),
  LT(SYMB,KC_GRV), KC_QUOT,     LALT(KC_LSFT), KC_LEFT, KC_RGHT,
                                                           ALT_T(KC_APP), KC_LGUI,
                                                                          KC_HOME,
                                                         KC_SPC, KC_BSPC, KC_END,
  // right hand
  KC_RGHT,      KC_6,          KC_7,    KC_8,    KC_9,    KC_0,    KC_MINS,
  TG(SYMB),     NUM,           NUM,     NUM,     NUM,     NUM,     KC_BSLS,
                KC_Y,          KC_U,    KC_I,    KC_O,    KC_P,    GUI_T(KC_QUOT),
  MEH_T(KC_NO), KC_N,          KC_M,    KC_COMM, KC_DOT,  KC_SLSH, KC_RSFT,
                               KC_UP,   KC_DOWN, KC_LBRC, KC_RBRC, TT(SYMB),
  KC_LALT,      CTL_T(KC_ESC),
  KC_PGUP,
  KC_PGDN,      KC_TAB,        KC_ENT
)
};
// ...
```

Re-generate and re-flash the firmware, and you will now have combos
approximating number input on a stenotype keyboard!

## Multi-key Combos

Although all of the combos we have created so far have been two-key combos, you
are certainly not limited to just two keys. To demonstrate this, let's create a
combo that mimics the chord needed to output a full stop (`.`) on a
[stenotype keyboard][steno machine keymap] (yes, I know this is not particularly
practical on this layout, but play along just for this example).

The chord for a full stop in steno is `TP-LT`, meaning that the "T" and "P" keys
on the left half of the keyboard, and the "L" and "T" keys on the right half of
the keyboard are pressed together. This corresponds to pressing the `WEIO` keys
together in the chorded QWERTY layout, so let's configure that in:

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/config.h`**

```c
// ...
#define COMBO_COUNT 21
```

**`qmk_firmware/keyboards/ergodox_ez/keymaps/chorded_qwerty/keymap.c`**

```c
// ...
enum combos {
  // ...
  WEIO_DOT
};

// ...
const uint16_t PROGMEM weio_combo[] = {KC_W, KC_E, KC_I, KC_O, COMBO_END};

combo_t key_combos[COMBO_COUNT] = {
  // ...
  [WEIO_DOT] = COMBO(weio_combo, KC_DOT)
};
```

No need to change any of the keymaps for this combo. If you now re-generate
and re-flash your firmware, you will have a chorded full stop.

## Conclusion

Learning about QMK combos was pretty useful, but should anyone _actually_
consider chording their QWERTY layout if they are on a keyboard with enough keys
to support each letter, or will doing this hinder more than help?

After putting in the effort to write this blog post, it pains me to say that,
at least for me, at the time of this writing, it hinders more than helps for
probably the following reasons:

- I have too many years worth of touch typing muscle memory invested into the
  standard QWERTY layout: fighting back against inertia is hard.
- I am learning stenography, and my brain seems to have siloed chorded key
  presses to the stenotype layout. There would seem to now be a trigger in
  my brain that fires when I move my fingers from QWERTY home row to steno home
  row, and I got very confused when I attempted to try and type QWERTY when my
  brain was in "steno mode". I would wager that perhaps this might be worth
  re-visiting if I become more competent/confident in steno and/or end up using
  a keyboard like the Georgi, where there is no physical full-size QWERTY
  keyboard available, and I am forced to adapt.

So, ultimately, your mileage may vary for chorded QWERTY, but I really like QMK
combos themselves, and look forward to experimenting with them: perhaps by
replacing some keyboard shortcuts with chords instead.

If you do use QMK combos for anything interesting, please do reach out and let
me know!

[Chorded QWERTY image]: /assets/images/2019-04-28/chorded-qwerty.png
[`COMBO_END`]: https://github.com/qmk/qmk_firmware/blob/bc536b9b6d98e5428a28f6e6ba69675bd77b79cc/quantum/process_keycode/process_combo.h#L49
[Ergodox]: https://www.ergodox.io/
[Ergodox EZ Graphical Configurator Page]: https://ergodox-ez.com/pages/graphical-configurator
[Escape the defaults and Control your keyboard with QMK]: https://paulfioravanti.com/blog/2018/07/31/escape-the-defaults-and-control-your-keyboard-with-qmk/
[G20]: https://pimpmykeyboard.com/g20-blank-keysets/
[Georgi]: https://www.gboards.ca/product/georgi
[Georgi image]: /assets/images/2019-04-28/georgi.jpg
[Georgi is the most nonQMK layout]: https://github.com/qmk/qmk_firmware/blob/9c98fef4f6d35d9e07865b119550f6e7e9e6610d/keyboards/georgi/keymaps/default/keymap.c#L2
[Georgi QMK firmware]: https://github.com/qmk/qmk_firmware/tree/master/keyboards/georgi
[`key_combos`]: https://github.com/qmk/qmk_firmware/blob/02b74d521bf84ba776a5920289887ad418806311/quantum/process_keycode/process_combo.c#L20
[Keyboard Ghosting Test]: https://github.com/openstenoproject/plover/wiki/Supported-Hardware#test-2-keyboard-ghosting-test
[_N_-Key Rollover]: https://en.wikipedia.org/wiki/Rollover_(key)#n-key_rollover
[NOOP]: https://en.wikipedia.org/wiki/NOP_(code)
[Planck]: https://olkb.com/planck
[Plover]: http://www.openstenoproject.org/plover/
[Plover in-browser steno demo]: http://www.openstenoproject.org/demo/
[QMK basic keycodes]: https://docs.qmk.fm/#/keycodes_basic
[QMK Combos]: https://github.com/qmk/qmk_firmware/blob/master/docs/feature_combo.md
[QMK default Ergodox EZ keymap]: https://github.com/qmk/qmk_firmware/blob/master/keyboards/ergodox_ez/keymaps/default
[QMK Ergodox Chorded QWERTY Example]: https://github.com/paulfioravanti/qmk_example_keymaps/tree/master/keyboards/ergodox_ez/keymaps/chorded_qwerty
[QMK Installing Build Tools]: https://docs.qmk.fm/#/getting_started_build_tools
[QMK firmware]: https://qmk.fm/
[QMK's list of supported keyboards]: https://github.com/qmk/qmk_firmware/tree/master/keyboards
[QMK Mod-Tap]: https://docs.qmk.fm/#/feature_advanced_keycodes?id=mod-tap
[Starting Stenography with an Ergodox]: https://paulfioravanti.com/blog/2018/10/18/starting-stenography-with-an-ergodox/
[steno machine keymap]: https://sites.google.com/site/ploverdoc/lesson-1-fingers-and-keys#TOC-The-Keyboard
[Stenotype]: https://en.wikipedia.org/wiki/Stenotype
[stenotype number bar]: https://sites.google.com/site/ploverdoc/lesson-8-numbers
[`TG(layer)` function]: https://docs.qmk.fm/#/feature_advanced_keycodes?id=switching-and-toggling-layers
