---
title: "Pipe a Codebase into Ruby"
date: 2021-10-10 20:50 +1100
last_modified_at: 2023-07-24 16:15 +1100
tags: ruby bash zsh shell pipe unix
header:
  image: /assets/images/2021-10-10/denny-muller-W3wd-rmLP7I-unsplash.jpg
  image_description: "pipe organ"
  teaser: /assets/images/2021-10-10/denny-muller-W3wd-rmLP7I-unsplash.jpg
  overlay_image: /assets/images/2021-10-10/denny-muller-W3wd-rmLP7I-unsplash.jpg
  overlay_filter: 0.4
  caption: >
    Photo by <a href="https://unsplash.com/@redaquamedia?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Denny Müller</a> on <a href="https://unsplash.com/s/photos/pipe-organ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

excerpt: >
  "Pipes! Well done! I feel like Leonardo da Vinci! It's a masterpiece!"
tagline: >
  "Pipes! Well done! I feel like Leonardo da Vinci! [It's a masterpiece](https://www.mariowiki.com/List_of_The_Super_Mario_Bros._Super_Show!_quotes#:~:text=%22Pipes!%20Well%20done!%20Huh%3F%20I%20feel%20like%20Leonardo%20da%20Vinci!%20It%27s%20a%20masterpiece!%22)"
---

[Alistair Tweed][] asked an interesting question on the [Ruby Australia][]
[Slack][Ruby Australia Slack], which I thought deserved a more permanent home
over being banished to [Slack][]'s archives:

> Can anyone help me with getting user input when piping code to Ruby?<br />
> The command I'm using is:
>
> ```sh
> cat hello | ruby
> ```
>
> The `hello` file contains the following code:
>
> ```ruby
> #!/usr/bin/env ruby
> # frozen_string_literal: true
>
> name = gets&.strip
>
> puts "Hello, #{name || 'World'}!"
> ```
>
> When using `gets`, the output is `Hello, World!`<br />
> When using `STDIN.read`, the output is `Hello, !`<br />
> The problem is that the script doesn't stop to allow the user to type in a
> value. Any ideas?

I do not think I had previously considered running a [Ruby][] program in this
way, but regardless of whether I ever would or not, I was curious about how this
question could be answered.

All the examples below will be for the [Bash][] shell unless specified.

## Why don't you just...?

First, though, let's just address some potential "why don't you just...?"
questions around the use of [piping][Pipeline (Unix)] in this scenario.

<div class="centered-image">
  <figure>
    <img src="/assets/images/2021-10-10/treachery-of-images-unix.jpg"
         alt="The Treachery of Images Unix parody">
    <figcaption>
      This is not a Unix pipe. From
      <a href="https://www.reddit.com/r/ProgrammerHumor/comments/1vyuny/ceci_nest_pas_une_pipe/">
        r/ProgrammerHumor
      </a>
    </figcaption>
  </figure>
</div>

Yes, we could _just_ change the command to pass the file directly to `ruby`, and
manually type in a name when [`gets`][] prompts for it:

```sh
$ ruby hello
Mario
Hello, Mario!
```

We could also use [process substitution][] to allow us to provide a name as an
argument when running a command:

```sh
$ ruby hello <(echo Mario)
Hello, Mario!
```

The codebase, as it stands, only really gives unexpected results when we ignore
the input prompt (ie just press `[Enter]`):

```sh
$ ruby hello
<press Enter>
Hello, !
```

Pressing `[Enter]` sends an empty string (`""`), not `nil`, and since `""` is a
[truthy value in Ruby][truthiness in Ruby], when `name || 'World'` gets
evaluated, `name` gets output.

This could be fixed by changing final line of the code to something like:

```ruby
puts "Hello, #{name.empty? ? 'World' : name}!"
```

This allows the program to fall back to its default value when input is not
provided:

```sh
$ ruby hello
<press Enter>
Hello, World!
```

