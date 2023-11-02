---
title: "Get on the Same Page as your HID Device"
date: 2023-10-25 16:25 +1100
last_modified_at: 2023-10-26 11:40 +1100
tags: clang HID hidapi georgi stenography steno keyboards
header:
  image: /assets/images/2023-10-25/dot-matrix-printer.jpg
  image_description: "Epson LX-300+ dot matrix printer with optional colour kit"
  teaser: /assets/images/2023-10-25/dot-matrix-printer.jpg
  overlay_image: /assets/images/2023-10-25/dot-matrix-printer-overlay.jpg
  overlay_filter: 0.4
  caption: >
    <a href="https://commons.wikimedia.org/wiki/File:Epson_LX-300%2B_dot_matrix_printer_with_colour_kit.JPG">Corvair</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons
excerpt: >
  Does communicating with your HID device seem flaky? You may be looking at the
  wrong (usage) page.
---

I use the [Human Interface Device][] (HID) specification to enable programs I
write to communicate back and forth directly with my [USB][] keyboards.

Specifically, I leverage the [HIDAPI][] library to enable an [Elgato Stream Deck
Pedal][] to talk to my [Georgi][] keyboard via my computer, and help me use
[steno][] chords to defeat demon hordes when playing [Doom Typist][].[^1]

<div class="centered-image" style="width: 90%">
  <figure>
    <img src="/assets/images/2023-10-25/georgi.jpg"
         alt="Georgi keyboard">
  </figure>
</div>

...Which is all great, when it actually works. However, every time I would
attempt to make a connection to the Georgi via my "[host][]" program, sometimes
it would work, sometimes not. The failures seemed to happen at completely random
intervals, making gameplay frustrating. Was the problem with my code? The
device? A platform (in my case macOS) related issue? Something else? I had no
idea.

## Example Host

Let's illustrate the problem by recreating (and slightly simplifying) the
[example host program][] from the HIDAPI `README` file. It will:

- Initialise the HID library
- Attempt to connect to the Georgi using [its Product ID and Vendor ID][]
  [hexadecimal][] values (printing an error message and exiting if it fails)
- Attempt to read the Georgi's manufacturer string and print it out
- Clean up and exit

**`host.c`**

```c
#include <stdio.h> // printf
#include <wchar.h> // wchar_t

#include <hidapi.h>

#define MAX_STR 255

int main(int argc, char* argv[]) {
  int res;
  unsigned char buf[65];
  wchar_t wstr[MAX_STR];
  hid_device *handle;

  // Initialize the hidapi library
  res = hid_init();

  // Open the Georgi using the VID, PID.
  handle = hid_open(0xFEED, 0x1337, NULL);
  if (!handle) {
    printf("Unable to open device\n");
    hid_exit();
    return 1;
  }

  // Read the Manufacturer String
  res = hid_get_manufacturer_string(handle, wstr, MAX_STR);
  printf("Manufacturer String: %ls\n", wstr);

  // Close the device
  hid_close(handle);

  // Finalize the hidapi library
  res = hid_exit();

  return 0;
}
```

Now, compile the file with [`gcc`][] (and [`pkg-config`][] to bring in the
HIDAPI library):

```console
gcc $(pkg-config --cflags --libs hidapi) host.c -o host
```

And, this was the output of running the host file a few times:

```console
$ ./host
Manufacturer String: g Heavy Industries
$ ./host
Unable to open device
$ ./host
Manufacturer String: g Heavy Industries
$ ./host
Manufacturer String: g Heavy Industries
$ ./host
Unable to open device
$ ./host
Unable to open device
$ ./host
Unable to open device
$ ./host
Unable to open device
$ ./host
Unable to open device
$ ./host
Manufacturer String: g Heavy Industries
```

Looks like pretty random failures to me! There is probably not much more we can
do with the host file at the moment, so it would seem the next step in getting
to the bottom of this problem would be to dive one level deeper, and see what
happens when an attempt to open a device is made.

## Opening Devices

From the API in the host code, we can see that the [`hid_open`][] function is
responsible for opening devices, so let's check out the HIDAPI codebase and see
what it does:

