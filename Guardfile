group :red_green_refactor, halt_on_fail: true do
  guard "process",
        name: "sass-lint",
        command: ["sass-lint", "--verbose", "--no-exit"] do
    watch(%r{^_sass/.+\.scss$})
    watch(%r{^assets/.+\.scss$})
  end

  guard "process",
        name: "htmllint",
        # NOTE: Specificity on what HTML files is needed here otherwise
        # Jekyll-generated files under the _site/ directory get linted
        # and htmllint has a sad.
        command: ["htmllint", "_includes/*.html", "./*.html"] do
    watch(%r{^_includes/.+\.html$})
    watch(%r{^.+\.html$})
  end
end
