import emailjs from '@emailjs/browser';

if (typeof window !== 'undefined') {
  const form = document.getElementById('contact-form') as HTMLFormElement;
  form.addEventListener('submit', handleForm);
  console.log('ELEMENT: ', document.getElementById('contact-form'));
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function handleForm(event: Event) {
  event.preventDefault();
  const successMessage = document.getElementsByClassName(
    'messageSuccess'
  )[0] as HTMLElement;
  emailjs
    .sendForm(
      'service_y7gw3np',
      'template_2sf7pzc',
      event.target as HTMLFormElement
    )
    .then(
      async () => {
        successMessage.classList.add('visible');
        successMessage.classList.remove('hidden');
        console.log('SUCCESS!');
        (event.target as HTMLFormElement).reset();

        await delay(5000);
        successMessage.classList.add('hidden');
        successMessage.classList.remove('visible');
      },
      (error) => {
        alert('Error sending proposal! ' + error);
        console.log('FAILED...', error);
      }
    );
}