[**`hidapi/libusb/hid.c`**][`hid_open`]

```c
hid_device * hid_open(unsigned short vendor_id, unsigned short product_id, const wchar_t *serial_number)
{
    struct hid_device_info *devs, *cur_dev;
    const char *path_to_open = NULL;
    hid_device *handle = NULL;

    devs = hid_enumerate(vendor_id, product_id);
    cur_dev = devs;
    while (cur_dev) {
        if (cur_dev->vendor_id == vendor_id && cur_dev->product_id == product_id) {
            // ... serial_number-related code snipped for brevity ...
            path_to_open = cur_dev->path;
            break;
        }
        cur_dev = cur_dev->next;
    }

    if (path_to_open) {
        /* Open the device */
        handle = hid_open_path(path_to_open);
    }

    hid_free_enumeration(devs);

    return handle;
}
```

This code retrieves a list of devices that match the vendor and product IDs
([`hid_enumerate`][])[^2]. It then attempts to open the first device it finds in
that list where the IDs match ([`hid_open_path`][]), and returns a [handle][]
reference to it. Even if the `handle` to the device is not `NULL`, it is unknown
at this point whether it can be read from or written to.

This code surprised me because I would have thought that given a set of IDs,
that are presumably unique (...but I guess not...?[^3]), there would only ever be
one device that would get opened. So, given that the host code works
_sometimes_, it seems that when `hid_enumerate` is called, the Georgi is
_sometimes_ the first device in the returned list (and hence opened
successfully), but _sometimes_ not, resulting in the attempted opening of...some
other device...?

Regardless, what I do know is that the host code will need to change to reflect
the dynamic ordering of the list provided from `hid_enumerate`, and will need to
deal with potentially performing a `hid_get_manufacturer_string` function call
against each device in that list, until it gets back a successful response.

Before starting on those changes, though, how can we find out what devices
are actually showing up where we do not expect them? Is there something we can
use to show us what HIDAPI is seeing? Thankfully, yes.

## Testing the HID API

[`hidapitester`][] is a command-line tool that can test out every API call in
the HIDAPI library. Let's first use it to get the lay of the device land by
asking it to just list the available devices that are on my computer:

```console
$ ./hidapitester --list
05AC/8104: Apple -
05AC/8104: Apple -
05AC/0342: Apple Inc. - Apple Internal Keyboard / Trackpad
05AC/0342: Apple Inc. - Apple Internal Keyboard / Trackpad
0000/0000: Apple -
0000/0000: Apple - Headset
05AC/0342: Apple Inc. - Apple Internal Keyboard / Trackpad
FEED/1337: g Heavy Industries - Georgi
0FD9/0086: Elgato - Stream Deck Pedal
05AC/8104: Apple -
05AC/8104: Apple -
05AC/0342:  - Keyboard Backlight
0000/0000: Apple -
0000/0000: APPL - BTM
0000/0000: Apple -
05AC/0342: Apple Inc. - Apple Internal Keyboard / Trackpad
FEED/1337: g Heavy Industries - Georgi
FEED/1337: g Heavy Industries - Georgi
FEED/1337: g Heavy Industries - Georgi
FEED/1337: g Heavy Industries - Georgi
FEED/1337: g Heavy Industries - Georgi
05AC/0342: Apple Inc. - Apple Internal Keyboard / Trackpad
05AC/0342: Apple Inc. - Apple Internal Keyboard / Trackpad
05AC/0342: Apple Inc. - Apple Internal Keyboard / Trackpad
0000/0000: Apple -
```

Aside from lots of random Apple-related entries, we can see 6 devices that
identify as the Georgi with the `0xFEED/0x1337` VID/PID combination, and they
seem to be in 2 groupings(?), consisting of 1 and 5 entries. Compare that to the
easy-to-distinguish Elgato Stream Deck Pedal, with just a single device
detected.

So, which one of these is the "real" Georgi? Let's further refine the
`hidapitester` command and see if we can print out more details:

