---
layout: post
title:  "Using C++ Bitcoin libraries in Elixir"
date:   2017-12-11 09:20 +1100
categories: elixir bitcoin
comments: true
affiliate: true
---

Following up from my previous blog post about [using Python's Bitcoin libraries
in Elixir][], I initially mentioned that I was having trouble figuring out a way
to get Elixir talking to C++ code, specifically to use the [Libbitcoin][]
toolkit. After looking through a bunch of libraries that purport to solve this
problem, some using [Native Implemented Functions][] (NIFs) under the hood,
others using [Ports][], I finally got the results I was after using an Elixir
library called [Cure][] (which uses Ports).

This blog post will focus on getting Elixir to talk to C++ code that will
interface with Libbitcoin, within the context of the
[Creating a Base58Check-encoded bitcoin address from a private key][] section
in Chapter 4 of
_[Mastering Bitcoin: Programming the Open Blockchain][mastering-bitcoin-affiliate-link]_,
using the code in [Example 4-3][mastering-bitcoin-example-4-3]. We'll create
a new project and create a solution in two main steps:

- Confirm that we can simply compile and run the C++ code as-is (read: as a
  shell command) within Elixir using the [Porcelain][] library, collect the
  output, and print it to screen: creating essentially an Elixir wrapper around
  running the C++ code.
- Introduce [Cure][] to actually get Elixir and C++ to be able to handle
  message passing between each other, which will require significant changes to
  the C++ code.

> Disclaimer: I am not a C/C++ programmer and am likely Doing It Wrong when I'm
on that side of the fence, so please don't consider any code there to be in any
way idiomatic or the way it Should Be Done.

## Install Libbitcoin

Before starting with Elixir, let's install the Libbitcoin toolkit. For Mac OS,
you can simply install it using [Homebrew][]:

```sh
brew install libbitcoin
```

For other operating systems, please refer to [Libbitcoin's installation
instructions][].

## New Project

Create a new `mix` project:

```sh
mix new libbitcoin
cd libbitcoin
```

## Install and configure Porcelain

Open up the project in your favourite text editor, and add Porcelain as a
dependency to your `mix.exs` file:

```elixir
defmodule Libbitcoin.Mixfile do
  # ...
  defp deps do
    [
      # Work with external processes
      {:porcelain, "~> 2.0"}
    ]
  end
end
```

Install Porcelain:

```
mix deps.get
```

Then, configure the driver to use for Porcelain by adding the following line
in `config/config.exs`:

```elixir
config :porcelain, driver: Porcelain.Driver.Basic
```

Porcelain can also be used with the [Goon][] driver, which is not something
that seems to be needed for this project, so we just tell Porcelain to use its
basic driver.

## Confirm C++ code can be compiled and run

Next, create a `priv/` directory in the project, and copy the code from the
book's [`addr.cpp`][mastering-bitcoin-example-4-3-raw] file into
`priv/addr.cpp`.
[According to the book][mastering-bitcoin-compiling-and-running-the-addr-code],
we should be able to compile the code using [`g++`][] in the following way:

```sh
g++ -o priv/addr priv/addr.cpp $(pkg-config --cflags --libs libbitcoin)
```

If running this command as-is works for you, then that's great, but on my
computer, that runs Mac OS High Sierra, I got a screen full of errors. In order
to fix this, I had to add the `-std=` flag, to determine the standard language
for compilation, which in my case needed to be `c++11`: The 2011 ISO C++
standard plus amendments (see [Options Controlling C Dialect][] for more
information). So, the compilation command needed to be changed to:

```sh
g++ -std=c++11 -o priv/addr priv/addr.cpp $(pkg-config --cflags --libs libbitcoin)
```

Running the generated `priv/addr` executable outputs the following result:

```sh
./priv/addr

Public key: 0202a406624211f2abbdc68da3df929f938c3399dd79fac1b51b0e4ad1d26a47aa
Address: 1PRTTaJesdNovgne6Ehcdu1fpEdX7913CK
```

## Create Elixir wrapper around C++ file

