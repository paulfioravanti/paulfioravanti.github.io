---
title:  "The Curious Incident of the Shadow in the Run-Time"
date:   2018-08-20 18:00 +1100
categories: ruby shadowing
header:
  overlay_image: /assets/images/2018-08-20/matthew-ansley-254316-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Matthew Ansley](https://unsplash.com/photos/6AQxBtaIYOk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/shadow?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Coding in Ruby is full of sweetness and light, but where there is light,
  shadows are cast.
---

Coding in [Ruby][] is full of sweetness and light, but where there is light,
shadows are cast. So, let's get out our torches and see if we can illuminate
our way through these darker corners of the language.

## Variable Shadowing

The use of shadowing in a codebase usually refers to [variable shadowing][]. A
basic example of this in Ruby would be:

**`variable_shadowing.rb`**

```ruby
x = 42
3.times { |x| puts "x is #{x}" }
```

Notice that there are two variables named "`x`": the outer variable, and the
block variable. Is this an actual problem, though? Let's try running it:

```sh
$ ruby variable_shadowing.rb
x is 0
x is 1
x is 2
```

The output looks reasonable. The call to `puts` is inside a block, so it
outputs the `x` value that is local to that block: it would definitely be
surprising if `puts` prioritised values that are outside of its local scope,
and output "`x is 42`" three times.

So, does Ruby really care that we are writing our code like this as long as we
are getting the output we expect? To answer that, let's try running the program
again, but this time with warnings enabled:

```sh
$ ruby -w variable_shadowing.rb
variable_shadowing.rb:2: warning: shadowing outer local variable - x
variable_shadowing.rb:1: warning: assigned but unused variable - x
x is 0
x is 1
x is 2
```

It looks like Ruby _does_ care: about both the shadowing, as well as declaring
an unused variable (not enough to raise an error, but enough to make you feel
that perhaps [Matz][] is very mildly frowning at you). But why, though? Well,
one reason could be that what if we wanted to change our program to have `puts`
output both the block variable _and_ the outer variable?

**`variable_shadowing.rb`**

```ruby
x = 42
3.times { |x| puts "Local x is #{x} and outer x is #{'What goes here??'}" }
```

Since we already have a local variable named `x`, there is no way to access
some other variable, also called `x`, that is outside the local scope. In order
to get this to work, we would have to change the name of one of the variables:

**`variable_shadowing.rb`**

```ruby
y = 42
3.times { |x| puts "x is #{x} and y is #{y}" }
```

```sh
$ ruby -w variable_shadowing.rb
x is 0 and y is 42
x is 1 and y is 42
x is 2 and y is 42
```

This is why variable shadowing in Ruby is generally considered
["a bad habit and should be discouraged"][Ruby shadowing a bad habit]. Aside
from Ruby warnings, [Rubocop][] has a [`ShadowingOuterLocalVariable` cop][]
(which mimics Ruby's warning), so there are ways to enable your tools to help
you keep the shadows at bay.

However, there is another kind of shadowy figure lurking at the peripheries
of the Ruby language, aside from the variable-on-variable kind, that Ruby
tooling does not warn you about. You are probably unlikely to come across it in
the wilds of production code, but it is worth knowing about since it can make
for some interesting/confusing behaviour.

## Instance Method Shadowing

{% capture samuel_zeller_img %}
![Samuel Zeller Image](/assets/images/2018-08-20/samuel-zeller-15925-unsplash.jpg)
{% endcapture %}
{% capture samuel_zeller_credit %}
Photo by [Samuel Zeller](https://unsplash.com/photos/pbzWSUla7cU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on [Unsplash](https://unsplash.com/search/photos/shadow?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
{% endcapture %}
<figure>
  {% include stripped_markdown.html markdown=samuel_zeller_img %}
  <figcaption>
    {% include stripped_markdown.html markdown=samuel_zeller_credit %}
  </figcaption>
</figure>

The [Local Variables and Methods Assignment][] section of
[Ruby's syntax documentation][] says that:

> In Ruby, local variable names and method names are nearly identical. If you
> have not assigned to one of these ambiguous names, Ruby will assume you wish
> to call a method. Once you have assigned to the name, Ruby will assume you
> wish to reference a local variable.
>
> The local variable is created when the parser encounters the assignment,
> not when the assignment occurs.

Ruby parses code line by line from top to bottom during run time. So, the
understood meaning of one of the "names" mentioned above can _change_ as the
parser moves down the file: what was originally considered a method call, can
become a reference to a local variable.

Let's illustrate this using a completely contrived example:

**`person.rb`**

```rb
class Person
  attr_accessor :name

  def initialize(name = nil)
    @name = name
  end

  def say_name
    if name.nil?
      name = "Unknown"
    end

    puts "My name is #{name.inspect}"
  end
end
```

Given what we now know of local variable and method assignment, I would expect
the following to happen when we attempt to get a `Person` to say its name:

- In the `#say_name` instance method, the first occurrence of `name`, seen in
  the `if name.nil?` statement, would refer to the `#name` instance method
  provided by `attr_accessor`
- When the Ruby parser sees the `name = "Unknown"` assignment line, it will,
  from that point on, consider any reference to `name` _after_ the assignment to
  refer to a local variable called `name`, and not the instance method `#name`
- Therefore, even if an object of `Person` had a `@name` assigned to it on
  initialisation (eg `Person.new("Paul")`), the `name` referenced in the final
  line of the `#say_name` method (`name.inspect`) would have a value of `nil`.
  This is because at the point of `name.inspect`, even though `name.nil?` would
  have failed, and therefore the `name = "Unknown"` local variable assignment
  would not actually be made, the parser _still sees_ that `name` should now
  refer to a local variable, which has not been assigned to, and so is `nil`.

Let's open up an IRB console and test these assumptions.

```sh
$ irb
irb(main):001:0> require "./person.rb"
true
irb(main):002:0> Person.new("Paul").say_name
My name is nil
nil
```

Looks like the first assumption is confirmed:

- the instance method check of `name.nil?` fails
- a `name` local variable is not assigned
- `name.inspect` is checking the value of a local variable and not an
  instance method
- `name` is therefore `nil`

Now, what happens when we initialise a `Person` object without a name:

```sh
irb(main):003:0> Person.new.say_name
My name is "Unknown"
nil
```

- `name.nil?` succeeds
- `name` local variable is assigned to `"Unknown"`
- `"Unknown"` is that value that gets output.

Great! I mean, kind of weird, but okay! Now, how about we dive a bit deeper and
see if we can observe how the referencing of `name` changes as the Ruby parser
reads through the code.

## Schrodinger's Variable

{% capture joao_silas_img %}
![João Silas Image](/assets/images/2018-08-20/joao-silas-72563-unsplash.jpg)
{% endcapture %}
{% capture joao_silas_credit %}
Photo by [João Silas](https://unsplash.com/photos/UGQoo2nznz8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on [Unsplash](https://unsplash.com/search/photos/magnifying-glass?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
{% endcapture %}
<figure>
  {% include stripped_markdown.html markdown=joao_silas_img %}
  <figcaption>
    {% include stripped_markdown.html markdown=joao_silas_credit %}
  </figcaption>
</figure>

We will use the [Pry][] debugger to see if we can follow `name`'s journey from
instance method to local variable. After you

- run `gem install pry`
- add `require "pry"` at the top of `person.rb`
- add a `binding.pry` breakpoint at the beginning of the `#say_name` method

open up another IRB console and let's take a peek at what is going on.

```sh
$ irb
irb(main):001:0> require "./person.rb"
true
irb(main):002:0> Person.new("Paul").say_name

From: /person.rb @ line 13 Person#say_name:

    10: def say_name
    11:   binding.pry
    12:
 => 13:   if name.nil?
    14:     name = "Unknown"
    15:   end
    16:
    17:   puts "My name is #{name.inspect}"
    18: end

[1] pry(#<Person>)>
```

Right, we now have a breakpoint at the point where `name.nil?` gets checked. At
this point, we have not reached the `name` variable assignment, so `name` should
refer to the instance method, and have a value of `"Paul"`. Let's check:

```sh
irb(main):002:0> Person.new("Paul").say_name

From: /person.rb @ line 13 Person#say_name:

    10: def say_name
    11:   binding.pry
    12:
 => 13:   if name.nil?
    14:     name = "Unknown"
    15:   end
    16:
    17:   puts "My name is #{name.inspect}"
    18: end

[1] pry(#<Person>)> name
nil
[2] pry(#<Person>)>
```

Err, what? How does `name` have a value of `nil` if we have not reached the
variable assignment statement yet? What is `name` referring to? Is this some
weird Pry thing? So many questions...

Well, regardless of having our expectations flipped, let's follow this through
to the end. Since we now have `nil`, I would expect that our next stop will be
at line 14, where `"Unknown"` _does_ get assigned to `name`. Let's get Pry go to
the next execution statement:

```sh
[1] pry(#<Person>)> name
nil
[2] pry(#<Person>)> next

From: /person.rb @ line 17 Person#say_name:

    10: def say_name
    11:   binding.pry
    12:
    13:   if name.nil?
    14:     name = "Unknown"
    15:   end
    16:
 => 17:   puts "My name is #{name.inspect}"
    18: end

[2] pry(#<Person>)>
```

It...skipped directly to the bottom, and it would seem that the assignment did
not happen. Let's see if that is the case, and what gets output:

```sh
From: /person.rb @ line 17 Person#say_name:

    10: def say_name
    11:   binding.pry
    12:
    13:   if name.nil?
    14:     name = "Unknown"
    15:   end
    16:
 => 17:   puts "My name is #{name.inspect}"
    18: end

[2] pry(#<Person>)> name
nil
[3] pry(#<Person>)> exit
My name is nil
nil
irb(main):003:0>
```

This is all quite confusing. We got the expected result from running
`Person.new("Paul").say_name`, but, on the way, did we encounter some kind of
spooky quantum Ruby that ended up changing the value of `name` just because we
observed it? Well, before we start handing ourselves honorary doctorates in
quantum computing, let's call on the old traditional Ruby debugger, `puts`, to
see if we can get an impartial view of what the value of `name` is before the
`name.nil?` check:

```sh
$ irb
irb(main):001:0> require "./person"
true
irb(main):002:0> Person.new("Paul").say_name

From: /person.rb @ line 13 Person#say_name:

    10: def say_name
    11:   binding.pry
    12:
 => 13:   puts name.inspect
    14:   if name.nil?
    15:     name = "Unknown"
    16:   end
    17:
    18:   puts "My name is #{name.inspect}"
    19: end
```

Now, let's compare what value we get for `name` when using Pry, versus the
value we get inside the code with `puts`:

```sh
[1] pry(#<Person>)> name
nil
[2] pry(#<Person>)> next
"Paul"

From: /person.rb @ line 14 Person#say_name:

    10: def say_name
    11:   binding.pry
    12:
    13:   puts name.inspect
 => 14:   if name.nil?
    15:     name = "Unknown"
    16:   end
    17:
    18:   puts "My name is #{name.inspect}"
    19: end

[2] pry(#<Person>)>
```

Running `next` executes the `puts name.inspect` code, which gives us `"Paul"`,
the value we expect, but Pry still says that `name` is `nil`. How can the same
variable have two values? It can't, so there must be something else at play
here. What version of `name` exactly _are_ Pry and `puts` seeing when the code
is being stepped through? Well, there is one more Ruby tool that can help us
find that out: the [`defined?`][] keyword, which returns a string describing its
argument.

```sh
$ irb
irb(main):001:0> require "./person"
true
irb(main):002:0> Person.new("Paul").say_name

From: /person.rb @ line 13 Person#say_name:

    10: def say_name
    11:   binding.pry
    12:
 => 13:   puts defined?(name).inspect
    14:   if name.nil?
    15:     name = "Unknown"
    16:   end
    17:
    18:   puts "My name is #{name.inspect}"
    19: end
```

Okay, first, let's see what what the Ruby code considers `name` to be:

```sh
From: /person.rb @ line 13 Person#say_name:

    10: def say_name
    11:   binding.pry
    12:
 => 13:   puts defined?(name).inspect
    14:   if name.nil?
    15:     name = "Unknown"
    16:   end
    17:
    18:   puts "My name is #{name.inspect}"
    19: end

[1] pry(#<Person>)> next
"method"
```

Ruby says `name` is a method! That gels with what we would expect. So what about
Pry...?

```sh
From: /person.rb @ line 13 Person#say_name:

    10: def say_name
    11:   binding.pry
    12:
 => 13:   puts defined?(name).inspect
    14:   if name.nil?
    15:     name = "Unknown"
    16:   end
    17:
    18:   puts "My name is #{name.inspect}"
    19: end

[1] pry(#<Person>)> defined?(name)
"local-variable"
```

Pry sees `name` as a local variable! How can this be if we have not reached the
assignment statement yet? Can Pry see into the future? Well, Pry itself can't,
and what is happening is not _really_ seeing into the future.

## Not even slightly elementary, my dear Ruby

The key to this mystery is the `binding` part of the `binding.pry` statement.
Ruby's [Binding][] "encapsulates the execution context at some particular place
in the code", which, in our case, is the entirety of the `#say_name` method.

When we step through the code with `binding.pry`, at the point of the
`name.nil?` statement, the Ruby parser sees `name` as referring to a method,
since it knows nothing about any assignment statements yet. Pry, on the other
hand, thanks to the `binding` effectively "rushing ahead to read the rest of the
method" so it can create its execution context, knows all about the local
variable assignments that could happen. Hence, we can now see the discrepancies
in the results between running `puts` inline and using Pry in this case.

How can you avoid falling into these kinds of pits of potential confusion?
Well, just don't shadow, really. Leaving aside the quality issues of the
example code (it is meant to illustrative of the problem and not exemplary Ruby
code after all), to get expected results, there are enough ways it could be
changed to fulfil different objectives like:

- Specifically assign to the person's `name` attribute if they were not given
  one:

  ```ruby
  def say_name
    if name.nil?
      self.name = "Unknown"
    end
    puts "My name is #{name.inspect}"
  end
  ```

- Output a display name without assigning a `name` attribute if one was not
  originally given.<br />
  - Using `self` to refer to the `name` property:

    ```ruby
    def say_name
      name = self.name || "Unknown"
      puts "My name is #{name.inspect}"
    end
    ```

  - Using parentheses:

    ```ruby
    def say_name
      name = name() || "Unknown"
      puts "My name is #{name.inspect}"
    end
    ```

So, be kind to your future self and your team mates, and re-consider shadowing
in your code. If you ever do find yourself needing to, though, be sure to leave
a comment explaining why.

### Other Resources

- [Behaviours of a Ruby local variable shadowing an instance method][] - A
  Stack Overflow question I asked regarding this kind of shadowing and that
  eventually led to the creation of this blog post.
- [What does "shadowing" mean in Ruby?][] - A good Stack Overflow question
  outlining variable shadowing in Ruby.
- [A Ruby shadowing bug in the wild][] - The blog post that originally got me
  scratching the surface of Ruby shadowing.

[A Ruby shadowing bug in the wild]: https://thomasleecopeland.com/2017/04/20/shadowing-bug-in-the-wild.html
[Behaviours of a Ruby local variable shadowing an instance method]: https://stackoverflow.com/questions/46597191/behaviours-of-a-ruby-local-variable-shadowing-an-instance-method
[Binding]: https://ruby-doc.org/core-2.5.1/Binding.html
[`defined?`]: https://docs.ruby-lang.org/en/2.5.0/syntax/miscellaneous_rdoc.html#label-defined-3F
[Local Variables and Methods Assignment]: https://docs.ruby-lang.org/en/2.5.0/syntax/assignment_rdoc.html#label-Local+Variables+and+Methods
[Matz]: https://en.wikipedia.org/wiki/Yukihiro_Matsumoto
[Pry]: https://github.com/pry/pry
[Rubocop]: https://github.com/rubocop-hq/rubocop
[Ruby]: https://www.ruby-lang.org/en/
[Ruby shadowing a bad habit]: https://bugs.ruby-lang.org/issues/12490#note-2
[Ruby's syntax documentation]: https://docs.ruby-lang.org/en/2.5.0/syntax_rdoc.html
[Samuel Zeller Image]: /assets/images/2018-08-20/samuel-zeller-15925-unsplash.jpg
[`ShadowingOuterLocalVariable` cop]: https://www.rubydoc.info/gems/rubocop/RuboCop/Cop/Lint/ShadowingOuterLocalVariable
[variable shadowing]: https://en.wikipedia.org/wiki/Variable_shadowing
[What does "shadowing" mean in Ruby?]: https://stackoverflow.com/questions/6259314/what-does-shadowing-mean-in-ruby
