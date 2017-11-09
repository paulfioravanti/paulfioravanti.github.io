---
layout: post
title:  "Setting up a Jekyll Blog"
date:   2017-11-09 14:00 +1100
categories: jekyll
comments: true
---

Since setting up this blog and creating a development environment for it that I
was happy with took longer than I expected, I thought I would document the
process and other learnings gained along the way. This assumes that you have
read Jekyll's [getting started guide][jekyll-getting-started] and the quick
start instructions on the [Jekyll homepage][jekyll-homepage], and have got your
new blog generated.

NOTE: I used Jekyll 3.6.2 to originally generate this blog, so your mileage may
vary depending on what version you use and when you read this post.

## Choosing a theme

If you are hosting outside of Github, then you can get themes from
[many][jekyllthemes.org] [different][jekyllthemes.io]
[sites][themes.jekyllrc.org], but if you are going to use
[Github Pages][github-pages] for hosting, then you are limited to their
[supported themes][github-pages-supported-themes].

After generating a few different test blogs and applying different themes, I
found that [Minima][minima], the default theme, is the one that works most
seemlessly out-of-the-box, including [all the layouts][minima-layouts] that a
newly-generated site wants by default, as well as integrations for
[Disqus comments][minima-disqus] and
[Google Analytics][minima-google-analytics]. This ease of use, coupled with my
desire to tinker with the CSS, made the minimalistic Minima a straightforward
choice, but I would encourage you to experiment and pick one that best suits
the look you want for your site.

## Overriding Styling

## Overriding _include files_

## Lint all the Things

## Run all the Lints

## Custom Domain Setup

## SSL Setup

## No Foreign Plugins


[github-pages]: https://pages.github.com/
[github-pages-supported-themes]: https://pages.github.com/themes/
[jekyll-getting-started]: https://github.com/jekyll/jekyll#getting-started
[jekyll-homepage]: https://jekyllrb.com/
[jekyllthemes.org]: http://jekyllthemes.org/
[jekyllthemes.io]: http://jekyllthemes.io/
[minima]: https://github.com/jekyll/minima
[minima-customisation]: https://github.com/jekyll/minima#customization
[minima-disqus]: https://github.com/jekyll/minima#enabling-comments-via-disqus 
[minima-google-analytics]: https://github.com/jekyll/minima#enabling-google-analytics
[minima-layouts]: https://github.com/jekyll/minima/tree/master/_layouts
[themes.jekyllrc.org]: http://themes.jekyllrc.org/
