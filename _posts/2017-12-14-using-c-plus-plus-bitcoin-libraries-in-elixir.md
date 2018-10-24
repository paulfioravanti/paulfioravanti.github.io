---
redirect_from: /elixir/bitcoin/2017/12/13/using-c-plus-plus-bitcoin-libraries-in-elixir.html
title: "Using C++ Bitcoin libraries in Elixir"
date: 2017-12-14 09:03 +1100
tags: elixir bitcoin
header:
  image: /assets/images/2017-12-14/matt-antonioli-734745-unsplash.jpg
  image_description: "white Lamborghini car"
  teaser: /assets/images/2017-12-14/matt-antonioli-734745-unsplash.jpg
  overlay_image: /assets/images/2017-12-14/matt-antonioli-734745-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Matt Antonioli](https://unsplash.com/photos/c8QJ7dhHP9Y?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/lamborghini?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Pass messages from Elixir to C++ with Cure.
---

Following up from my previous blog post about [Using Python's Bitcoin libraries
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
_[Mastering Bitcoin: Programming the Open Blockchain][mastering-bitcoin-book]_,
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

```sh
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

Next, create a `c_src/` directory in the project, and copy the code from the
book's [`addr.cpp`][mastering-bitcoin-example-4-3-raw] file into
`c_src/addr.cpp`, and create a `priv/` directory, which is where we will output
compiled C++ executable files.

Having C source code in a `c_src/` directory is
[Erlang convention for the location of C source code][erlang-guide-ports], but
for artefacts that are needed in production (ie those compiled C++ executables),
[the Elixir convention is to have them in a `priv/` folder][what-is-priv],
so that's how we'll roll.

[According to the book][mastering-bitcoin-compiling-and-running-the-addr-code],
we should be able to compile the code using [`g++`][] in the following way:

```sh
g++ -o priv/addr c_src/addr.cpp $(pkg-config --cflags --libs libbitcoin)
```

If running this command as-is works for you, then that's great, but on my
computer, that runs Mac OS High Sierra, I got a screen full of errors. In order
to fix this, I had to add the `-std=` flag, to determine the standard language
for compilation, which in my case needed to be `c++11`: The 2011 ISO C++
standard plus amendments (see [Options Controlling C Dialect][] for more
information). So, the compilation command needed to be changed to:

```sh
g++ -std=c++11 -o priv/addr c_src/addr.cpp $(pkg-config --cflags --libs libbitcoin)
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

  @cpp_compile """
  g++ -std=c++11 $(pkg-config --cflags --libs libbitcoin) \
  c_src/addr.cpp -o priv/addr
  """
  @cpp_executable "priv/addr"

  def run do
    Porcelain.shell(@cpp_compile)

    @cpp_executable
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

It works! We've now been able to get Elixir to output the result of running
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

This command will add the following files to the `c_src` directory:

```text
c_src
├── Makefile
├── main.c
└── main.h
```

- `Makefile`: a template to automatically build a C++ executable including
  Cure's libraries. We'll leave this for now, but get back to it later on.
- `main.c`: Cure's base C file to communicate between C/C++ and Elixir.
- `main.h`: The header file for `main.c`

## Hello C++

Before going straight into talking to Libbitcoin, let's do a quick spike to
confirm that we are able to pass messages back and forth from Elixir to C++.

We are going to need the original `addr.cpp` code for reference, so let's first
store a copy of the original:

```sh
mv c_src/addr.cpp c_src/addr.cpp.orig
```

Next, we'll move over the Cure-generated files to the be the new `addr` files:

```sh
mv c_src/main.h c_src/addr.h
mv c_src/main.c c_src/addr.cpp
```

Yes, it's okay for the `.c` file to become a `.cpp` file for our purposes.

Next, open up each of the files and change them so that they look like
the following:

### **`c_src/addr.h`**

```cpp
#ifndef ADDR_H
#define ADDR_H
#include <elixir_comm.h>

// TODO put your own functions/includes here.

#endif
```

### **`c_src/addr.cpp`**

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
message, copies the `greeting` back into the `buffer`, and finally sends it back
to Elixir via the `send_msg` function, also provided by Cure. More information
about the I/O functions provided by Cure can be found
[here][cure-helper-functions-info].

Next, change the Elixir code to use Cure to send messages to C++:

```elixir
defmodule Libbitcoin.Addr do
  @moduledoc """
  Example 4-3. Creating a Base58Check-encoded bitcoin address from a
  private key.
  """

  alias Cure.Server, as: Cure

  @cpp_compile """
  g++ -std=c++11 -I./deps/cure/c_src -L./deps/cure/c_src -O3 \
  $(pkg-config --cflags --libs libbitcoin) \
  -x c++ ./deps/cure/c_src/elixir_comm.c \
  c_src/addr.cpp -o priv/addr
  """
  @cpp_executable "priv/addr"

  def run do
    Porcelain.shell(@cpp_compile)

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
- `-x c++ ./deps/cure/c_src/elixir_comm.c` is telling the compiler to treat
  Cure's generated `elixir_comm.c` file as a C++ file (otherwise the `g++`
  compiler will output warnings).
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

Excellent! Now that we have Elixir and C++ talking to each other, it's time to
actually get Elixir talking with Libbitcoin.

## Working with Libbitcoin

Looking at the code in `c_src/addr.cpp.orig` (the original code from the book),
it would seem that it performs two main actions:

- Generate a public key from a private key
- Create a bitcoin address from a public key

So, let's separate those two concerns into their own functions in our C++ code,
porting over the code mostly as-is:

**`c_src/addr.h`**

```cpp
#ifndef ADDR_H
#define ADDR_H
#include "elixir_comm.h"

std::string generate_public_key(std::string priv_key);
std::string create_bitcoin_address(std::string pub_key);

#endif
```

**`c_src/addr.cpp`**

```cpp
#include <string>
#include "addr.h"

int main(void) {
 // ...
}

std::string generate_public_key(std::string priv_key) {
  bc::ec_secret decoded;
  bc::decode_base16(decoded, priv_key);

  bc::wallet::ec_private secret(decoded, bc::wallet::ec_private::mainnet_p2kh);

  // Get public key.
  bc::wallet::ec_public public_key(secret);
  return public_key.encoded();
}

std::string create_bitcoin_address(std::string pub_key) {
  bc::wallet::ec_public public_key = bc::wallet::ec_public::ec_public(pub_key);
  // Compute hash of public key for P2PKH address.
  bc::data_chunk public_key_data;
  public_key.to_data(public_key_data);
  const auto hash = bc::bitcoin_short_hash(public_key_data);

  bc::data_chunk unencoded_address;
  // Reserve 25 bytes
  //   [ version:1  ]
  //   [ hash:20    ]
  //   [ checksum:4 ]
  unencoded_address.reserve(25);
  // Version byte, 0 is normal BTC address (P2PKH).
  unencoded_address.push_back(0);
  // Hash data
  bc::extend_data(unencoded_address, hash);
  // Checksum is computed by hashing data, and adding 4 bytes from hash.
  bc::append_checksum(unencoded_address);
  // Finally we must encode the result in Bitcoin's base58 encoding.
  assert(unencoded_address.size() == 25);
  const std::string address = bc::encode_base58(unencoded_address);
  return address;
}
```

So, that's all well and good (probably), but how can we get Elixir to tell
C++ to call these functions? It would be nice if there was some kind of
[Export][]-style interface where we could pass the C++ function name that we
want called as a string from Elixir.  Alas, there aren't any (that I know of),
so we'll have to get a bit more creative.

While searching Github for examples that used Cure, I came across the
[elixir-interop-examples][] repo, which provided me with some inspiration on
how to tackle this problem: get Elixir to send an integer as the first byte
of the message to C++. This integer will represent the function to be called,
and C++ can `switch` on it to determine what action needs to be performed.
[Elixir binaries][] make it straightforward to be able to tinker with the
innards of a sequence of bytes, so that's how we can proceed by updating the
C++ code as follows:

**`c_src/addr.h`**

```cpp
// ...

// Helper functions
// REF: https://github.com/asbaker/elixir-interop-examples/blob/master/serial_ports/c_src/serial.c
void process_command(byte* buffer, int bytes_read);
// REF: https://github.com/asbaker/elixir-interop-examples/blob/master/serial_ports/c_src/erl_comm.h
void get_string_arg(byte* buffer, char* string, int bytes_read);

#endif
```

**`c_src/addr.cpp`**

```cpp
#include <bitcoin/bitcoin.hpp>
#include "addr.h"

const int GENERATE_PUBLIC_KEY = 1;
const int CREATE_BITCOIN_ADDRESS = 2;

int main(void) {
  int bytes_read;
  byte buffer[MAX_BUFFER_SIZE];

  while ((bytes_read = read_msg(buffer)) > 0) {
    process_command(buffer, bytes_read);
  }

  return 0;
}

// Process the command dependent on the integer value given in the message
// sent from Elixir
void process_command(byte* buffer, int bytes_read) {
  int function = buffer[0];
  char arg[1024];
  get_string_arg(buffer, arg, bytes_read);
  std::string retval;

  if (bytes_read > 0) {
    switch (function) {
      case GENERATE_PUBLIC_KEY:
        retval = generate_public_key(arg);
        break;
      case CREATE_BITCOIN_ADDRESS:
        retval = create_bitcoin_address(arg);
        break;
      default:
        fprintf(stderr, "not a valid function %i\n", function);
        exit(1);
    }
    memcpy(buffer, retval.data(), retval.length());
    send_msg(buffer, retval.size());
  } else {
    fprintf(stderr, "no command given");
    exit(1);
  }
}

void get_string_arg(byte* buffer, char* arg, int bytes_read) {
  buffer[bytes_read] = '\0';
  strcpy(arg, (char*) &buffer[1]);
}

std::string generate_public_key(std::string priv_key) {
  // ...
}

std::string create_bitcoin_address(std::string pub_key) {
  // ...
}
```

The `main` function now immediately delegates off to `process_command`, which
extracts the `function` indicator and `arg` argument from the bytes passed to it
by Elixir, calls the appropriate function, and sends its return value (`retval`)
back to Elixir.

On the Elixir side, the code looks like the following:

```elixir
defmodule Libbitcoin.Addr do
  @moduledoc """
  Example 4-3. Creating a Base58Check-encoded bitcoin address from a
  private key.
  """

  alias Cure.Server, as: Cure

  @cpp_compile """
  g++ -std=c++11 -I./deps/cure/c_src -L./deps/cure/c_src -O3 \
  $(pkg-config --cflags --libs libbitcoin) \
  -x c++ ./deps/cure/c_src/elixir_comm.c \
  c_src/addr.cpp -o priv/addr
  """
  @cpp_executable "priv/addr"
  # Private secret key string as base16
  @private_key """
  038109007313a5807b2eccc082c8c3fbb988a973cacf1a7df9ce725c31b14776\
  """

  # Integers representing C++ methods
  @generate_public_key 1
  @create_bitcoin_address 2

  def run do
    Porcelain.shell(@cpp_compile)

    with {:ok, pid} <- Cure.start_link(@cpp_executable),
         public_key <- generate_public_key(pid),
         bitcoin_address <- create_bitcoin_address(pid, public_key) do
      IO.puts("Public key: #{inspect(public_key)}")
      IO.puts("Address: #{inspect(bitcoin_address)}")
      :ok = Cure.stop(pid)
    end
  end

  defp generate_public_key(pid) do
    cure_data(pid, <<@generate_public_key, @private_key>>)
  end

  defp create_bitcoin_address(pid, public_key) do
    cure_data(pid, <<@create_bitcoin_address, public_key :: binary>>)
  end

  defp cure_data(pid, data) do
    Cure.send_data(pid, data, :once)
    receive do
      {:cure_data, response} ->
        response
    end
  end
end
```

- Both `generate_public_key` and `create_bitcoin_address` send separate requests
  out to the C++ code via Cure, in the same way that you might call some other
  external service. Each of the binary messages has an integer as its first
  byte, and a string taking up the rest of the message.
- The `@generate_public_key 1` and `@create_bitcoin_address 2` module attributes
  mirror the similarly named constants in the C++ code, so they are coupled
  quite tightly out of necessity.
- We're now keeping the private key on the Elixir side and passing in to C++ as
  a parameter, rather than have its definition be on the C++ side.

Before seeing if this actually works, for clarity's sake, here are the full
C++ code samples:

**`c_src/addr.h`**

```cpp
#ifndef ADDR_H
#define ADDR_H
#include "elixir_comm.h"

std::string generate_public_key(std::string priv_key);
std::string create_bitcoin_address(std::string pub_key);

// Helper functions
// REF: https://github.com/asbaker/elixir-interop-examples/blob/master/serial_ports/c_src/serial.c
void process_command(byte* buffer, int bytes_read);
// REF: https://github.com/asbaker/elixir-interop-examples/blob/master/serial_ports/c_src/erl_comm.h
void get_string_arg(byte* buffer, char* string, int bytes_read);

#endif
```

**`c_src/addr.cpp`**

```cpp
#include <bitcoin/bitcoin.hpp>
#include "addr.h"

const int GENERATE_PUBLIC_KEY = 1;
const int CREATE_BITCOIN_ADDRESS = 2;

int main(void) {
  int bytes_read;
  byte buffer[MAX_BUFFER_SIZE];

  while ((bytes_read = read_msg(buffer)) > 0) {
    process_command(buffer, bytes_read);
  }

  return 0;
}

// Process the command dependent on the integer value given in the message
// sent from Elixir
void process_command(byte* buffer, int bytes_read) {
  int function = buffer[0];
  char arg[1024];
  get_string_arg(buffer, arg, bytes_read);
  std::string retval;

  if (bytes_read > 0) {
    switch (function) {
      case GENERATE_PUBLIC_KEY:
        retval = generate_public_key(arg);
        break;
      case CREATE_BITCOIN_ADDRESS:
        retval = create_bitcoin_address(arg);
        break;
      default:
        fprintf(stderr, "not a valid function %i\n", function);
        exit(1);
    }
    memcpy(buffer, retval.data(), retval.length());
    send_msg(buffer, retval.size());
  } else {
    fprintf(stderr, "no command given");
    exit(1);
  }
}

void get_string_arg(byte* buffer, char* string, int bytes_read) {
  buffer[bytes_read] = '\0';
  strcpy(string, (char*) &buffer[1]);
}

std::string generate_public_key(std::string priv_key) {
  bc::ec_secret decoded;
  bc::decode_base16(decoded, priv_key);

  bc::wallet::ec_private secret(decoded, bc::wallet::ec_private::mainnet_p2kh);

  // Get public key.
  bc::wallet::ec_public public_key(secret);
  return public_key.encoded();
}

std::string create_bitcoin_address(std::string pub_key) {
  // Create Bitcoin address.
  // Normally you can use:
  //    bc::wallet::payment_address payaddr =
  //        public_key.to_payment_address(
  //            bc::wallet::ec_public::mainnet_p2kh);
  //  const std::string address = payaddr.encoded();

  bc::wallet::ec_public public_key = bc::wallet::ec_public::ec_public(pub_key);
  // Compute hash of public key for P2PKH address.
  bc::data_chunk public_key_data;
  public_key.to_data(public_key_data);
  const auto hash = bc::bitcoin_short_hash(public_key_data);

  bc::data_chunk unencoded_address;
  // Reserve 25 bytes
  //   [ version:1  ]
  //   [ hash:20    ]
  //   [ checksum:4 ]
  unencoded_address.reserve(25);
  // Version byte, 0 is normal BTC address (P2PKH).
  unencoded_address.push_back(0);
  // Hash data
  bc::extend_data(unencoded_address, hash);
  // Checksum is computed by hashing data, and adding 4 bytes from hash.
  bc::append_checksum(unencoded_address);
  // Finally we must encode the result in Bitcoin's base58 encoding.
  assert(unencoded_address.size() == 25);
  const std::string address = bc::encode_base58(unencoded_address);
  return address;
}
```

Now, the moment of truth. Open up an `iex` console and let's see if we can talk
to Libbitcoin:

```sh
iex -S mix
iex(1)> Libbitcoin.Addr.run()
Public key: "0202a406624211f2abbdc68da3df929f938c3399dd79fac1b51b0e4ad1d26a47aa"
Address: "1PRTTaJesdNovgne6Ehcdu1fpEdX7913CK"
:ok
```

Success! This may not be the most elegant way to talk to C++ code, but, for this
use case, it works!

## Improve Build Automation with a Makefile

Now that we have everything working as expected, we can make the build process
more maintainable for the future if we take the compile command that we
currently have in the Elixir `@cpp_compile` module attribute, and put it
back in C-land inside the `Makefile`. So, building on the `Makefile` that Cure
bootstrap provided for us, add some more code so it looks like the following:

**`c_src/Makefile`**

```sh
CC = g++ -std=c++11
APP_DIR = $(shell dirname $(shell pwd))
CURE_DEPS_DIR = $(APP_DIR)/deps/cure/c_src
CURE_DEPS = -I$(CURE_DEPS_DIR) -L$(CURE_DEPS_DIR)
ELIXIR_COMM_C = -x c++ $(CURE_DEPS_DIR)/elixir_comm.c
LIBBITCOIN_DEPS = $(shell pkg-config --cflags --libs libbitcoin)
C_FLAGS = $(CURE_DEPS) $(ELIXIR_COMM_C) $(LIBBITCOIN_DEPS) -O3
PRIV_DIR = $(APP_DIR)/priv
C_SRC_DIR = $(APP_DIR)/c_src
EXECUTABLES = addr

all: $(EXECUTABLES)
# REF: https://www.gnu.org/software/make/manual/html_node/Static-Usage.html#Static-Usage
# $< - prerequisite file, $@ - executable file
$(EXECUTABLES): %: %.cpp
	$(CC) $(C_FLAGS) $(C_SRC_DIR)/$< -o $(PRIV_DIR)/$@
```

A few notes about this `Makefile` that I learned when figuring out its correct
incantations:

- When you want to call a shell function inside a `Makefile` that would
  normally look something like `$(ls)` on the command line, since the `$()`
  syntax is used for Makefile internal
  [variable referencing][makefile-variable-referencing], the syntax then becomes
  `$(shell ls)` (see [The `shell` function][makefile-shell-function]).
- Set up of the `EXECUTABLES` statement, and the code below it, means that
  when `make all` is run, for each of the filenames in that `EXECUTABLES` list
  (ie this list could be added to: `EXECUTABLES = addr foo bar`), the
  `$(CC) $(C_FLAGS) $(C_SRC_DIR)/$< -o $(PRIV_DIR)/$@` command gets run for each
  of them (for example `$<` gets subbed out for `addr.cpp` and `$@` gets subbed
  out for `addr`). More information about this code structure for a `Makefile`
  can be found in Makefile's
  [Static Usage documentation][makefile-static-usage].

Now, you can get Cure to compile all your C++ executables for you via `mix`:

```sh
mix compile.cure
```

If you want to have this done automatically when you compile your Elixir code,
you can add the Cure compiler to the list of your project's compilers in
`mix.exs`:

```elixir
defmodule Libbitcoin.Mixfile do
  use Mix.Project

  def project do
    [
      # ...
      compilers: Mix.compilers ++ [:cure, :"cure.deps"]
    ]
  end

  # ...
end
```

Note, though, that if you do this, _every time_ a process calls `mix compile`,
the C++ executables will be re-compiled. So, it may end up slowing down, say,
the running of a set of tasks in a [mix test.watch][] process, as each task will
end up re-compiling the C++ code (potentially unnecessarily) before it runs.
In this case, it may be best to just add a `compile.cure` task to run before any
of the others. For other Cure-based compilation options see its
[README][cure-compile-options].

Since we've now moved all the responsibility for C compilation into the
`Makefile`, we can cull some code from `addr.ex` to create the final file:

```elixir
defmodule Libbitcoin.Addr do
  @moduledoc """
  Example 4-3. Creating a Base58Check-encoded bitcoin address from a
  private key.
  """

  alias Cure.Server, as: Cure

  @cpp_executable "priv/addr"
  # Private secret key string as base16
  @private_key """
  038109007313a5807b2eccc082c8c3fbb988a973cacf1a7df9ce725c31b14776\
  """

  # Integers representing C++ methods
  @generate_public_key 1
  @create_bitcoin_address 2

  def run do
    with {:ok, pid} <- Cure.start_link(@cpp_executable),
         public_key <- generate_public_key(pid),
         bitcoin_address <- create_bitcoin_address(pid, public_key) do
      IO.puts("Public key: #{inspect(public_key)}")
      IO.puts("Address: #{inspect(bitcoin_address)}")
      :ok = Cure.stop(pid)
    end
  end

  defp generate_public_key(pid) do
    cure_data(pid, <<@generate_public_key, @private_key>>)
  end

  defp create_bitcoin_address(pid, public_key) do
    cure_data(pid, <<@create_bitcoin_address, public_key :: binary>>)
  end

  defp cure_data(pid, data) do
    Cure.send_data(pid, data, :once)
    receive do
      {:cure_data, response} ->
        response
    end
  end
end
```

Elixir now needs to know nothing about C++ source code compilation:
only that it needs to target a `@cpp_executable` file when it wants to talk
with C++. Porcelain also now has nothing specifically to do any more, so it can
be safely removed from the project `mix.exs` file, and its configuration removed
from `config.exs`.

## Final Thoughts

This blog post was borne out of a lot of trial and error and frustration, mostly
due to me not being able to C++ my way out of a paper bag without a
[Stack Overflow][] safety net. Regardless, I hope it at least assists someone
who may be attempting to try something similar, or is reading
_[Mastering Bitcoin][mastering-bitcoin-book]_ as well. I have no doubt
that I'm doing it wrong when it comes to C++, so if you have any improvement
suggestions, please leave a comment. If you want to keep tabs on my gradual
port over of _Mastering Bitcoin_ code over to Elixir, check out my
[Mastering Bitcoin repo][].

[Creating a Base58Check-encoded bitcoin address from a private key]: https://github.com/bitcoinbook/bitcoinbook/blob/second_edition/ch04.asciidoc#addr_example
[Cure]: https://github.com/luc-tielen/Cure
[cure-compile-options]: https://github.com/luc-tielen/Cure#start-developing-in-cc
[cure-helper-functions-info]: https://github.com/luc-tielen/Cure#cc-code
[cure-readme-examples]: https://github.com/luc-tielen/Cure#example
[Elixir]: http://elixir-lang.github.io/
[Elixir binaries]: http://elixir-lang.github.io/getting-started/binaries-strings-and-char-lists.html#binaries-and-bitstrings
[elixir-interop-examples]: https://github.com/asbaker/elixir-interop-examples
[erlang-guide-ports]: https://erlang.mk/guide/ports.html
[Export]: https://github.com/fazibear/export
[`g++`]: https://www.cprogramming.com/g++.html
[Goon]: https://github.com/alco/goon
[Homebrew]: https://brew.sh/
[Libbitcoin]: https://github.com/libbitcoin/libbitcoin
[Libbitcoin's installation instructions]: https://github.com/libbitcoin/libbitcoin#installation
[makefile-shell-function]: https://www.gnu.org/software/make/manual/html_node/Shell-Function.html
[makefile-static-usage]: https://www.gnu.org/software/make/manual/html_node/Static-Usage.html#Static-Usage
[makefile-variable-referencing]: https://www.gnu.org/software/make/manual/html_node/Reference.html
[mastering-bitcoin-book]: https://bitcoinbook.info/
[mastering-bitcoin-compiling-and-running-the-addr-code]: https://github.com/bitcoinbook/bitcoinbook/blob/second_edition/ch04.asciidoc#addr_example_run
[mastering-bitcoin-example-4-3]: https://github.com/bitcoinbook/bitcoinbook/blob/develop/code/addr.cpp
[mastering-bitcoin-example-4-3-raw]: https://raw.githubusercontent.com/bitcoinbook/bitcoinbook/develop/code/addr.cpp
[Mastering Bitcoin repo]: https://github.com/paulfioravanti/mastering_bitcoin
[mix test.watch]: https://github.com/lpil/mix-test.watch
[Native Implemented Functions]: http://erlang.org/doc/tutorial/nif.html
[Options Controlling C Dialect]: https://gcc.gnu.org/onlinedocs/gcc/C-Dialect-Options.html
[Porcelain]: https://github.com/alco/porcelain
[Ports]: https://hexdocs.pm/elixir/Port.html
[Stack Overflow]: https://stackoverflow.com/
[Using Python's Bitcoin libraries in Elixir]: https://paulfioravanti.com/blog/2017/12/04/using-pythons-bitcoin-libraries-in-elixir/
[what-is-priv]: https://groups.google.com/forum/#!topic/elixir-lang-talk/LJwtXMQoF0A
