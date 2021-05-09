---
title: "Coding Test Review: Sentia"
date: 2021-05-09 18:50 +1100
last_modified_at: 2021-05-09 18:50 +1100
tags: ruby rails coding-test star-wars data-parsing tailwind enum draper kaminari tachyons pattern-matching
header:
  image: /assets/images/2021-05-09/jocasta-helps-obi-wan.png
  image_description: "Jocasta helps Obi-wan in the Jedi Archives"
  teaser: /assets/images/2021-05-09/jocasta-helps-obi-wan.png
  overlay_image: /assets/images/2021-05-09/jedi-archives.png
  overlay_filter: 0.1
excerpt: >
  A long SQL query in a database far, far away....
---

I actually quite like coding tests.

Not whiteboard coding tests, or generic algorithm tests that read more like math
problems (usually set by "tech recruiting platforms", and performed under
exam-like conditions), but "take-home" tests where you get to build something
practical in a specific technology stack.

They can be fun and stimulating in the same way as answering questions on [Stack
Overflow][], or solving problems on learning platforms like [Exercism][], and
can also be good fodder for your [online coding portfolio][Github]. I find I
nearly always learn something new, or a different way of doing something I may
already know, that makes me re-think the way I have solved a problem.

In this instance, a friend sent me [Sentia][]'s coding test to check out, and
simply because I felt like I had not begun a [Ruby on Rails][] application from
scratch in a long time, I decided to take a crack at it. So, here is my review
of that attempt.

Here are the public links for the deployed application and codebase:

- [Sentia Coding Test application][]
- [Sentia Coding Test codebase][]

> Disclaimer: I am not, nor have ever been, an employee of Sentia, nor have I
  ever applied for employment there, nor is this post some kind of attempt to
  get them to employ me; I just did their coding test for my own definition of
  "fun".
>
> If you are applying there, or plan to in the future, you may want to stop
  reading, and consider pretending that this blog post (and [all the other
  solutions people have posted][Sentia tests]) does not exist, so you
  can greet their coding test with fresh eyes (assuming this one is still being
  used...)

## Original Requirements

You will be required to create a Ruby on Rails application with the following
features below. The sample CSV data required for the test can be found
[here][sample-csv-link]. This application can be built in 1 hour.

Below is a list of user stories and requirements for each section of this
application.

### PART 1

As a user, I should be able to upload this sample CSV and import the data into a
database.

IMPORTER REQUIREMENTS

1. The data needs to load into 3 tables. **People**, **Locations** and
  **Affiliations**<br />
2. A **Person** can belong to many **Locations**<br />
3. A **Person** can belong to many **Affiliations**<br />
4. A **Person** without an **Affiliation** should be skipped<br />
5. A **Person** should have both a _first\_name_ and _last\_name_. All fields
   need to be validated except for _last\_name_, _weapon_ and _vehicle_ which
   are optional.<br />
6. Names and Locations should all be titlecased

### PART 2

1. As a user, I should be able to view these results from the importer in a
   table.
2. As a user, I should be able to paginate through the results so that I can see
   a maximum of 10 results at a time.
3. As a user, I want to type in a search box so that I can filter the results I
   want to see.
4. As a user, I want to be able to click on a table column heading to reorder
   the visible results.

Once the test has been completed. Please upload to Git Repo/Google Drive/DropBox
or zip and email over back to _\<person\>_ at _\<person's email\>_. &#8718;

The sample [CSV][] file contains the following data from a galaxy far, far
away....