```console
./hidapitester --vidpid FEED:1337 --list-detail
FEED/1337: g Heavy Industries - Georgi
  vendorId:      0xFEED
  productId:     0x1337
  usagePage:     0xFF60
  usage:         0x0061
  serial_number:
  interface:     1
  path: DevSrvsID:4294971346

FEED/1337: g Heavy Industries - Georgi
  vendorId:      0xFEED
  productId:     0x1337
  usagePage:     0x0001
  usage:         0x0006
  serial_number:
  interface:     0
  path: DevSrvsID:4294971342

FEED/1337: g Heavy Industries - Georgi
  vendorId:      0xFEED
  productId:     0x1337
  usagePage:     0x0001
  usage:         0x0002
  serial_number:
  interface:     0
  path: DevSrvsID:4294971342

FEED/1337: g Heavy Industries - Georgi
  vendorId:      0xFEED
  productId:     0x1337
  usagePage:     0x0001
  usage:         0x0001
  serial_number:
  interface:     0
  path: DevSrvsID:4294971342

FEED/1337: g Heavy Industries - Georgi
  vendorId:      0xFEED
  productId:     0x1337
  usagePage:     0x0001
  usage:         0x0080
  serial_number:
  interface:     0
  path: DevSrvsID:4294971342

FEED/1337: g Heavy Industries - Georgi
  vendorId:      0xFEED
  productId:     0x1337
  usagePage:     0x000C
  usage:         0x0001
  serial_number:
  interface:     0
  path: DevSrvsID:4294971342
```

The details have provided us with extra hexadecimal values called "usage page"
and "usage", and a number for an "interface"[^4].

Since we have five entries with an interface value of `0`, and one with `1`,
that would seem to explain the "groupings" we saw earlier in the device list.
But what does this new set of "usage" hexadecimal numbers mean?

## HIDAPI Usage

The concept of "usage" and "usage pages" in the context of HIDAPI is, I think,
best described in [this article][Connecting to uncommon HID devices]:

> "An HID usage is a numeric value referring to a standardized input or output.
> Usage values allow a device to describe the intended use of the device [...].
> For example, one is defined for the left button of a mouse. Usages are also
> organized into usage pages, which provide an indication of the high-level
> category of the device or report.

Hexadecimal numbers are a bit abstract in conveying what this "intended use"
really means, but, fortunately for us, we can use the [Web HID Explorer][] to
get some more human-readable information:

### Interface 0

```console
productName: Georgi
vendorId:    0xFEED (65261) Unknown vendor
productId:   0x1337 (4919)
opened:      false
collections[0]
  Usage: 0001:0006 (Generic Desktop > Keyboard)
collections[1]
  Usage: 0001:0002 (Generic Desktop > Mouse)
collections[2]
  Usage: 0001:0080 (Generic Desktop > System Control)
collections[3]
  Usage: 000C:0001 (Consumer > Consumer Control)
  Input reports: 0x04
collections[4]
  Usage: 0001:0006 (Generic Desktop > Keyboard)
Input report 0x04
  16 bits (bits 0 to 15)
    Data,Ary,Abs
    Usages: 000C:0001 (Consumer > Consumer Control) to 000C:02A0 (Consumer > AC Soft Key Left)
    Logical bounds: 1 to 672
```

### Interface 1

```console
productName: Georgi
vendorId:    0xFEED (65261) Unknown vendor
productId:   0x1337 (4919)
opened:      true
collections[0]
  Usage: FF60:0061 (Vendor-defined page 0xFF60 usage 0x0061)
  Input reports: 0x00
  Output reports: 0x00
Input report 0x00
  32 values * 8 bits (bits 0 to 255)
    Data,Var,Abs
    Usage: FF60:0062 (Vendor-defined page 0xFF60 usage 0x0062)
    Logical bounds: 0 to 255
Output report 0x00
  32 values * 8 bits (bits 0 to 255)
    Data,Var,Abs
    Usage: FF60:0063 (Vendor-defined page 0xFF60 usage 0x0063)
    Logical bounds: 0 to 255
```

I guess in the end we can consider the human-readable information "nice to
know", but my main takeaway from all this would be that the `usagePage:usage`
pair feel quite similar to the `vid:pid` pair, in terms of their hierarchical
relationship to each other.

