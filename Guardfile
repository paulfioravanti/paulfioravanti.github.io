clearing :on

# NOTE: I tried to use the guard-scss_lint gem but it didn't seem
# to want to play nice with Jekyll, so the guard-process gem was
# used instead.
guard :process,
      name: "SCSS linter",
      command: ["scss-lint"] do
  watch(%r{^_sass/.+\.scss$})
end

# NOTE: If you're a tmux user, this is a setting that will keep you informed
# of whether the suite is passing
notification :tmux, color_location: "status-right-bg"
