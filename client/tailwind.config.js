import { TannurClient } from '@tannur/sdk';
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        primary: '#0A8F3C',
        secondary: '#E8F5E9',
      }
    },
  },
}


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});