Anyway, it seems we will need to use all four values in the host code in order
to make a stable connection to a device. However, there is no real way to know
in advance which usage values will successfully open up that connection (even
the information above does not hint at that...at least, not that I can see).
Therefore, the host code will need to be changed to handle the following
scenarios:

- Where a `usagePage:usage` pair _are not_ present, loop over the
  `vid:pid`-matching devices, and attempt to make a connection with each one
  until successful. Also, log out the device details on each attempt, so we can
  find out which usage values to use on future attempts so that...
- Where a `usagePage:usage` pair _are_ present, loop over the `vid:pid`-matching
  devices until a match is found for the usage values, and only attempt to make
  a connection with that device

Let's give it a try!

## Host with Usage

First, let's change the host code to make a connection with each device in the
list until it is successful, rather than just blindly return the list's first
device. Instead of calling `hid_open`, let's adapt its internals to fit our
needs:

**`host.c`**

```c
#include <stdio.h> // printf
#include <wchar.h> // wchar_t

#include <hidapi.h>

#define MAX_STR 255

enum {
  VENDOR_ID = 0xFEED,
  PRODUCT_ID = 0x1337
};

int main(int argc, char* argv[]) {
  int res;
  unsigned char buf[65];
  wchar_t wstr[MAX_STR];
  hid_device *handle = NULL;

  // Initialize the hidapi library
  res = hid_init();

  struct hid_device_info *devices, *current_device;
  // Enumerate over the Georgi devices using the VID, PID.
  devices = hid_enumerate(VENDOR_ID, PRODUCT_ID);
  current_device = devices;

  while (current_device) {
    unsigned short usage_page = current_device->usage_page;
    unsigned short usage = current_device->usage;

    printf("Opening -- Usage (page): 0x%hx (0x%hx)...\n", usage, usage_page);
    handle = hid_open_path(current_device->path);

    if (!handle) {
      printf("Unable to open device\n");
      current_device = current_device->next;
      continue;
    }

    printf("Success!\n");
    break;
  }

  hid_free_enumeration(devices);

  // Read the Manufacturer String
  res = hid_get_manufacturer_string(handle, wstr, MAX_STR);
  printf("Manufacturer String: %ls\n", wstr);

  // Close the device if its valid
  if (handle) {
    hid_close(handle);
  }

  // Finalize the hidapi library
  res = hid_exit();

  return 0;
}
```

Compiling and running the changed host file a couple of times gives us the
following output:

```console
$ ./host
Opening -- Usage (page): 0x6 (0x1)...
Unable to open device
Opening -- Usage (page): 0x2 (0x1)...
Unable to open device
Opening -- Usage (page): 0x1 (0x1)...
Unable to open device
Opening -- Usage (page): 0x80 (0x1)...
Unable to open device
Opening -- Usage (page): 0x1 (0xc)...
Unable to open device
Opening -- Usage (page): 0x61 (0xff60)...
Success!
Manufacturer String: g Heavy Industries
$ ./host
Opening -- Usage (page): 0x61 (0xff60)...
Success!
Manufacturer String: g Heavy Industries
```

Great! We get a successful connection every time at usage `FF60:61`, and can
confidently say _that_ is our target device. Now, since every connection we open
exerts a time cost, let's change the host code to skip devices that we now know
will not give us a successful connection, while still handling the possibility
that we may not know the usage values of other devices we may want to connect
to:

**`host.c`**