|Name            |Location            |Species        |Gender|Affiliations                        |Weapon         |Vehicle               |
|----------------|--------------------|---------------|------|------------------------------------|---------------|----------------------|
|Darth Vader     |Death Star, Tatooine|Human          |Male  |Sith                                |Lightsaber     |Tiefighter            |
|Chewbacca       |kashyyk             |Wookie         |m     |Rebel Alliance                      |Bowcaster      |Millennium Falcon     |
|yoda            |Yoda's Hutt         |Unknown        |Male  |Jedi Order                          |Lightsaber     |                      |
|Sheev Palpatine |Naboo               |Human          |Male  |Galactic Republic                   |Lightsaber     |                      |
|Princess Leia   |Alderaan            |Human          |Female|Rebel Alliance, Galactic Republic   |Blaster Pistol |                      |
|jabba the Hutt  |Tatooine            |Hutt           |Male  |Hutt Clan                           |               |Jabba's Sale Barge    |
|Kylo Ren        |chandrila           |Human          |Male  |First Order                         |Lightsaber     |                      |
|Obi-Wan Kenobi  |Stewjon             |Human          |M     |Jedi Order                          |Lightsaber     |Jedi Starfighter      |
|luke skywalker  |Tatooine            |Human          |M     |Rebel Alliance, Jedi Order          |Lightsaber~!@@@|X-wing Starfighter    |
|Jar Jar Binks   |Naboo               |Gungan         |Male  |Galactic Republic, Gungan Grand Army|Energy Ball    |Gungan Bongo Submarine|
|R2-D2           |Naboo               |Astromech Droid|Other |Rebel Alliance, Galactic Republic   |               |X-wing Starfighter    |
|Han Solo        |Corellia            |Human          |Male  |Rebel Alliance                      |Blaster Pistol |Millennium Falcon     |
|Boba Fett       |Kamino              |Human          |m     |                                    |Blaster        |Slave 1               |
|Rey             |Jakku               |Human          |f     |Jedi Order                          |Lightsaber     |Rey's Speeder         |
|padme amidala   |naboo               |Human          |Female|Galactic Republic                   |               |Naboo N-1 Starfigher  |
|C-3PO           |Tatooine            |Protocol Droid |Other |The Resistance                      |               |-1                    |
|Mace Windu      |Haruun Kal          |Human          |Male  |Jedi Order                          |Lightsaber     |                      |
|Lando calrissian|Cloud City          |Human          |Male  |Rebel Alliance                      |Blaster Pistol |Millennium Falcon     |

## :elephant:

First thing's first: let's address the [elephant in the requirements][Elephant
in the room]:

> This application can be built in 1 hour.

If this is true, then I am a **_terrible_** developer.

It took me a fair bit longer than that to write working code as-per
requirements, debug the requirements (more on that later...), get it deployed
somewhere on the internet, and refactor the code to a state where I would be
happy to submit it for public consumption and criticism (I was _still_
refactoring it while writing this post).

If the intention is for someone to complete as many of the requirements as they
can _within_ that fixed 1 hour time frame, with the end result considered
through the lens of that artificial constraint, then that should be made
explicit.

Regardless, I think it would probably be for the best to just remove that line,
and allow candidates attempting this test to just focus on submitting their best
attempt, and keep [imposter syndrome][] at bay for that little bit longer.

## General Approach

Since the requirements around this application focus on it being a Ruby on Rails
application, I decided to go as "vanilla" as possible with Rails.

This meant no explicit addition by me of any custom [Javascript][], or any
front-end frameworks that use it, to help out with things like filtering or
sorting information.

I also tried to add the least amount of third-party non-Rails-default gems as
possible, only using:

- [ActiveRecord::PGEnum][], due to its nice developer ergonomics in dealing
  with [Postgres Enumerated Types][] (more about why they were even needed
  later...)
- [Draper][] for [decorators][Decorator Pattern]: I really do not like using
  [Rails helpers][] for [presentation logic][], preferring instead to keep it
  attached to the object being rendered; raw data can come from the
  [Rails model][Active Record] class, while transforming that data for display
  in a [Rails view][Action View] can come from a decorator
- [Kaminari][] for [pagination][], as I think it is currently the best gem for
  it

## User Interface

Since interface design and making things pretty in general is a weak-point for
me, I used this test as an excuse to give [Tailwind CSS][] a try in order to
style everything on the page (I have used [Tachyons][] before on other toy
projects, so I am generally positive to the [utility-first CSS][] concept), as
well as use [Tailwind UI][] to (hopefully) grab ready-made code for certain
types of components.

![Screenshot][img screenshot]

For the most part, this was true for the following parts of the app:

- data table
- upload button
- search bar
- pagination widget

But, as would be expected, it was not all quite as simple as [plug and play][].
Integrating Tailwind into the Kaminari-generated pagination views probably took
the most amount of time. But, I got there in the end, and am generally pleased
with how it looks for the time spent on it.

For the most part, I left any long Tailwind-mnemonic-filled class strings as
they were in the Rails view files. However, when those strings became too long,
and generally difficult to read, I extracted them into separate [SCSS][] files
using Tailwind's [`@apply`][] directive (see files under the
[`app/javascript/stylesheets/`][] directory). I think I will likely continue to
use this kind of strategy in the future with Tailwind class strings.

