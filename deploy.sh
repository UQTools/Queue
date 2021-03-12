git reset HEAD --hard
git checkout main
git pull
yarn
rm -rf build
yarn build
yarn migration-run
sudo systemctl restart nodejs
