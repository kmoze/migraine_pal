import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useRef } from 'react';

import natureImg from '../assets/natureLogo.jpg';
import healthCentralImg from '../assets/HealthCentral_Corporation_Logo.jpg';
import medicalNewsTodayImg from '../assets/medical-news-today-mnt-logo-vector.png';
import bbcImg from '../assets/p09xtmrn.jpg';
import washingtonPostImg from '../assets/the-washington-post3353.jpg';

const articles = [
  {
    title: 'Migraine shame is real',
    description: 'My pain is not ‘just’ a headache',
    link: 'https://www.washingtonpost.com/wellness/2024/05/18/migraine-shame-stigma-treatments/',
    img: washingtonPostImg,
  },
  {
    title: 'What causes migraines?',
    description: 'Study offers new clues',
    link: 'https://www.nature.com/articles/d41586-024-02222-x',
    img: natureImg,
  },
  {
    title: 'Medications and Migraines',
    description: 'Can meds cause migraines?',
    link: 'https://www.healthcentral.com/condition/migraine/6-medications-can-make-migraine-worse',
    img: healthCentralImg,
  },
  {
    title: 'Exploring migraines',
    description: 'Your official guide',
    link: 'https://www.medicalnewstoday.com/articles/148373',
    img: medicalNewsTodayImg,
  },
  {
    title: 'Atogepant: Migraine drug',
    description: 'New drug for NHS use',
    link: 'https://www.bbc.co.uk/news/health-68780240',
    img: bbcImg,
  },
];

export function CarouselPlugin() {
  const plugin = useRef(Autoplay({ delay: 6000 }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={() => plugin.current.stop()} // Wrap with an anonymous function
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent>
        {articles.map((article, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="relative overflow-hidden bg-gray-800 text-white border-none">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${article.img})` }}
                />
                <div className="absolute inset-0 bg-gray-800 opacity-90" />
                <CardContent className="relative flex flex-col items-center p-10 text-center">
                  <h2 className="text-lg font-semibold mb-2 max-h-7">
                    {article.title}
                  </h2>
                  <p className="mb-4">{article.description}</p>
                  <a
                    href={article.link}
                    target="_blank"
                    className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
                  >
                    Read Article
                  </a>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-4 text-black" />
      <CarouselNext className="mr-4 text-black" />
    </Carousel>
  );
}
