"use client"
import Link from "next/link";
import hotelbg from '@/public/hotel.jpg'
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFiveStarClick = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: 5,
          name: '',
          email: '',
          opinion: ''
        })
      });

      if (!response.ok) {
        throw new Error('Error registrando click');
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "¡Gracias por tu calificación!",
          description: "Redirigiendo a Airbnb...",
        });
        
        // Pequeña pausa para mostrar el toast antes de redirigir
        setTimeout(() => {
          window.location.href = 'https://airbnb.com/your-listing';
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar tu calificación. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main 
      style={{ 
        height: '100vh',
        width: '100vw' ,
        backgroundImage: `url(${hotelbg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="flex content-center justify-center flex-wrap"
    >
      <div
        className="rounded-2xl w-[320px] md:w-[440px] pt-6" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', height: '400px' }}
      >
        <h1 className="text-center text-xl font-bold mb-1">¿Qué te pareció tu estadía?</h1>
        <h2 className="text-center font-semibold">Danos una reseña</h2>

        <section className="[&>a]:my-[6px] flex flex-col items-center pt-2">
          <button 
            onClick={handleFiveStarClick}
            disabled={isSubmitting}
            className="hover:bg-blue-200 rounded-xl w-full transition-colors duration-200"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="20px"
                  height="36px"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-black"
                >
                  <path
                    d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
              <p className="tracking-wider leading-10 font-bold pl-4">
                {isSubmitting ? 'Procesando...' : '5 estrellas'}
              </p>
            </div>
          </button>

          {[4, 3, 2, 1].map((rating) => (
            <Link 
              key={rating} 
              href={`/stars-${rating}`} 
              className="hover:bg-blue-200 rounded-xl w-full transition-colors duration-200"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="20px"
                    height="36px"
                    viewBox="0 0 24 24"
                    fill={i < rating ? 'currentColor' : 'none'}
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-black"
                  >
                    <path
                      d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
                <p className="tracking-wider leading-10 font-semibold pl-4">{rating} {rating === 1 ? 'estrella' : 'estrellas'}</p>
              </div>
            </Link>
          ))}
        </section>

        <div className="flex flex-wrap justify-center pt-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" strokeWidth="1">
            <path d="M12 10c-2 0 -3 1 -3 3c0 1.5 1.494 3.535 3 5.5c1 1 1.5 1.5 2.5 2s2.5 1 4.5 -.5s1.5 -3.5 .5 -6s-2.333 -5.5 -5 -9.5c-.834 -1 -1.5 -1.5 -2.503 -1.5c-1 0 -1.623 .45 -2.497 1.5c-2.667 4 -4 7 -5 9.5s-1.5 4.5 .5 6s3.5 1 4.5 .5s1.5 -1 2.5 -2c1.506 -1.965 3 -4 3 -5.5c0 -2 -1 -3 -3 -3z" />
          </svg>
        </div>
      </div>
    </main>
  );
}