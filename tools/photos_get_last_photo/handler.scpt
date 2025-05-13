-- exportLastPhoto.scpt
on run argv
if (count of argv) is not 2 then
error "Usage: osascript exportLastPhoto.scpt <exportDir> <baseName>"
end if

-- 1) Parse args
set exportDirPOSIX to item 1 of argv
set baseName       to item 2 of argv

-- 2) Coerce export folder
set exportFolder to POSIX file exportDirPOSIX as alias

-- 3) Fetch the last media item
tell application "Photos"
set allItems to every media item
if (count of allItems) = 0 then
  error "No photos found in Photos library"
end if
set lastItem to last item of allItems
end tell

-- 4) Export it (must be a list) to preserve originals
tell application "Photos"
  export {lastItem} to exportFolder with using originals
end tell

-- 5) Find and rename the newly-exported file, preserving its original extension
tell application "Finder"
  set fList to every file of exportFolder
  if (count of fList) = 0 then
    error "Export produced no files"
  end if

  -- assume the newest by creation date is our photo
  set sortedList to sort fList by creation date
  set newestFile to item (count of sortedList) of sortedList

  -- get its original extension
  set ext to name extension of newestFile

  -- decide on final name: if user provided a dot, assume they included an extension
  if baseName contains "." then
    set newName to baseName
  else
    set newName to baseName & "." & ext
  end if

  set name of newestFile to newName
end tell

-- 6) Return the full POSIX path of the renamed file
return exportDirPOSIX & "/" & newName
end run