Overall, I am happy to have been able to stand on the Tailwind ecosystem's
shoulders to build out the user interface, and will definitely consider using it
again in future projects.

## Data Issues

Turning our gaze towards the provided dataset that the application must be
able to import, there is no doubt that the CSV file deliberately contains some
corrupt/bad data that you are meant to be able to
[program defensively][Defensive Programming] against.

My general intentions were to only _not_ import an entry where the requirements
specifically said not to (i.e. a person without an affiliation should be
skipped), and where the data could not be _reasonably_ [munged][] into an
acceptable format.

<div style="margin: auto; text-align: center; width: 90%;">
  <figure style="display: block">
    <img src="/assets/images/2021-05-09/perhaps-archives-incomplete.jpg"
         alt="80sfy.com screenshot" />
  </figure>
</div>

### Mis-spellings

So, this meant that `Lightsaber~!@@@` could just be stripped of non-alphanumeric
characters and become a valid `Lightsaber` weapon, but there were also issues
around mis-spellings in the data, where I needed to give the application more
knowledge around what kind of values it could expect to find in the CSV file,
and what those values actually _should_ be.

This occurred in the form of a [Hash][] that maps values known to be found in
the CSV file to their correct values:

**`app/services/data_importer/enum_field_parser.rb`**

```ruby
MISSPELLINGS = {
  "Yoda's Hutt" => "Yoda's Hut",
  "Naboo N-1 Starfigher" => "Naboo N-1 Starfighter"
}
```

I am pretty sure that [Yoda][] does not own a pet [Jabba][Jabba the Hutt].

Anyway, it is not possible for me to tell whether the introduction of these
mis-spellings was deliberate in order to see if a candidate picked up on them,
but I am going to wager that these _were_ actually just typos, and the necessity
for this kind of handling was not intentional.

### Value Validity

Under [C-3PO][]'s entry, the value for the Vehicle is given as `-1`: an obvious
ploy to make sure that you do not actually store this value in a Person's
vehicle field.

However, if `-1` is not a valid entry, it then stands to reason that I cannot
trust _any_ of those values in the file, and, therefore, need to give the
application advance knowledge on _what_ vehicles it can accept as valid.

This meant that for a Person entry, I ended up making _every value_ provided for
a non-name-related field an [enumerated type][]: both in the application, and at
the database level.

The fact that there was the spelling mistake for Yoda's location also made me
assign enumerated types for the names of Locations and Affiliations. The
application really does have too much advance knowledge of the limited scope
of valid values it could get from the CSV file, but I did not see any other way
around this while still ensuring data correctness.

### Names

The requirements assume that the name values in the CSV file can be split out
into _first\_name_ and _last\_name_, which, taken at face value, they certainly
can.

However, this leads to the issue of having a table that looks like this for
some values:

|First Name|Last Name|
|----------|---------|
|Princess  |Leia     |
|Darth     |Vader    |
|Kylo      |Ren      |
|Jabba     |The Hutt |

Some nerds should have looked over this data before it went public because
_[ackchyually][]..._

- "Princess" is a title, not a name, and "Leia" is [Leia Organa][]'s first name
- ["Darth" is a title][Darth], not a name, and "[Vader][Darth Vader]" is more
  like a first name
- "Ren" is not a last name, but is from [Knights of Ren][], and [Kylo Ren][]
  used it more like a title once he became the inheritor of Ren's Knights
- "The Hutt" is not a last name, but refers to the [Hutt species][Hutt]

So, although not part of the requirements, I figured that this meant the
application really needed to deal with the concept of name prefixes (titles etc)
and [suffixes][Suffix] (you may have noticed their inclusion in the screenshot
above).

Also, for names like Jabba The Hutt and [Jar Jar Binks][], without the
application knowing in advance that "The Hutt" is a suffix, it would not be
able to tell the which words in either of those names comprise the _first\_name_
or _last\_name_.

The ability to deal with the name situation was made a bit more straightforward
thanks to Ruby 3.0's [pattern matching][] capabilities. The `parse_name` method
below returns an array containing `[prefix, first_name, last_name, suffix]`:

**`app/services/data_importer/person_parser.rb`**

```ruby
def parse_name(name)
  name_parts = name.split.map(&:upcase_first)

  case name_parts
  in [name]
    [nil, name, nil, nil]
  in ["Darth" | "Princess" => prefix, *rest]
    [prefix, *rest]
  in [*first_names, "Ren" => suffix]
    [nil, first_names.join(" "), nil, suffix]
  in [*first_names, "The", "Hutt"]
    [nil, first_names.join(" "), nil, "The Hutt"]
  else
    *first_names, last_name = name_parts
    [nil, first_names.join(" "), last_name, nil]
  end
end
```

