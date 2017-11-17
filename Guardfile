group :red_green_refactor, halt_on_fail: true do
  guard "process",
        # NOTE: Specificity on what HTML files is needed here otherwise
        # Jekyll-generated files under the _site/ directory get linted
        # and htmllint has a sad.
        command: ["htmllint", "_includes/*.html", "about.html"],
        name: "htmllint" do
    watch(%r{^_includes/.+\.html$})
    watch(%r{^about\.html$})
  end

  guard "process",
        command: ["markdownlint", "_posts", "_drafts", "README.md", "index.md"],
        name: "markdownlint" do
    watch(%r{^_posts/.+\.md$})
    watch(%r{^.+\.md$})
  end

  guard "process",
        command: ["sass-lint", "--verbose", "--no-exit"],
        name: "sass-lint" do
    watch(%r{^_sass/.+\.scss$})
    watch(%r{^assets/.+\.scss$})
  end
end
