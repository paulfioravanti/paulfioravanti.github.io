# frozen_string_literal: true

group :red_green_refactor, halt_on_fail: true do
  guard "process",
        # NOTE: Specificity on what HTML files is needed here otherwise
        # Jekyll-generated files under the _site/ directory get linted
        # and htmllint has a sad. Also, only lint files that I have direct
        # control over and are not theme override files.
        # command: ["htmllint", "_includes/*.html"],
        command: ["htmllint", "_includes/stripped_markdown.html"],
        name: "htmllint" do
    watch(%r{\A_includes/.+\.html\z})
  end

  guard "process",
        command: ["markdownlint", "_posts", "_drafts", "_pages" "README.md"],
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

  # NOTE: This guard doesn't really seem to play nicely with the other guards
  # so just ensure that before commiting, you run the following command:
  # bundle exec htmlproofer _site --allow-hash-href --assume-extension --url-ignore "/localhost/" --http-status-ignore "999"
  # The above command will be run in CI.
  # See: https://github.com/gjtorikian/html-proofer#using-with-jekyll
  # guard "process",
  #       command: [
  #         "htmlproofer",
  #         "_site",
  #         "--allow-hash-href",
  #         "--assume-extension",
  #         "--url-ignore",
  #         "/localhost/",
  #         "--http-status-ignore",
  #         "'999'"
  #       ],
  #       name: "htmlproofer" do
  #   watch(%r{\A_site/.+\.html\z})
  # end
end
