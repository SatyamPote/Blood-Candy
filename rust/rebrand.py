import os

path = r'c:\Users\satya\Documents\GitHub\fluxion\Blood-Candy\rust\crates\blood-candy-cli\src\main.rs'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the startup banner ASCII
old_banner = r'''format!(
            "\x1b[38;5;196m\
 ██████╗██╗      █████╗ ██╗    ██╗\n\
 ██╔════╝██║     ██╔══██╗██║    ██║\n\
 ██║     ██║     ███████║██║ █╗ ██║\n\
 ██║     ██║     ██╔══██║██║███╗██║\n\
 ╚██████╗███████╗██║  ██║╚███╔███╔╝\n\
 ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝\x1b[0m \x1b[38;5;208mCode\x1b[0m 🦞'''

new_banner = r'''format!(
            "\x1b[38;5;196m{}\x1b[0m'''

content = content.replace(old_banner, new_banner.format('ASCII_LOGO'))

# Replace the logo variable being used
content = content.replace('ASCII_LOGO,', 'ASCII_LOGO,\n            self.model,')

# Fix the thinking spinner
content = content.replace('🦀 Thinking...', '🍬 Thinking...')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