Something like the method above is, of course, doable without pattern matching,
but I think the terseness above really helps in understanding how specific data
shapes are pin-pointed, and then transformed into the desired output.

## Application Code

Having spent more time with [functional][functional programming] languages like
[Elixir][] and [Elm][] recently, I definitely found their influence creeping
into the way I want to write [Ruby][].

I definitely do not consider this a bad thing, nor do I (subjectively) think
that the code reads less Ruby/Rails-like as a result (though I have, happily,
challenged some Rails conventions). But, let's have a look at some examples of
main the `Person`-related controller and model of the application and you can
judge for yourself.

### Controller

**`app/controllers/people_controller.rb`**

```ruby
class PeopleController < ApplicationController
  def index
    @people =
      Person.search(params[:search])
        .then(&method(:sort_people))
        .then(&method(:paginate_people))
        .then(&method(:decorate_people))
  end

  private

  def sort_people(people)
    PeopleSorter.sort(people, sort_column, sort_direction)
  end

  def sort_column
    @sort_column ||= Person.sort_column(params[:sort])
  end

  def sort_direction
    @sort_direction ||= SortDirection.determine(params[:direction])
  end

  def paginate_people(sorted_people)
    Paginator.paginate_array(sorted_people, params[:page])
  end

  def decorate_people(paginated_people)
    PersonDecorator.decorate_collection(
      paginated_people,
      context: {
        sort_column: sort_column,
        sort_columns: Person.sort_columns,
        sort_direction: sort_direction,
        params: params
      }
    )
  end
end
```

A few notes about this code:

- The code that assigns to the `@people` instance variable is written in a style
  mimicking the [Elixir pipeline operator][], through the use of Ruby's
  [`Kernel#then`][] method (aka [`Kernel#yield_self`][]). The collection of people
  that originally gets fetched from the database goes through a series of
  transformations (filtered via search -> sorted -> paginated -> decorated)
  before being handed off to the view, so I thought this way of writing the main
  controller code would indicate that most clearly and explicitly.
- I would have liked to have had the database do the sorting for me, rather than
  do it in Ruby-land, but the fact that sorting needed to happen on values
  contained in a `Person`'s associations (locations and affiliations), made it
  untenable.
- I originally had the implementation code for `sort_direction` up in the
  `ApplicationController`, since it is not specific to a `Person`; putting
  it there would, I think, be considered Rails convention for code of that
  nature. But, rather than counting on someone looking at a method call, which
  has no local definition, and then _implicitly knowing_ that its definition
  could come from a [superclass][], I decided to extract it into a small, named
  service module (`SortDirection`), so there is an _explicit_ call-out
  (`SortDirection.determine`).  I do not generally like using [inheritance][],
  and will try and avoid it where I can.
- I created a small `Paginator` service module with the intention of keeping
  knowledge about `Kaminari` restricted to it. Who knows, maybe I might want to
  change over to something like [will_paginate][] one day, and organising the
  code like this, using the [Adapter pattern][], will mean no changes will be
  required in the controller (yes, fine, guilty of [YAGNI][] since this just a
  coding test, but I have no regrets...).
- Both `sort_column` and `sort_direction` are needed in the view, as well as in
  the controller. I have seen many codebases use the [encapsulation][]-busting
  [`helper_method`][] method to allow controllers and views to share methods (I
  even used it in earlier iterations of this code). However, since decorators
  are being used in this application, this can be avoided by explicitly passing
  in whatever extra controller information is needed in presentation logic via
  a `context` hash, that is only accessible within the confines of the decorator
  class.

### Model
  
**`app/models/person.rb`**

```ruby
class Person < ApplicationRecord
  include PGEnum(
    species: Enum::SPECIES,
    gender: Enum::GENDERS,
    weapon: Enum::WEAPONS,
    vehicle: Enum::VEHICLES
  )

  has_many :loyalties
  has_many :affiliations,
           -> { order("affiliations.name ASC") },
           through: :loyalties
  has_many :residences
  has_many :locations,
           -> { order("locations.name ASC") },
           through: :residences

  def self.search(search)
    query =
      includes(:locations, :affiliations)
        .references(:locations, :affiliations)

    search ? Search.query(query, search) : query
  end

  def self.sort_column(sort_param)
    Sort.column(sort_param)
  end

  def self.sort_columns
    Sort::SORT_COLUMNS
  end

  def first_affiliation_name
    affiliations.first.name
  end

  def affiliation_names
    affiliations.map(&:name)
  end

  def first_location_name
    locations.first.name
  end

  def location_names
    locations.map(&:name)
  end
end
```

