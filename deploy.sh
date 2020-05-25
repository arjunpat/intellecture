#!/bin/bash

currentDir=$(basename "$PWD")

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
echo "You have 10 seconds to cancel this script -- it will cause damage if your directory structure does not look like this"
sleep 10

# checks to not break ur file structure
cd ..
if ! [ -d intellecture-app ] || ! [ -d join-intellecture-app ]
then
  echo "FAILED!"
  echo "Error: You need to first clone the directories mentioned above"
  exit 1
fi

cd $currentDir

echo "Starting deployment"
echo "Getting the latest changes from origin/master..."
git pull

echo "Making sure the two sibling repos are also up-to-date"
cd ../join-intellecture-app
git pull
rm -rf */
find . -maxdepth 1 ! -name 'CNAME' -type f -exec rm -v {} +
cd ..

cd intellecture-app
git pull
rm -rf */
find . -maxdepth 1 ! -name 'CNAME' -type f -exec rm -v {} +
cd ..

cd $currentDir

echo "Building teacher application..."
cd teacher
npm run build
cd ..

echo "Building student application..."
cd student
npm run build
cd ..

cd ..
echo "Copying teacher files..."
cp -r $currentDir/teacher/dist/* intellecture-app

echo "Copying student files..."
cp -r $currentDir/student/dist/* join-intellecture-app

echo "Deploying updates to GitHub..."
cd intellecture-app
ls -A
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