const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightinput = document.querySelector('#height');
const widthinput = document.querySelector('#width');

const alertMessage = (message, type = 'success') => {
  if (type === 'error') {
    toastify.toast({
      text: message,
      duration: 3000,
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
      duration: 3000,
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

// send image to main

const loadImage = (e) => {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertMessage('Please select an image file', 'error');
    return;
  }

  const image = new Image();
  console.log(file);
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
  console.log(typeof file);
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file.type);
};

img.addEventListener('change', loadImage);
// form.addEventListener('submit', sendImage);
