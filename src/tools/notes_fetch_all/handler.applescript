tell application "Notes"
    set theNotes to every note
    set output to ""

    repeat with n in theNotes
        set output to output & (name of n) & "¶" & (body of n) & "§§"
    end repeat

    return output
end tell
