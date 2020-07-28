#!/bin/bash

currentDir=$(basename "$PWD")
quiet=false

for i in "$@" ; do
  if [[ $i = "-y" ]]; then
    quiet=true
  fi
done

echo "This script will build the teacher and student apps and deploy them to intellecture.app and join.intellecture.app"
echo ""
echo "For this to work, it's important that your directory structure looks like this:"
echo ""
echo "some folder"
echo " --- $currentDir (the folder codebase you should be running this script from)"
echo " --- join-intellecture-app"
echo " --- intellecture-app"
echo ""
echo ""

# checks to not break ur file structure
cd ..
if ! [ -d intellecture-app ] || ! [ -d join-intellecture-app ]
then
  echo "FAILED!"
  echo "Error: You need to first clone the directories mentioned above"
  exit 1
fi

printf "\n\n\n"
if [ "$quiet" = false ]; then
  read -p "Does everything above look correct? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1
fi

cd $currentDir

echo "Starting deployment"
echo "Getting the latest changes from origin/master..."
git pull

printf "\n\n\n"
if [ "$quiet" = false ]; then
  read -p "Was it able to pull the latest changes from the repo w/ no errors? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1
fi

echo "Making sure the two sibling repos are also up-to-date"
cd ../join-intellecture-app
git pull
git reset --hard origin/master
rm -rf */
find . -maxdepth 1 ! -name 'CNAME' -type f -exec rm -v {} +
cd ..

cd intellecture-app
git pull
git reset --hard origin/master
rm -rf */
find . -maxdepth 1 ! -name 'CNAME' -type f -exec rm -v {} +
cd ..

cd $currentDir

echo "Building teacher application..."
cd teacher
npm install
npm run build
cd ..

printf "\n\n\n"
if [ "$quiet" = false ]; then
  read -p "Did it successfully build the teacher application? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1
fi

echo "Building student application..."
cd student
npm install
npm run build
cd ..

printf "\n\n\n"
if [ "$quiet" = false ]; then
  read -p "Did it successfully build the student application? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1
fi

cd ..
echo "Copying teacher files..."
cp -r $currentDir/teacher/dist/* intellecture-app

echo "Copying student files..."
cp -r $currentDir/student/dist/* join-intellecture-app

printf "\n\n\n"
if [ "$quiet" = false ]; then
  read -p "Did the above copy step go flawlessly? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1
fi

echo "Deploying updates to GitHub..."
cd intellecture-app
git add -A
git commit -am 'deploy'
git push
cd ..

echo "Please wait..."

cd join-intellecture-app
git add -A
git commit -am 'deploy'
git push
cd ..

echo "Done!!"
