type EventItem = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    title: 'Web Summit',
    image: '/images/event1.png',
    slug: 'web-summit-lisbon-2026',
    location: 'Lisbon, Portugal',
    date: 'November 9-12, 2026',
    time: '9:00 AM WET',
  },
  {
    title: 'AWS re:Invent',
    image: '/images/event2.png',
    slug: 'aws-reinvent-las-vegas-2026',
    location: 'Las Vegas, NV',
    date: 'November 30-December 4, 2026',
    time: '8:00 AM PST',
  },
  {
    title: 'TechCrunch Disrupt',
    image: '/images/event3.png',
    slug: 'techcrunch-disrupt-san-francisco-2026',
    location: 'San Francisco, CA',
    date: 'October 13-15, 2026',
    time: '9:00 AM PDT',
  },
  {
    title: 'GitHub Universe',
    image: '/images/event4.png',
    slug: 'github-universe-2026',
    location: 'San Francisco, CA',
    date: 'October 2026',
    time: '9:00 AM PDT',
  },
  {
    title: 'KubeCon + CloudNativeCon North America',
    image: '/images/event5.png',
    slug: 'kubecon-cloudnativecon-na-2026',
    location: 'Los Angeles, CA',
    date: 'November 2026',
    time: '9:00 AM PDT',
  },
  {
    title: 'ETHGlobal Hackathon',
    image: '/images/event6.png',
    slug: 'ethglobal-hackathon-2026',
    location: 'Online',
    date: 'October 2026',
    time: '10:00 AM UTC',
  },
];