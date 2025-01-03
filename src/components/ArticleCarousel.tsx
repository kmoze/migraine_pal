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
      onMouseEnter={() => plugin.current.stop()}
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
                <div className="absolute inset-0 bg-card-lightMode opacity-90 dark:bg-card-coolorsPrimary" />
                <CardContent className="relative flex flex-col items-center lg:p-5 p-10 text-center">
                  <h2 className="text-lg lg:text-base lg:mb-5 font-semibold mb-2 max-h-7 text-card-coolorsPrimary dark:text-card-darkModeTextPrimary">
                    {article.title}
                  </h2>
                  <p className="mb-4 text-card-coolorsPrimary dark:text-card-darkModeTextPrimary">
                    {article.description}
                  </p>
                  <a
                    href={article.link}
                    target="_blank"
                    className="bg-card-lightModeTertiary text-card-coolorsPrimary dark:bg-card-darkModePrimary dark:text-card-darkModeTextPrimary dark:hover:bg-card-darkModeSecondary px-4 py-2 rounded hover:bg-card-lightModeSecondary"
                  >
                    Read Article
                  </a>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12 text-black" />
      <CarouselNext className="mr-12 text-black" />
    </Carousel>
  );
}
