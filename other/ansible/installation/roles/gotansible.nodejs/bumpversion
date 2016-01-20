#!/bin/bash
# arguments are: major, minor patch
#https://github.com/peritus/bumpversion
function die {
    echo >&2 "$@"
    exit 1
}

function usage
{
	echo "usage: bumpversion (patch | minor | major)"
}

case $1 in
    patch | minor | major ) VERSION=$1
                            ;;
    -h | --help )           usage
                            exit
                            ;;
    * )                     usage
							die
esac

if [ -z "$(git status --porcelain)" ]; then 
  # Working directory clean
  #git checkout master
  #git merge develop
  #git checkout develop
  bumpversion $1
  git add .
  git commit -m 'bumpversion'
  git push --all
  git push --tags
else 
  # Uncommitted changes
  echo 'uncommitted changes exist, must be run on a clean repository'
fi

