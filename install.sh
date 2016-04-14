#!/usr/bin/env bash

SWITCH_SOURCE=$HOME/.switch

is_git_installed() {
    command -v git > /dev/null 2>&1

    return $?
}

create_dir() {
    if [[ -d "${SWITCH_SOURCE}" ]] ; then
        rm -rf "${SWITCH_SOURCE}"
    fi

    mkdir "${SWITCH_SOURCE}"

    return $?
}

get_profile() {
    local profile
    local shell
    shell="$(basename "/$SHELL")"

    if [ "${shell}" = "bash" ]; then
        if [ -f "${HOME}/.bashrc" ]; then
            profile="${HOME}/.bashrc"
        elif [ -f "${HOME}/.bash_profile" ]; then
            profile="${HOME}/.bash_profile"
        fi
    elif [ "$shell" = "zsh" ]; then
        profile="${HOME}/.zshrc"
    fi

    if [ -z "$profile" ]; then
        if [ -f "${HOME}/.profile" ]; then
            profile="${HOME}/.profile"
        elif [ -f "${HOME}/.bashrc" ]; then
            profile="${HOME}/.bashrc"
        elif [ -f "${HOME}/.bash_profile" ]; then
            profile="${HOME}/.bash_profile"
        elif [ -f "${HOME}/.zshrc" ]; then
            profile="${HOME}/.zshrc"
        fi
    fi

    echo "${profile}"
}

download() {
    local source
    local profile
    source="[[ -e ${SWITCH_SOURCE}/switch ]] && . ${SWITCH_SOURCE}/switch"
    profile=$(get_profile)

    echo "=> Downloading switch"
    if create_dir ; then
        if is_git_installed ; then
            git clone https://github.com/luke-j/switch.git "${SWITCH_SOURCE}"
        else
            mkdir "${SWITCH_SOURCE}/dist"
            # todo - curl files from repo once repo is up
            curl -sLko "${SWITCH_SOURCE}/dist/build.js" https://raw.githubusercontent.com/luke-j/switch/master/dist/build.js
            curl -sLko "${SWITCH_SOURCE}/dist/build.js.map" https://raw.githubusercontent.com/luke-j/switch/master/dist/build.js.map
            curl -sLko "${SWITCH_SOURCE}/switch" https://raw.githubusercontent.com/luke-j/switch/master/switch
        fi
    else
        echo -e "=> Error: \n=> There was a problem creating the switch source directory"
        exit 1
    fi

    if [[ ! -f "${profile}" ]] ; then
        echo -e "=> Error: \n=> Could not find a bash profile, create one with \"touch ~/.bashrc\" and run again"
        exit 1
    fi

    if ! command grep -qc "${source}" "${profile}" ; then
        echo -e "\n${source}" >> "${profile}"
    fi

    echo -e "=> Success! Run \"source ${profile}\" to start using switch"
    exit 0
}

download