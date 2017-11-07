guard "process",
      name: "SASS Lint",
      command: ["sass-lint", "--verbose", "--no-exit"] do
  watch(%r{^_sass/.+\.scss$})
  watch(%r{^assets/.+\.scss$})
end

guard "process",
      name: "htmllint",
      command: ["htmllint", "_includes/*.html", "./*.html"] do
  watch(%r{^_includes/.+\.html$})
  watch(%r{^.+\.html$})
end

notification :tmux, color_location: "status-right-bg"
clearing :on
