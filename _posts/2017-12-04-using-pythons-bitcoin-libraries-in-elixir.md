---
redirect_from:
  - /elixir/bitcoin/2017/12/04/using-pythons-bitcoin-libraries-in-Elixir
  - /elixir/bitcoin/2017/12/04/using-pythons-bitcoin-libraries-in-elixir.html
layout: post
title:  "Using Python's Bitcoin libraries in Elixir"
date:   2017-12-04 17:20 +1100
categories: elixir bitcoin
comments: true
---

I'm currently attempting to learn about the technical details of [Bitcoin][] and
blockchains by reading
_[Mastering Bitcoin: Programming the Open Blockchain][mastering-bitcoin-book]_.

All the code examples in the book are in [C++][] and [Python][], but I wanted to
see if I could port them over to [Elixir][]. There are Bitcoin libraries in
Elixir, like [bitcoin-elixir][], but I could not seem to find equivalents to the
ones used in the book. So, I thought that I would try to port as much of the
code as possible into Elixir, and then see if I could make API-style callouts to
code that I could not.

I have not been able to find a way to get Elixir to talk to C++ libraries
like [Libbitcoin][], which are used in the book (if you have a good method,
please let me know in the comments! \[_Update 14 Dec 2017: I figured it out. See
[Using C++ Bitcoin Libraries in Elixir][]_\]), so this post will focus on
getting Elixir to talk to Python's [Pybitcointools][] library, within the
context of the [Implementing Keys and Addresses][] section in Chapter 4 of the
book, using the code in [Example 4-5][mastering-bitcoin-example-4-5].

The Python example uses the Pybitcointools library to generate a
[private key][bitcoin-private-key], and then encode it into different formats
like [Wallet Import Format][] (WIF), and [Bitcoin Address][] (which represents
a destination for a Bitcoin payment). The full example code from the book is as
follows, so see if you can draw some mental lines around what code can come
over to Elixir, and what potentially needs to stay in Python:

```python
# key-to-address-ecc-example.py

from __future__ import print_function
import bitcoin

# Generate a random private key
valid_private_key = False
while not valid_private_key:
    private_key = bitcoin.random_key()
    decoded_private_key = bitcoin.decode_privkey(private_key, 'hex')
    valid_private_key = 0 < decoded_private_key < bitcoin.N

print("Private Key (hex) is: ", private_key)
print("Private Key (decimal) is: ", decoded_private_key)

# Convert private key to WIF format
wif_encoded_private_key = bitcoin.encode_privkey(decoded_private_key, 'wif')
print("Private Key (WIF) is: ", wif_encoded_private_key)

# Add suffix "01" to indicate a compressed private key
compressed_private_key = private_key + '01'
print("Private Key Compressed (hex) is: ", compressed_private_key)

# Generate a WIF format from the compressed private key (WIF-compressed)
wif_compressed_private_key = bitcoin.encode_privkey(
    bitcoin.decode_privkey(compressed_private_key, 'hex'), 'wif')
print("Private Key (WIF-Compressed) is: ", wif_compressed_private_key)

# Multiply the EC generator point G with the private key to get a public key point
public_key = bitcoin.fast_multiply(bitcoin.G, decoded_private_key)
print("Public Key (x,y) coordinates is:", public_key)

# Encode as hex, prefix 04
hex_encoded_public_key = bitcoin.encode_pubkey(public_key, 'hex')
print("Public Key (hex) is:", hex_encoded_public_key)

# Compress public key, adjust prefix depending on whether y is even or odd
(public_key_x, public_key_y) = public_key
compressed_prefix = '02' if (public_key_y % 2) == 0 else '03'
hex_compressed_public_key = compressed_prefix + bitcoin.encode(public_key_x, 16)
print("Compressed Public Key (hex) is:", hex_compressed_public_key)

# Generate bitcoin address from public key
print("Bitcoin Address (b58check) is:", bitcoin.pubkey_to_address(public_key))

# Generate compressed bitcoin address from compressed public key
print("Compressed Bitcoin Address (b58check) is:",
      bitcoin.pubkey_to_address(hex_compressed_public_key))
```

## Isolate Pybitcointools API calls

At first glance, I would say that everything that is related to I/O (like
`print` statements) and control flow (`if/else` statements), can safely make the
journey over to Elixir-land, while any code that fetches a value from an API
callout to Pybitcointools (ie `bitcoin.anything`) may have to remain in
Python-land, which means we need to have Elixir be able to get return values for
the following method calls:

