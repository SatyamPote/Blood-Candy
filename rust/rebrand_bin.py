import os

path = r'c:\Users\satya\Documents\GitHub\fluxion\Blood-Candy\rust\crates\blood-candy-cli\src\main.rs'
with open(path, 'rb') as f:
    content = f.read()

# The unique part of the banner in bytes
old_part = b'Code\x1b[0m \xf0\x9f\xa6\x9e' # "Code" + orange + lobster
new_part = b'Blood Candy\x1b[0m \xf0\x9f\x8d\xac' # "Blood Candy" + orange + candy

if old_part in content:
    content = content.replace(old_part, new_part)
    print("Found and replaced Code lobster.")
else:
    print("Lobster NOT found.")

# Try replacing the logo lines themselves
old_logo = b'  \xe2\x95\x9a\xe2\x95\x90\xe2\x95\x90\xe2\x95\x90\xe2\x95\x90\xe2\x95\x90\xe2\x95\x9d\xe2\x95\x9a\xe2\x95\x90\xe2\x95\x90\xe2\x95\x90\xe2\x95\x90\xe2\x95\x90\xe2\x95\x90\xe2\x95\x9d\xe2\x95\x9a\xe2\x95\x90\xe2\x95\x9d  \xe2\x95\x9a\xe2\x95\x90\xe2\x95\x9d\xe2\x95\x9a\xe2\x95\x90\xe2\x95\x90\xe2\x95\x9d\xe2\x95\x9a\xe2\x95\x90\xe2\x95\x90\xe2\x95\x9d'
if old_logo in content:
    print("Found logo lines.")

with open(path, 'wb') as f:
    f.write(content)
