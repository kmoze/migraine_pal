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

import articleImg from '../assets/analytics.png';

// Sample articles array (replace this with your actual data source)
const articles = [
  {
    title: 'Article 1',
    description: 'Description for Article 1',
    link: '/article-1',
    img: articleImg,
  },
  {
    title: 'Article 2',
    description: 'Description for Article 2',
    link: '/article-2',
    img: articleImg,
  },
  {
    title: 'Article 3',
    description: 'Description for Article 3',
    link: '/article-3',
    img: articleImg,
  },
  {
    title: 'Article 4',
    description: 'Description for Article 4',
    link: '/article-4',
    img: articleImg,
  },
  {
    title: 'Article 5',
    description: 'Description for Article 5',
    link: '/article-5',
    img: articleImg,
  },
];

export function CarouselPlugin() {
  const plugin = useRef(Autoplay({ delay: 2000 }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
    >
      <CarouselContent className="">
        {articles.map((article, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="relative overflow-hidden bg-gray-800 text-white">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${article.img})` }}
                />
                <CardContent className="relative flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    {article.title}
                  </h2>
                  <p className="mb-4">{article.description}</p>
                  <a
                    href={article.link}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Read More
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