Now that we've confirmed we can run the C++ file, let's write the Elixir
wrapper that will compile the file and run the executable. Create a
`lib/libbitcoin` directory in your project and then create an `addr.ex` file
inside of it:

```elixir
defmodule Libbitcoin.Addr do
  @moduledoc """
  Example 4-3. Creating a Base58Check-encoded bitcoin address from a
  private key.
  """

  @src_compile """
  g++ -std=c++11 -o priv/addr priv/addr.cpp \
  $(pkg-config --cflags --libs libbitcoin)
  """
  @src_execute "./priv/addr"

  def run do
    Porcelain.shell(@src_compile)

    @src_execute
    |> Porcelain.shell()
    |> Map.fetch!(:out)
    |> IO.write()
  end
end
```

Then, open up an `iex` console and run the module:

```sh
iex -S mix
iex(1)> Libbitcoin.Addr.run()
Public key: 0202a406624211f2abbdc68da3df929f938c3399dd79fac1b51b0e4ad1d26a47aa
Address: 1PRTTaJesdNovgne6Ehcdu1fpEdX7913CK
:ok
```

Success! We've now been able to get Elixir to output the result of running
the C++ executable, but Elixir isn't really talking directly (sending and
receiving messages) to the code yet, so let's work on that next.

## Install and configure Cure

Add Cure as a dependency to your `mix.exs` file, and then run `mix deps.get`:

```elixir
defp deps do
  [
    # Interface C-code with Erlang/Elixir using Ports
    {:cure, "~> 0.4.0"},
    # Work with external processes
    {:porcelain, "~> 2.0"}
  ]
end
```

Then, get Cure to generate the necessary base files to communicate between
C++ and Elixir:

```sh
mix cure.bootstrap
```

This command will create the following file tree under the project root folder:

```
c_src
├── Makefile
├── main.c
└── main.h
```

At the time of this writing, Cure is hardcoded to assume that you want all
C/C++ code dealt with inside a `c_src` directory, which I think goes against
the Elixir convention of having [artifacts that you need in production
alongside your code in the `priv` directory][what-is-priv], so we'll begin the
process of moving the bootstrap code over to `priv/`.

## Hello C++

Before going straight into talking to Libbitcoin, let's do a quick spike to
confirm that we are able to pass messages back and forth from Elixir to C++.

We are going to need the original `addr.cpp` code for reference, so let's first
store a copy of the original:

```sh
mv priv/addr.cpp priv/addr.cpp.orig
```

Next, we'll move over the Cure-generated files to the be the new `addr` files:

```sh
mv c_src/main.h priv/addr.h
mv c_src/main.c priv/addr.cpp
```

Yes, it's okay for the `.c` file to become a `.cpp` file for our purposes.

Next, open up each of the files and change them so that they look like
the following:

**addr.h**

```cpp
#ifndef ADDR_H
#define ADDR_H
#include <elixir_comm.h>

// TODO put your own functions/includes here.

#endif
```

**addr.cpp**
```cpp
#include <string>
#include "addr.h"

int main(void) {
  int bytes_read;
  byte buffer[MAX_BUFFER_SIZE];

  while ((bytes_read = read_msg(buffer)) > 0) {
    std::string param = (char*) &buffer;
    std::string greeting = "Hello " + param + " from C++";

    memcpy(buffer, greeting.data(), greeting.length());
    send_msg(buffer, greeting.size());
  }

  return 0;
}
```

The code here reads in the message (an array of bytes) that gets brought in from
Elixir via the `read_msg` function that Cure provides, stores it in a
`buffer`, copies it into a C++ `param` string, interpolates it into a `greeting`
message, copies the `greeting` back into the `buffer`, and sends it back to
Elixir via the `send_msg` function, also provided by Cure. More information
about the I/O functions provided by cure can be found
[here][cure-helper-functions-info].

Next, change the Elixir code to use Cure to send messages to C++:

```elixir
defmodule Libbitcoin.Addr do
  @moduledoc """
  Example 4-3. Creating a Base58Check-encoded bitcoin address from a
  private key.
  """

  alias Cure.Server, as: Cure

  @src_compile """
  g++ -std=c++11 -I./deps/cure/c_src -L./deps/cure/c_src -O3 -x c++ \
  -o priv/addr priv/addr.cpp ./deps/cure/c_src/elixir_comm.c \
  $(pkg-config --cflags --libs libbitcoin)
  """
  @cpp_executable "priv/addr"

  def run do
    Porcelain.shell(@src_compile)

    with {:ok, pid} <- Cure.start_link(@cpp_executable),
         greeting <- hello_world(pid) do
      IO.puts(greeting)
      :ok = Cure.stop(pid)
    end
  end

  defp hello_world(pid) do
    Cure.send_data(pid, "Elixir", :once)
    receive do
      {:cure_data, response} ->
        response
    end
  end
end
```

Some things to note about this code:

- The compile command has changed quite significantly, and getting it to work
  was mostly a case of going through the `c_src/Makefile` that Cure generated as
  part of its bootstrapping process, and reconstructing the compilation command
  to include all the necessary Cure headers and libraries.
- Cure's default way of opening a port to a C++ program is by the use of the
  `Cure.load()` API, which "starts a supervisor which supervises all of its
  children (a child in this case is a GenServer that communicates with a C/C++
  program). That seemed like overkill for this situation, so I simply used
  `Cure.Server.start_link()` instead to just start a GenServer.
- `Cure.send_data(pid, "Elixir", :once)` will only allow one response to be
  received back from the C++ code, which is all we need for this case. However,
  if multiple responses from C++ need to be processed by Elixir, then the
  `:permanent` mode flag could be used instead. More examples of the different
  kinds of modes can be found on [Cure's README][cure-readme-examples].

Let's now open up an `iex` console again and see if we have a conversation
going:

```sh
iex -S mix
iex(1)> Libbitcoin.Addr.run()
Hello Elixir from C++
:ok
```

Success! Now that we have Elixir and C++ talking to each other, it's time to
actually get Elixir talking with Libbitcoin. Also, it's probably okay to
remove the `c_src/` directory from the project if you haven't already.

## Working with Libbitcoin

[Creating a Base58Check-encoded bitcoin address from a private key]: https://github.com/bitcoinbook/bitcoinbook/blob/second_edition/ch04.asciidoc#addr_example
[Cure]: https://github.com/luc-tielen/Cure
[cure-helper-functions-info]: https://github.com/luc-tielen/Cure#cc-code
[cure-readme-examples]: https://github.com/luc-tielen/Cure#example
[Elixir]: http://elixir-lang.github.io/
[`g++`]: https://www.cprogramming.com/g++.html
[Goon]: https://github.com/alco/goon
[Homebrew]: https://brew.sh/
[Libbitcoin]: https://github.com/libbitcoin/libbitcoin
[Libbitcoin's installation instructions]: https://github.com/libbitcoin/libbitcoin#installation
[mastering-bitcoin-affiliate-link]: https://www.amazon.com/gp/product/B071K7FCD4/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B071K7FCD4&linkCode=as2&tag=paulfioravant-20&linkId=c70c3b7b2ba56b9490dcfe334b4970ab
[mastering-bitcoin-compiling-and-running-the-addr-code]: https://github.com/bitcoinbook/bitcoinbook/blob/second_edition/ch04.asciidoc#addr_example_run
[mastering-bitcoin-example-4-3]: https://github.com/bitcoinbook/bitcoinbook/blob/develop/code/addr.cpp
[mastering-bitcoin-example-4-3-raw]: https://raw.githubusercontent.com/bitcoinbook/bitcoinbook/develop/code/addr.cpp
[Native Implemented Functions]: http://erlang.org/doc/tutorial/nif.html
[Options Controlling C Dialect]: https://gcc.gnu.org/onlinedocs/gcc/C-Dialect-Options.html
[Porcelain]: https://github.com/alco/porcelain
[Ports]: https://hexdocs.pm/elixir/Port.html
[Using Python's Bitcoin libraries in Elixir]: /elixir/bitcoin/2017/12/04/using-pythons-bitcoin-libraries-in-elixir
[what-is-priv]: https://groups.google.com/forum/#!topic/elixir-lang-talk/LJwtXMQoF0A
