#!/bin/bash
# +-----------------+
# | npm postinstall |
# +-----------------+

# get the installer directory
Installer_get_current_dir () {
  SOURCE="${BASH_SOURCE[0]}"
  while [ -h "$SOURCE" ]; do
    DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
  done
  echo "$( cd -P "$( dirname "$SOURCE" )" && pwd )"
}

Installer_dir="$(Installer_get_current_dir)"

# move to installler directory
cd "$Installer_dir"

source utils.sh

# module name
Installer_module="@bugsounet/cvlc"

Installer_info "Install YouTube lua..."
mkdir -p ~/.local/share/vlc/lua/playlist/
cd ~/.local/share/vlc/lua/playlist/
rm -f youtube.lua
wget https://raw.githubusercontent.com/videolan/vlc/master/share/lua/playlist/youtube.lua

Installer_success "$Installer_module is now installed !"
