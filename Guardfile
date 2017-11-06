clearing :on

guard :process,
      name: "SCSS linter",
      command: ["scss-lint"] do
  watch(%r{^_sass/.+\.scss$})
end

# NOTE: If you're a tmux user, this is a setting that will keep you informed
# of whether the suite is passing
notification :tmux, color_location: "status-right-bg"