But! We are going to consider all of the above as _out of scope_ for answering
this question, and we are going to take the use of a pipe as an _unchangeable_
(hard) requirement.

## Down the Pipe

<div class="centered-image">
  <figure>
    <img src="/assets/images/2021-10-10/Mario!_(86871905).jpg"
         alt="The Manchester Mario">
    <figcaption>
      The Manchester Mario.
      <a href="https://commons.wikimedia.org/wiki/File:Mario!_(86871905).jpg">
        Pete Birkinshaw from Manchester, UK
      </a>,
      <a href="https://creativecommons.org/licenses/by/2.0">
        CC BY 2.0
      </a>,
      via Wikimedia Commons
    </figcaption>
  </figure>
</div>

Back to the problem at hand. Running the original command, we get the
following:

```sh
$ cat hello | ruby
Hello, World!
```

The codebase is being passed over to `ruby`, so that we end up with a command
that looks something like:

```sh
ruby <code>
```

We want to be able to capture a reference to that code being passed over via the
pipe, so that we can inject arguments into it, and create a command that looks
something like:

```sh
ruby <code> [arguments]
```

### xargs

Whenever I want to do something potentially complex with piped-in arguments, I
tend to reach for the [xargs][] utility first. Let's see what we can do with it.

We will start with attempting to get the most basic command running first
(without any arguments), follow the trail of errors until it works, add in
arguments, then rinse and repeat.

First let's just try passing the code through xargs and see what happens:

```sh
$ cat hello | xargs ruby
/../bin/ruby: No such file or directory -- #!/usr/bin/env (LoadError)
```

It looks like we are only passing the first line of the file over to Ruby,
rather than the entire file.

This would seem to indicate that we have a [separator problem][]: xargs is not a
line-oriented tool, but also separates on spaces.

Looking back at the file, it's first line is:

```ruby
#!/usr/bin/env ruby
```

xargs has separated on the space between `env` and `ruby`, resulting in the
error above. Fortunately, using the `-0` flag deals with this problem, so let's
add it in:

```sh
$ cat hello | xargs -0 ruby
/../bin/ruby: No such file or directory -- #!/usr/bin/env ruby (LoadError)
# frozen_string_literal: true

name = gets&.strip

puts "Hello, #{name || 'World'}!"
```

Okay, it looks like the whole file is being passed through this time, but we are
still getting the same error. It would seem that perhaps `ruby` is not
evaluating the code it is getting passed.

We can fix this by adding `ruby`'s `-e` flag:

```sh
$ cat hello | xargs -0 ruby -e
Hello, World!
```

Great! We now have the default case working with xargs!

But, we still need a reference to the Ruby code being piped through so that we
can then give _it_ arguments.

To do that, we can use xargs' `-I` option, and name the variable however we
want. Let's call it `rubycode`:

```sh
$ cat hello | xargs -0I rubycode ruby -e rubycode
Hello, World!
```

So far, so good. Now, what happens when we use process substitution to provide
a name argument...?

```sh
$ cat hello | xargs -0I rubycode ruby -e rubycode <(echo Mario)
Hello, Mario!
```

Looks like we have ourselves a working command! Ship it! :shipit:

### !xargs

Looking back at the command, I cannot help but think that using xargs is
overkill for this kind of problem. The pipe is passing the code through as
[standard input][] (`stdin`), we use xargs to "catch" it, assign it to the
`rubycode` variable, and then pass that variable on to `ruby`.

Surely we can do the same thing with just plain bash code, right? Let's give it
a try by using [command substitution][] to capture the output of a
[redirection][] of `stdin` into a `rubycode` variable.

As we did with xargs, we can then use that variable in the Ruby command:

```sh
$ cat hello | rubycode=$(< /dev/stdin); ruby -e "$rubycode" <(echo Mario)
[No output]
```

Hmmm...getting no output here is unexpected.