- `bitcoin.random_key()`
- `bitcoin.encode_privkey(decoded_private_key, encoder)`
- `bitcoin.decode_privkey(private_key, decoder)`
- `bitcoin.encode(public_key_x, hex_encoder)`
- `bitcoin.encode_pubkey(public_key, encoder)`
- `bitcoin.pubkey_to_address(public_key)`
- `bitcoin.N`
- `bitcoin.G`

## Generate Private Key

To do this, we can use [Export][], an Elixir wrapper for [Erlport], which allows
[Erlang][] to talk to Python and [Ruby][] code. After creating a new `mix`
project (`mix new mastering_bitcoin`) and installing Export, we can get Elixir
to start talking to the `key-to-address-ecc-example.py` file by writing
functions that wrap around Export callouts to it. For example, to get a random
key from Pybitcointools, we could do the following:

```elixir
defmodule MasteringBitcoin.KeyToAddressECCExample do
  use Export.Python

  @python_src :code.priv_dir(:mastering_bitcoin) |> Path.basename()
  @python_file "key-to-address-ecc-example"

  def private_key do
    {:ok, pid} = Python.start(python_path: @python_src)
    private_key =
      pid
      |> Python.call(@python_file, "bitcoin.random_key", [])
      |> to_string()
    IO.puts("Private Key (hex) is: #{inspect(private_key)}")
    Python.stop(pid)
  end
end
```

Running this function in a console (`iex -S mix`) yields the following result:

```elixir
iex(1)> MasteringBitcoin.KeyToAddressECCExample.private_key
Private Key (hex) is: "e473f28e7c9dd8c46d2698ddc73af1017157f2e2979efe3c116dd35b013c0f2b"
:ok
```

A few things to note here:

- The `@python_src :code.priv_dir(:mastering_bitcoin) |> Path.basename()` module
  attribute is telling `Export.Python` where to go looking for Python files, so
  here, the Python example file lives under the top level `priv` directory in
  `priv/key-to-address-ecc-example.py`
  ([as is Elixir convention][what-is-priv]), so this attribute will evaluate to
  be simply `"priv"`.
- In `Python.call(@python_file, "bitcoin.random_key", [])`, we're calling the
  `bitcoin.random_key()` method with no arguments, hence the empty argument list
  as the final function parameter.
- Piping the result from Export to the `to_string()` function is needed due to
  Elixir reading back the string result from Python as a [Binary][elixir-binary]
  (ie the above example comes back as
  `'e473f28e7c9dd8c46d2698ddc73af1017157f2e2979efe3c116dd35b013c0f2b'`). More
  information about this can be found in the ["Data types mapping" section of
  the Erlport documentation][erlport-data-types-mapping].

## Decode Private Key

Now that we have a Python-side randomly generated private key as an Elixir
string, the next step is to pass it back to Python again so we can get
Pybitcointools to decode it to get its decimal value
(ie call `bitcoin.decode_privkey(private_key, "hex")` from Elixir), so let's
add that to the current code, refactoring slightly as we go along:

```elixir
defmodule MasteringBitcoin.KeyToAddressECCExample do
  use Export.Python

  @python_src :code.priv_dir(:mastering_bitcoin) |> Path.basename()
  @python_file "key-to-address-ecc-example"
  @hex "hex"

  def run do
    with {:ok, pid} <- Python.start(python_path: @python_src),
         private_key <- random_key(pid),
         decoded_private_key <- decode_private_key(pid, private_key) do
      IO.puts("Private Key (hex) is: #{inspect(private_key)}")
      IO.puts("Private Key (decimal) is: #{inspect(decoded_private_key)}")
      Python.stop(pid)
  end

  defp random_key(pid) do
    pid
    |> Python.call(@python_file, "bitcoin.random_key", [])
    |> to_string()
  end

  defp decode_private_key(pid, private_key) do
    pid
    |> Python.call(@python_file, "bitcoin.decode_privkey", [private_key, @hex])
    |> to_string()
    |> String.to_integer()
  end
end
```

The call to decode the private key is similar to generating the random key,
except that we're now passing the parameters `[private_key, @hex]` to
Python, and then doing further parsing of the result from binary -> string ->
integer to get the decimal value of the result.

