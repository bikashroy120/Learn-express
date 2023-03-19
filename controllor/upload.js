const imageDownloader = require('image-downloader');
const fs = require('fs');


const uploadLinkImg = async(req,res)=>{

    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link, 
        dest: __dirname + "/../uploads/" + newName,  
    })

    res.json(newName)
}

const uploadMulter = (req,res)=>{
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const {path,originalname} = req.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace('uploads\\',''));
    }
    res.json(uploadedFiles);
}


module.exports = {uploadLinkImg,uploadMulter}