And, indeed, it would seem that I have neglected to [group these commands
together][grouping commands] in `(`parentheses`)`, so that the redirection that
gets assigned to the `rubycode` variable can be applied to the other command
when it gets referenced in the `ruby` command:

```sh
$ cat hello | (rubycode=$(< /dev/stdin); ruby -e "$rubycode" <(echo Mario))
Hello, Mario!
```

And we are back to working again! But, we can probably make this a little bit
more compact without sacrificing readability.

Let's get rid of the intermediate `rubycode` variable, which removes a command,
meaning no need for any grouping:

```sh
$ cat hello | ruby -e "$(< /dev/stdin)" <(echo Mario)
Hello, Mario!
```

Success! At this point, I think I would consider the [yak shaved][yak shaving],
and leave it at that.

There are two other minor refactors I can think of, which we will go through
below for completeness' sake (said very loosely: "completeness" as in "all I
could think of right now", as I am sure there are more ways to do many of the
commands in this post), but I personally think they sacrifice readability.

### Bonus Shave

The [`cat`][] command, if no arguments are provided, copies the contents of
what it receives from standard input to [standard output][] (`stdout`). This
means that we do not need to grab a reference to `stdin` and redirect it, but
can instead just use `cat` in the `ruby` command:

```sh
$ cat hello | ruby -e "$(cat)" <(echo Mario)
Hello, Mario!
```

If you use [Z Shell][] ([`zsh`][]), then you have the option of tapping directly
into the mnemonics for Unix [file descriptors][] for `stdin` (`0`), `stdout`
(`1`), and [standard error][] (`stderr`, `2`):

```sh
$ cat hello | (ruby -e "$(<&0)" <(echo Mario))
Hello, Mario!
```

## Blunt Razors

Our supply of yak shaving cream is depleted, and our razors are now blunt.

Even if you never plan to run Ruby programs in the ways outlined above,
hopefully, like me, you were able to learn a bit more about shell programming!

Got any better commands that would make a shaven yak happier? Leave them in the
comments!

[Alistair Tweed]: https://twitter.com/alistairtweed
[Bash]: https://www.gnu.org/software/bash/
[`cat`]: https://www.gnu.org/software/coreutils/manual/html_node/cat-invocation.html
[command substitution]: https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html
[file descriptors]: https://en.wikipedia.org/wiki/File_descriptor
[`gets`]: https://rubyapi.org/o/kernel#method-i-gets
[grouping commands]: https://www.gnu.org/software/bash/manual/html_node/Command-Grouping.html
[hard requirement]: https://www.linkedin.com/pulse/why-requirements-cause-discomfort-dennis-vervoorn/#:~:text=and%20concept%20selection.-,Hard%20requirements,-Hard%20requirements%20are
[Pipeline (Unix)]: https://en.wikipedia.org/wiki/Pipeline_(Unix)
[process substitution]: http://www.gnu.org/software/bash/manual/html_node/Process-Substitution.html#Process-Substitution
[redirection]: https://www.gnu.org/software/bash/manual/html_node/Redirections.html
[Ruby]: https://www.ruby-lang.org/en/
[Ruby Australia]: https://ruby.org.au/
[Ruby Australia Slack]: https://ruby.org.au/slack
[separator problem]: https://en.wikipedia.org/wiki/Xargs#Separator_problem
[Slack]: https://slack.com/
[standard error]: https://en.wikipedia.org/wiki/Standard_streams#Standard_error_(stderr)
[standard input]: https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)
[standard output]: https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout)
[truthiness in Ruby]: https://learn.co/lessons/truthiness-in-ruby-readme
[xargs]: https://en.wikipedia.org/wiki/Xargs
[yak shaving]: https://en.wiktionary.org/wiki/yak_shaving
[Z shell]: https://en.wikipedia.org/wiki/Z_shell
[`zsh`]: https://www.zsh.org/