So, let's run this in a console:

```elixir
iex(1)> MasteringBitcoin.KeyToAddressECCExample.run
** (ErlangError) Erlang error: {:python, :"builtins.Exception",
'WIF does not represent privkey',
{:"$erlport.opaque", :python, <<128, 2, 99, 116, 114, 97, 99, 101, 98, 97, 99,
107, 10, 83, 116, 97, 99, 107, 83, 117, 109, 109, 97, 114, 121, 10, 113, 0, 41,
129, 113, 1, 40, 99, 116, 114, 97, 99, 101, 98, 97, 99, 107, 10, 70, ...>>}}
```

Oops! This incredibly cryptic error is actually telling us that Python 3 tried
to call `bitcoin.decode_privkey(private_key, <a series of bytes instead of the
string "hex">)`.

When Elixir/Erlang passes binary information to Python 3, it receives the
information as [`b'information'`][python-b-character]: a literal sequence of
bytes (as opposed to Python 2, which would receive this data as a string;
explanation from
[Erlport data types mapping documentation][erlport-data-types-mapping] to the
rescue here again), so it looks like we need to write a Python-side wrapper
method that will parse Erlang strings before passing them through as parameters
to `bitcoin.decode_privkey`, so let's do that:

```python
# key-to-address-ecc-example.py

from __future__ import print_function
import bitcoin

def decode_privkey(private_key, decoder):
  decoder = decoder.decode()
  return bitcoin.decode_privkey(private_key, decoder)

# ... the rest of the code ...
```

Here, we're using Python's [`bytes.decode()`][python-bytes-decode-method] method
to return a UTF-8 encoded string from the bytes contained in the `decoder`
parameter, so it can then be passed on to `bitcoin.decode_privkey` safely.

Now, we need to change the Elixir-side Export call slightly so that we're
calling this new Python-side `decode_privkey` method that we made, rather than
call `bitcoin.decode_privkey` directly:

```elixir
defmodule MasteringBitcoin.KeyToAddressECCExample do
  # ...

  defp decode_private_key(pid, private_key) do
    pid
    |> Python.call(@python_file, "decode_privkey", [private_key, @hex])
    |> to_string()
    |> String.to_integer()
  end
end
```

Now, let's try that console run again:

```elixir
iex(1)> MasteringBitcoin.KeyToAddressECCExample.run
Private Key (hex) is: "e5c98a1ed360ae5bf71878bc791422861ee73e0b045e53c4ecad7ecd84ed2a8e"
Private Key (decimal) is: 103935731857643381135995335933887080576447253573766575295272791689921802611342
:ok
```

Success! There's just one more thing to take care of: references to
Pybitcointools constant values.

## Constants

Pybitcointools constant values like `bitcoin.N` are [Secp256k1][]
parameters used in Bitcoin's [Elliptic Curve Digital Signature Algorithm][]
(ECDSA), and live in Pybitcointools' library [here][pybitcointools-secp256k1].
For our purposes, what we need to know about `bitcoin.N` is that it helps us
determine whether a valid private key has been generated or not
(`valid_private_key = 0 < decoded_private_key < bitcoin.N`).

Export only supports calling methods in Python, so it can't send a request to
fetch the value of a constant.  So, I see two choices:

- Create a Python-side wrapper method that returns `bitcoin.N`
- Port the constant to Elixir

I think the latter makes sense, so let's do that, and complete the correct
generation of a private key:

```elixir
defmodule MasteringBitcoin.KeyToAddressECCExample do
  use Export.Python

  # Elliptic curve parameters (secp256k1)
  # REF: https://github.com/vbuterin/pybitcointools/blob/master/bitcoin/main.py
  @n 115792089237316195423570985008687907852837564279074904382605163141518161494337

  @python_src :code.priv_dir(:mastering_bitcoin) |> Path.basename()
  @python_file "key-to-address-ecc-example"
  @hex "hex"

  def run do
    with {:ok, pid} <- Python.start(python_path: @python_src),
         [private_key, decoded_private_key] <- generate_private_key(pid) do
      IO.puts("Private Key (hex) is: #{inspect(private_key)}")
      IO.puts("Private Key (decimal) is: #{inspect(decoded_private_key)}")
      Python.stop(pid)
    end
  end

  # Generate a random private key
  defp generate_private_key(pid) do
    with private_key <- random_key(pid),
         decoded_private_key <- decode_private_key(pid, private_key) do
      case decoded_private_key do
        n when n in 0..@n ->
          [private_key, decoded_private_key]
        _out_of_range ->
          generate_private_key(pid)
      end
    end
  end

  defp random_key(pid) do
    pid
    |> Python.call(@python_file, "bitcoin.random_key", [])
    |> to_string()
  end

  defp decode_private_key(pid, private_key) do
    pid
    |> Python.call(@python_file, "decode_privkey", [private_key, @hex])
    |> to_string()
    |> String.to_integer()
  end
end
```

