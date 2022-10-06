const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');

function loadImage(e) {
  console.log(e);
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alert('Please select an image file');
    return;
  }

  form.style.display = 'block';
  console.log(file);
  document.querySelector('#filename').innerHTML = file.name;
}

function isFileImage(file) {
  console.log(typeof file);
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file.type);
}

document.querySelector('#img').addEventListener('change', loadImage);
