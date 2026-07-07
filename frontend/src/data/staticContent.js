// Static marketing content for the Home page.
// NOTE: this is static UI content (like Airbnb's
// application data. All real data (listings, reservations) comes

export const cityCards = [
  {
    name: 'Sandton City Hotel',
    subtitle: '15 min drive',
    location: 'Sandton',
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=600&q=80',
  },
  {
    name: 'Joburg City Hotel',
    subtitle: '20 min drive',
    location: 'Johannesburg',
    image: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=600&q=80',
  },
  {
    name: 'Woodmead Hotel',
    subtitle: '25 min drive',
    location: 'Woodmead',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80',
  },
  {
    name: 'Hyde Park Hotel',
    subtitle: '18 min drive',
    location: 'Hyde Park',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  },
];

export const experiences = [
  {
    title: 'Things to do on your trip',
    cta: 'Experiences',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
  },
  {
    title: 'Things to do from home',
    cta: 'Online Experiences',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
  },
];

// "Inspiration for future getaways" — tabbed lists of
export const getawayTabs = {
  'Unique stays': [
    { place: 'Castles', country: 'United Kingdom' },
    { place: 'Cabins', country: 'United States' },
    { place: 'Treehouses', country: 'United States' },
    { place: 'Beachfront', country: 'Australia' },
    { place: 'Farm stays', country: 'South Africa' },
    { place: 'Tiny houses', country: 'France' },
  ],
  Destinations: [
    { place: 'Cape Town', country: 'South Africa' },
    { place: 'Paris', country: 'France' },
    { place: 'New York', country: 'United States' },
    { place: 'London', country: 'United Kingdom' },
    { place: 'Barcelona', country: 'Spain' },
    { place: 'Tokyo', country: 'Japan' },
  ],
  'Travel tips': [
    { place: 'Cancellation options', country: 'Flexible bookings' },
    { place: 'Safety', country: 'COVID-19 guidelines' },
    { place: 'Neighbourhoods', country: 'Local guides' },
    { place: 'Family travel', country: 'Kid-friendly stays' },
  ],
};

// 4-column footer links.
export const footerColumns = [
  {
    title: 'Support',
    links: ['Help Centre', 'Safety information', 'Cancellation options', 'Report a concern'],
  },
  {
    title: 'Community',
    links: ['Airbnb.org: disaster relief', 'Support refugees', 'Combating discrimination'],
  },
  {
    title: 'Hosting',
    links: ['Try hosting', 'AirCover for Hosts', 'Explore hosting resources', 'Community forum'],
  },
  {
    title: 'About',
    links: ['Newsroom', 'Learn about new features', 'Careers', 'Investors'],
  },
];
