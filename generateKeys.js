const { randomBytes } = require('crypto');
const { unlink } = require('node:fs/promises');
const fs = require('fs');

async function KeyGenerator(length) {
  console.log(`generating key: `);
  return randomBytes(length).toString('hex');
}

async function SaveToFile(Key, fileName) {
  console.log(`saving key to ${fileName}`);
  let file = fs.createWriteStream(fileName, {
    encoding: 'utf8',
    start: 0,
    highWaterMark: 1080,
    flags: 'w',
  });

  file.write(Key);
  console.log(`key saved`);
  return file.close();
}

async function fileExist(fileName) {
  console.log(`checking for any existent key/token?`);
  try {
    await fs.promises.access(fileName, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

async function MoveFile(fileName) {
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();
  date = `${date}`;
  time = `${time}`;
  time = time.split(':').join('-');
  time = time.split(' ').join('-');
  date = date.split('/').join('-');
  return fs.copyFileSync(fileName, `backup/old-key-date-${date}-${time}-jwt.txt`, fs.constants.COPYFILE_EXCL);
}

// main
async function Generator() {
  const keyLen = Number(process.env.LEN) || 16;
  let fileName = process.env.NAME || 'Token';
  fileName = fileName + String(process.env.LEN || 16) + '.txt';

  const key = await KeyGenerator(keyLen);
  console.log('key=> ', key);

  let isFile = await fileExist(fileName).catch((er) => {
    return true;
  });

  if (isFile) {
    console.log('key found backing up ./backup folder!');
    await MoveFile(fileName);
    await unlink(fileName);
    console.log(`backup successfull!`);
  }
  await SaveToFile(key, fileName);
}
Generator();