A few notes about this code:

- All methods return data only. Nothing here is responsible for returning
  formatted strings, or anything else that is meant for display purposes: that
  is strictly the job of the decorators.
- For functionality related to things like searching or sorting people, for the
  basic implementations I have done, it would probably be considered Rails
  convention to have that code live in [Rails concerns][], and `include` those
  modules in the `Person` class to make their methods available.<br />
  Like inheritance, I really do not like using [composition][] in this way, as I
  feel that it is too implicit as well. Perhaps if Ruby had something akin to
  Elixir's [`Kernel.SpecialForms.import/2`][], where you could explicitly
  enumerate the methods to import (something like `include Search,
  only: :search_query`), then I would probably be more favourably inclined to
  them.<br/>
  So, instead, I opted for what I would consider a more Ruby-ish than Rails-ish
  way of separating the code, through the use of what is apparently called
  [partial classes][partial class] to achieve [separation of concerns][]\:
  essentially, re-opening the `Person` class in separate files, and putting code
  in small `private` modules for `Search`, and `Sort`, and then have the model
  explicitly call them (eg  `Search.query`, `Sort.column`). For example:

  **`app/models/person/search.rb`**

  ```ruby
  class Person
    module Search
      SEARCH_QUERY =
        "prefix ILIKE :search "\
        "OR first_name ILIKE :search "\
        "OR last_name ILIKE :search "\
        "OR suffix ILIKE :search "\
        "OR locations.name::text ILIKE :search "\
        "OR species::text ILIKE :search "\
        "OR gender::text ILIKE :search "\
        "OR affiliations.name::text ILIKE :search "\
        "OR weapon::text ILIKE :search "\
        "OR vehicle::text ILIKE :search"
      private_constant :SEARCH_QUERY

      module_function

      def query(query, search)
        query.where(SEARCH_QUERY, search: "%#{search}%")
      end
    end
    private_constant :Search
  end
  ```

  This `module` could easily be copy and pasted back into
  `app/models/person.rb`, but having it here "removes the clutter" from the
  model class itself, while still being encapsulated within it. And yes,
  [`private_constant`][] can be used with a `module` to make sure that
  code like `Person::Search` cannot be used outside the `Person` class.
  
  See the [`app/models/person/`][] directory for the other examples.

## Conclusion

Although I do think there are areas where the coding test requirements could
be improved, particularly in the data set, overall, I am left with an overall
positive impression of it since it was the catalyst for me to:

- play with Tailwind, which I will definitely use again in the future
- re-think some of the ways I have been writing Rails controller and model code
- generally learn me some new things

So, if you are looking to up your coding game whilst padding your online
portfolio, I can definitely recommend using coding tests as a way to do so!

