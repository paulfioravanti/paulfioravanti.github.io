---
title:  "The Curious Incident of the Shadow in the Run-Time"
date:   2018-08-19 09:10 +1100
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
some other variable, also called `x`, that is out of the local scope. In order
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
  {{ samuel_zeller_img | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>
    {{ samuel_zeller_credit | markdownify | remove: "<p>" | remove: "</p>" }}
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

Ruby parses code in a file line by line from top to bottom during run time. So,
the understood meaning of one of the "names" mentioned above can _change_ as the
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
  have failed (since the person has a non-`nil` name) and therefore the
  `name = "Unknown"` local variable assignment is not actually made, the parser
  _still sees_ that `name` should now refer to a local variable, which has not
  been assigned to, and so is `nil`.

Let's open up an IRB console and test these assumptions.

```sh
irb(main):001:0> require "./person.rb"
true
irb(main):002:0> Person.new("Paul").say_name
My name is nil
nil
```

Looks like the first assumption is confirmed: instance method check of
`name.nil?` fails, `name` local variable is not assigned, `name.inspect` is
checking the value of a local variable and not an instance method, and is
therefore `nil`.

Now, what happens when we initialise a `Person` object without a name:

```sh
irb(main):003:0> Person.new.say_name
My name is "Unknown"
nil
```

Here, `name.nil?` succeeds, `name` local variable is assigned to `"Unknown"`,
and it is that value that is output.

Great! I mean, kind of weird, but okay! Now, how about we dive a bit deeper and
see if we can observe how the referencing of `name` changes as we move through
the code.

## Schrodinger's Variable

[Local Variables and Methods Assignment]: https://docs.ruby-lang.org/en/2.5.0/syntax/assignment_rdoc.html#label-Local+Variables+and+Methods
[Matz]: https://en.wikipedia.org/wiki/Yukihiro_Matsumoto
[Pry]: https://github.com/pry/pry
[Rubocop]: https://github.com/rubocop-hq/rubocop
[Ruby]: https://www.ruby-lang.org/en/
[Ruby shadowing a bad habit]: https://bugs.ruby-lang.org/issues/12490#note-2
[Ruby's syntax documentation]: https://docs.ruby-lang.org/en/2.5.0/syntax_rdoc.html
[`ShadowingOuterLocalVariable` cop]: https://www.rubydoc.info/gems/rubocop/RuboCop/Cop/Lint/ShadowingOuterLocalVariable
[variable shadowing]: https://en.wikipedia.org/wiki/Variable_shadowing
