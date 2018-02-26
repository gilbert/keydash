rm -rf ./dist
parcel build index.html --public-url ./
cp 404.html dist/
cd dist
git init
git add .
git commit -m "Build"
git push -f git@github.com:gilbert/keydash.git master:gh-pages
