const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightinput = document.querySelector('#height');
const widthinput = document.querySelector('#width');

const alertMessage = (message, type) => {
  if (type === 'error') {
    toastify.toast({
      text: message,
      duration: 5000,
      newWindow: true,
      className: 'toastify',
      gravity: 'top', // `top` or `bottom`
      position: 'center', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(25deg,#d60000,#ee0000 50%)',
      },
    });
  } else {
    toastify.toast({
      text: message,
      duration: 5000,
      newWindow: true,
      className: 'toastify',
      gravity: 'top', // `top` or `bottom`
      position: 'center', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
      },
    });
  }
};

const loadImage = (e) => {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertMessage('Please select an image file', 'error');
    return;
  }

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthinput.value = this.width;
    heightinput.value = this.height;
  };
  form.style.display = 'block';
  filename.innerHTML = file.name;
  outputPath.innerHTML = path.join(os.homeDir(), 'imageResizer');
};

// make sure file is image
const isFileImage = (file) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file.type);
};

// send image to main

const sendImage = (e) => {
  e.preventDefault();

  const width = widthinput.value;
  const height = heightinput.value;
  const imgPath = img.files[0].path;

  if (!img.files[0]) {
    alertMessage('please upload an image first', 'error');
    return;
  }

  if (width === '' || height === '') {
    alertMessage('please fill in a height and width', 'error');
    return;
  }

  // send image using ipcRenderer
  ipcRenderer.send('image:resize', {
    imgPath,
    width,
    height,
  });
};

ipcRenderer.on('image:done', () => {
  alertMessage(
    `image resized successfully to ${widthinput.value}x${heightinput.value}`
  );
});

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);