```c
#include <stdio.h> // printf
#include <wchar.h> // wchar_t

#include <hidapi.h>

#define MAX_STR 255

enum {
  VENDOR_ID = 0xFEED,
  PRODUCT_ID = 0x1337,
  // Set usage values to 0 if unknown.
  USAGE_PAGE = 0xFF60,
  USAGE = 0x61
};

int main(int argc, char* argv[]) {
  int res;
  unsigned char buf[65];
  wchar_t wstr[MAX_STR];
  hid_device *handle = NULL;

  // Initialize the hidapi library
  res = hid_init();

  struct hid_device_info *devices, *current_device;
  // Enumerate over the Georgi devices using the VID, PID.
  devices = hid_enumerate(VENDOR_ID, PRODUCT_ID);
  current_device = devices;
  int usage_known = (USAGE_PAGE != 0) && (USAGE != 0);

  while (current_device) {
    unsigned short usage_page = current_device->usage_page;
    unsigned short usage = current_device->usage;

    if (usage_known && (usage_page != USAGE_PAGE || usage != USAGE)) {
      printf("Skipping -- Usage (page): 0x%hx (0x%hx)\n", usage, usage_page);
      current_device = current_device->next;
      continue;
    }

    printf("Opening -- Usage (page): 0x%hx (0x%hx)...\n", usage, usage_page);
    handle = hid_open_path(current_device->path);

    if (!handle) {
      printf("Unable to open device\n");
      if (usage_known) {
        break;
      } else {
        current_device = current_device->next;
        continue;
      }
    }

    printf("Success!\n");
    break;
  }

  hid_free_enumeration(devices);

  // Read the Manufacturer String
  res = hid_get_manufacturer_string(handle, wstr, MAX_STR);
  printf("Manufacturer String: %ls\n", wstr);

  // Close the device if its valid
  if (handle) {
    hid_close(handle);
  }

  // Finalize the hidapi library
  res = hid_exit();

  return 0;
}
```

Compiling and running these changes a couple of times gives us the following
output:

```console
$ ./host
Skipping -- Usage (page): 0x6 (0x1)
Skipping -- Usage (page): 0x2 (0x1)
Skipping -- Usage (page): 0x1 (0x1)
Skipping -- Usage (page): 0x80 (0x1)
Skipping -- Usage (page): 0x1 (0xc)
Opening -- Usage (page): 0x61 (0xff60)...
Success!
Manufacturer String: g Heavy Industries
$ ./host
Opening -- Usage (page): 0x61 (0xff60)...
Success!
Manufacturer String: g Heavy Industries
```

It works! And, if you have been following along (with your own Georgi or other
keyboard of choice), you will notice that successful connections are now made
much faster, even if you do not hit the target device on the first try!

So, if you ever find yourself writing custom firmware that connects to HID
devices, remember to always include the usage values, as well as vendor/product
IDs, to ensure you can get a stable connection.

> If you are interested in seeing other host code containing more robust error
> handling, and the reading and writing of custom information to and from a
> device, check out my [HID Host][] GitHub repository.

[^1]: I've written about playing [Doom][] [1993] with steno in
      _[Steno Gaming: Doom Typist][]_, but the mechanics around making
      communication possible between the Georgi, Elgato pedal, and [Plover][]
      probably warrants its own blog post. If you're game, you can check out the
      code specifics in the following GitHub repos: [HID Host][],
      [Steno Tape][], and my [Georgi firmware][].

[^2]: Yes, technically, it is a [pointer][] to a [linked list][] of
      [`hid_device_info`][] `struct`s, but that detail can be glossed over in
      this context.

[^3]: Vendor IDs are meant to be globally unique, while product IDs are meant to
      be unique within the scope of a vendor ID. The [USB Implementers Forum][]
      (USB-IF) is the ["authority which assigns and maintains all USB Vendor ID
      Numbers"][Valid USB Vendor ID Numbers] (a vendor ID
      [costs US$6000][Getting a Vendor ID] as of this writing). Also, apparently
      "unauthorized use of assigned or unassigned USB Vendor ID Numbers is
      strictly prohibited". However, a search of popular hobbyist keyboard
      firmware [QMK][]'s codebase reveals that [hundreds of devices][] aside
      from the Georgi use `0xFEED` as their vendor ID (it seems to be QMK's
      arbitrarily assigned [default vendor ID][]).
      So, we can conclude that:

      - the `0xFEED` vendor ID does not belong exclusively to the Georgi
      - enforcement of vendor ID uniqueness is lax/non-existent
      - we cannot rely on the VID/PID combo alone to open a connection to a
        device: we need more information to target it correctly

