const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#project-name').value.trim();
  const fileInput = document.querySelector('#project-file');
  const file = fileInput.files[0];

  if (name && file) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    const response = await fetch(`/api/products`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      document.location.replace('/data');
    } else {
      alert('Failed to add product');
    }
  }
};

document
  .querySelector('.new-project-form')
  .addEventListener('submit', newFormHandler);
