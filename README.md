#MARTY

A happy peer-to-peer filesharing application made just for you.

#####Project Roadmap
- [X] Make a web version for the file sharing
- [ ] Build Chrome Extension
- [ ] Deploy :D

[![forthebadge](http://forthebadge.com/images/badges/made-with-crayons.svg)](http://forthebadge.com)

####Todo

######Build Chrome extension
- [X] Basic architecture of extension written
- [X] Set background scripts as what we've written
- [X] Create simple frontends
- [X] Pass data from frontend to background and vice-versa
- [ ] Allow to seed files
- [ ] Allow to download torrents
- [ ] Maintain state between closing and opening of popup window


#####Messaging

######Popup -> Background
* { link: `link from input`}
* {`File Object`}

######Background -> Popup
* { hash: `link from server`}
* { BlobURL: `dataURL`}