[ackchyually]: https://knowyourmeme.com/memes/ackchyually
[Action View]: https://guides.rubyonrails.org/action_view_overview.html
[Active Record]: https://guides.rubyonrails.org/active_record_basics.html
[ActiveRecord::PGEnum]: https://github.com/alassek/activerecord-pg_enum
[Adapter pattern]: https://en.wikipedia.org/wiki/Adapter_pattern
[`app/javascript/stylesheets/`]: https://github.com/paulfioravanti/sentia-coding-test/tree/main/app/javascript/stylesheets
[`app/models/person/`]: https://github.com/paulfioravanti/sentia-coding-test/tree/main/app/models/person
[`app/services/data_importer/person_parser.rb`]: https://github.com/paulfioravanti/sentia-coding-test/blob/main/app/services/data_importer/person_parser.rb
[`@apply`]: https://tailwindcss.com/docs/functions-and-directives#apply
[C-3PO]: https://en.wikipedia.org/wiki/C-3PO
[composition]: https://en.wikipedia.org/wiki/Object_composition
[CSV]: https://en.wikipedia.org/wiki/Comma-separated_values
[Darth]: https://starwars.fandom.com/wiki/Darth
[Darth Vader]: https://en.wikipedia.org/wiki/Darth_Vader
[Decorator Pattern]: https://en.wikipedia.org/wiki/Decorator_pattern
[Defensive Programming]: https://en.wikipedia.org/wiki/Defensive_programming
[Draper]: https://github.com/drapergem/draper
[Elephant in the room]: https://en.wikipedia.org/wiki/Elephant_in_the_room
[Elixir]: https://elixir-lang.org/
[Elixir pipeline operator]: https://elixir-lang.org/getting-started/enumerables-and-streams.html#the-pipe-operator
[Elm]: https://elm-lang.org/
[encapsulation]: https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)
[enumerated type]: https://en.wikipedia.org/wiki/Enumerated_type
[Exercism]: https://exercism.io/profiles/paulfioravanti
[functional programming]: https://en.wikipedia.org/wiki/Functional_programming
[Github]: https://github.com/paulfioravanti
[Hash]: https://ruby-doc.org/core/Hash.html
[`helper_method`]: https://api.rubyonrails.org/classes/AbstractController/Helpers/ClassMethods.html#method-i-helper_method
[Hutt]: https://starwars.fandom.com/wiki/Hutt
[img screenshot]: /assets/images/2021-05-09/screenshot.png
[Imposter Syndrome]: https://en.wikipedia.org/wiki/Impostor_syndrome
[inheritance]: https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)
[Jabba the Hutt]: https://en.wikipedia.org/wiki/Jabba_the_Hutt
[Jar Jar Binks]: https://en.wikipedia.org/wiki/Jar_Jar_Binks
[Javascript]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Kaminari]: https://github.com/kaminari/kaminari
[`Kernel.SpecialForms.import/2`]: https://elixir-lang.org/getting-started/alias-require-and-import.html#import
[`Kernel#then`]: https://ruby-doc.org/core/Kernel.html#method-i-then
[`Kernel#yield_self`]: https://ruby-doc.org/core/Kernel.html#method-i-yield_self
[Knights of Ren]: https://starwars.fandom.com/wiki/Knights_of_Ren
[Kylo Ren]: https://en.wikipedia.org/wiki/Kylo_Ren
[Leia Organa]: https://en.wikipedia.org/wiki/Princess_Leia
[munged]: https://en.wikipedia.org/wiki/Data_wrangling
[pagination]: https://en.wikipedia.org/wiki/Pagination
[partial class]: https://en.wikipedia.org/wiki/Class_(computer_programming)#Partial
[pattern matching]: https://docs.ruby-lang.org/en/3.0.0/doc/syntax/pattern_matching_rdoc.html
[plug and play]: https://en.wikipedia.org/wiki/Plug_and_play
[Postgres Enumerated Types]: https://www.postgresql.org/docs/current/datatype-enum.html
[presentation logic]: https://en.wikipedia.org/wiki/Presentation_logic
[`private_constant`]: https://ruby-doc.org/core/Module.html#method-i-private_constant
[Rails concerns]: https://api.rubyonrails.org/classes/ActiveSupport/Concern.html
[Rails helpers]: https://api.rubyonrails.org/classes/ActionController/Helpers.html
[Ruby]: https://www.ruby-lang.org/en/
[Ruby on Rails]: http://rubyonrails.org/
[sample-csv-link]: https://github.com/paulfioravanti/sentia-coding-test/blob/main/test/fixtures/files/SentiaCodingTestData.csv
[SCSS]: https://sass-lang.com/documentation/syntax
[Sentia]: https://www.sentia.com.au/
[Sentia Coding Test application]: https://sentiacodingtest.herokuapp.com/
[Sentia Coding Test codebase]: https://github.com/paulfioravanti/sentia-coding-test
[Sentia tests]: https://github.com/search?l=Ruby&p=1&q=sentia&type=Repositories
[separation of concerns]: https://en.wikipedia.org/wiki/Separation_of_concerns
[Stack Overflow]: https://stackoverflow.com/users/567863/paul-fioravanti
[Suffix]: https://en.wikipedia.org/wiki/Suffix_(name)
[superclass]: https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)#Subclasses_and_superclasses
[Tachyons]: https://tachyons.io/
[Tailwind CSS]: https://tailwindcss.com/
[Tailwind UI]: https://tailwindui.com/
[utility-first CSS]: https://tailwindcss.com/docs/utility-first
[will_paginate]: https://github.com/mislav/will_paginate
[YAGNI]: https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it
[Yoda]: https://en.wikipedia.org/wiki/Yoda
