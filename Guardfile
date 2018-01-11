# frozen_string_literal: true

group :red_green_refactor, halt_on_fail: true do
  guard "process",
        # NOTE: Specificity on what HTML files is needed here otherwise
        # Jekyll-generated files under the _site/ directory get linted
        # and htmllint has a sad.
        command: ["htmllint", "_includes/*.html", "about.html"],
        name: "htmllint" do
    watch(%r{\A_includes/.+\.html\z})
    watch(%r{\Aabout\.html\z})
  end

  guard "process",
        command: ["markdownlint", "_posts", "_drafts", "README.md", "index.md"],
        name: "markdownlint" do
    watch(%r{\A_posts/.+\.md\z})
    watch(%r{\A.+\.md\z})
  end

  guard "process",
        command: ["sass-lint", "--verbose", "--no-exit"],
        name: "sass-lint" do
    watch(%r{\A_sass/.+\.scss\z})
    watch(%r{\Aassets/.+\.scss\z})
  end
end