[^4]: Since I could not find any references on the web that describe what an
      "interface" means within the context of HIDAPI, [ChatGPT][] says that it
      "can represent a specific device or a group of similar devices that share
      a common way of communicating with the computer. These interfaces are
      identified by interface numbers and can have different features, reports,
      and capabilities depending on the type of HID device". I am not sure why
      the Georgi would need multiple ways to communicate with the computer, but
      I am just going to consider this an implementation detail we do not need
      to concern ourselves with. Also, as an aside, I cannot believe we are at
      the stage where I am quoting AI...

[ChatGPT]: https://chat.openai.com/
[Connecting to uncommon HID devices]: https://developer.chrome.com/en/articles/hid/#terminology
[default vendor ID]: https://github.com/qmk/qmk_firmware/blob/ca4541699915b37cd1f253bbed51854627efd2ce/docs/faq_build.md?plain=1#L54
[Doom]: https://en.wikipedia.org/wiki/Doom_(1993_video_game)
[Doom Typist]: https://github.com/mmaulwurff/typist.pk3
[Elgato Stream Deck Pedal]: https://www.elgato.com/us/en/p/stream-deck-pedal
[example host program]: https://github.com/libusb/hidapi/blob/baa0dab6114e8654161478e10a20c67cf5d1a1a3/README.md#what-does-the-api-look-like
[`gcc`]: https://gcc.gnu.org/
[Georgi]: https://qmk.fm/keyboards/georgi/
[Georgi firmware]: https://github.com/paulfioravanti/qmk_keymaps/tree/master/keyboards/gboards/georgi/keymaps/paulfioravanti
[Getting a Vendor ID]: https://www.usb.org/getting-vendor-id
[handle]: https://en.wikipedia.org/wiki/Handle_(computing)
[hexadecimal]: https://en.wikipedia.org/wiki/Hexadecimal
[HIDAPI]: https://github.com/libusb/hidapi
[`hidapitester`]: https://github.com/todbot/hidapitester
[`hid_device_info`]: https://github.com/libusb/hidapi/blob/baa0dab6114e8654161478e10a20c67cf5d1a1a3/hidapi/hidapi.h#L150
[`hid_enumerate`]: https://github.com/libusb/hidapi/blob/baa0dab6114e8654161478e10a20c67cf5d1a1a3/libusb/hid.c#L787
[HID Host]: https://github.com/paulfioravanti/hid_hosts
[`hid_open`]: https://github.com/libusb/hidapi/blob/baa0dab6114e8654161478e10a20c67cf5d1a1a3/libusb/hid.c#L915
[`hid_open_path`]: https://github.com/libusb/hidapi/blob/baa0dab6114e8654161478e10a20c67cf5d1a1a3/libusb/hid.c#L1261
[host]: https://en.wikipedia.org/wiki/Human_interface_device#Components_of_the_HID_protocol
[Human Interface Device]: https://en.wikipedia.org/wiki/USB_human_interface_device_class
[hundreds of devices]: https://github.com/search?q=repo%3Aqmk%2Fqmk_firmware+%22vid%22%3A+%220xFEED%22+language%3AJSON&type=code&l=JSON
[its Product ID and Vendor ID]: https://github.com/qmk/qmk_firmware/blob/ca4541699915b37cd1f253bbed51854627efd2ce/keyboards/gboards/georgi/info.json#L6
[linked list]: https://en.wikipedia.org/wiki/Linked_list
[`pkg-config`]: https://www.freedesktop.org/wiki/Software/pkg-config/
[Plover]: https://www.openstenoproject.org/plover/
[pointer]: https://en.wikipedia.org/wiki/Pointer_(computer_programming)
[QMK]: https://qmk.fm/
[steno]: https://www.openstenoproject.org/plover/
[Steno Gaming: Doom Typist]: https://www.paulfioravanti.com/blog/steno-gaming-doom-typist/
[Steno Tape]: https://github.com/paulfioravanti/steno_tape
[USB]: https://en.wikipedia.org/wiki/USB
[USB Implementers Forum]: https://www.usb.org/about
[Valid USB Vendor ID Numbers]: https://www.usb.org/developers
[Web HID Explorer]: https://nondebug.github.io/webhid-explorer/