## Work in Progress

Note that the Elixir code above only actually covers the port of the first
part of the original Python code:

```python
from __future__ import print_function
import bitcoin

# Generate a random private key
valid_private_key = False
while not valid_private_key:
    private_key = bitcoin.random_key()
    decoded_private_key = bitcoin.decode_privkey(private_key, 'hex')
    valid_private_key = 0 < decoded_private_key < bitcoin.N

print("Private Key (hex) is: ", private_key)
print("Private Key (decimal) is: ", decoded_private_key)
```

The Elixir code that covers the rest of this particular Python code can be found
at [my Mastering Bitcoin Github repository][mastering-bitcoin-repo]:

- [Elixir code][key-to-address-elixir-code]
- [Python wrapper methods][key-to-address-python-code]

The repository is still a work in progress as I read through the book and
attempt to port over more code, so keep an eye out for updates!

[elixir-binary]: http://elixir-lang.github.io/getting-started/binaries-strings-and-char-lists.html#binaries-and-bitstrings
[Bitcoin]: https://bitcoin.org/en/
[Bitcoin Address]: https://en.bitcoin.it/wiki/Address
[bitcoin-elixir]: https://github.com/comboy/bitcoin-elixir
[bitcoin-private-key]: https://en.bitcoin.it/wiki/Private_key
[C++]: https://isocpp.org/
[Elliptic Curve Digital Signature Algorithm]: https://en.bitcoin.it/wiki/Elliptic_Curve_Digital_Signature_Algorithm
[Elixir]: http://elixir-lang.github.io/
[Erlang]: https://www.erlang.org/
[Erlport]: http://erlport.org/
[erlport-data-types-mapping]: http://erlport.org/docs/python.html#data-types-mapping
[Export]: https://github.com/fazibear/export
[Implementing Keys and Addresses]: https://github.com/bitcoinbook/bitcoinbook/blob/second_edition/ch04.asciidoc#implementing-keys-and-addresses-in-python
[key-to-address-elixir-code]: https://github.com/paulfioravanti/mastering_bitcoin/blob/master/lib/mastering_bitcoin/key_to_address_ecc_example.ex
[key-to-address-python-code]: https://github.com/paulfioravanti/mastering_bitcoin/blob/master/priv/key-to-address-ecc-example.py
[Libbitcoin]: https://github.com/libbitcoin/libbitcoin
[mastering-bitcoin-book]: https://bitcoinbook.info/
[mastering-bitcoin-example-4-5]: https://github.com/bitcoinbook/bitcoinbook/blob/develop/code/key-to-address-ecc-example.py
[mastering-bitcoin-repo]: https://github.com/paulfioravanti/mastering_bitcoin
[Pybitcointools]: https://github.com/vbuterin/pybitcointools
[pybitcointools-secp256k1]: https://github.com/vbuterin/pybitcointools/blob/master/bitcoin/main.py#L15
[Python]: https://www.python.org/
[python-b-character]: https://stackoverflow.com/questions/6269765/what-does-the-b-character-do-in-front-of-a-string-literal
[python-bytes-decode-method]: https://docs.python.org/3/library/stdtypes.html#bytes.decode
[Ruby]: https://www.ruby-lang.org/en/
[Secp256k1]: https://en.bitcoin.it/wiki/Secp256k1
[Using C++ Bitcoin libraries in Elixir]: https://paulfioravanti.com/blog/2017/12/13/using-c-plus-plus-bitcoin-libraries-in-elixir/
[Wallet Import Format]: https://en.bitcoin.it/wiki/Wallet_import_format
[what-is-priv]: https://groups.google.com/forum/#!topic/elixir-lang-talk/LJwtXMQoF0A
