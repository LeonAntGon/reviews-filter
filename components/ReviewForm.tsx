"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import type { ReviewFormData, ReviewResponse } from '@/types/review';

interface ReviewFormProps {
  rating: number;
}

export default function ReviewForm({ rating }: ReviewFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});
  
  const validateForm = (formData: FormData): boolean => {
    const newErrors: Partial<ReviewFormData> = {};
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const opinion = formData.get('opinion') as string;
    
    if (!name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!email?.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    
    if (rating < 5 && !opinion?.trim()) {
      newErrors.opinion = 'La opinión es requerida para calificaciones menores a 5 estrellas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      if (!validateForm(formData)) {
        setIsSubmitting(false);
        return;
      }
      
      const reviewData: ReviewFormData = {
        name: (formData.get('name') as string).trim(),
        email: (formData.get('email') as string).trim().toLowerCase(),
        opinion: (formData.get('opinion') as string)?.trim() || '',
        rating,
      };
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (!response.ok) {
        throw new Error('Error en la conexión');
      }
      
      const result: ReviewResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al enviar la reseña');
      }
      
      toast({
        title: 'Reseña enviada',
        description: 'Gracias por tu retroalimentación!',
      });
      
      // Redirect to home after successful submission
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al enviar la reseña. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl w-[320px] md:w-[440px] pt-6 px-6 overflow-y-auto bg-white/90 shadow-lg m-4">
      <h1 className="text-center text-xl font-bold mb-2">¿Como podemos mejorar su estadía?</h1>
      <h2 className="text-center font-semibold mb-1">
        <span className="font-medium">Nos diste:</span> {rating} {rating === 1 ? 'estrella' : 'estrellas'}
      </h2>
      
      <div className="flex justify-center mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="20px"
            height="36px"
            viewBox="0 0 24 24"
            fill={star <= rating ? 'currentColor' : 'none'}
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
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <Input 
            id="name" 
            name="name" 
            type="text"
            aria-describedby="name-error"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500" id="name-error">
              {errors.name}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            aria-describedby="email-error"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500" id="email-error">
              {errors.email}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="opinion" className="block text-sm font-medium text-gray-700 mb-1">
            Tu opinión
          </label>
          <Textarea 
            id="opinion" 
            name="opinion" 
            rows={4}
            aria-describedby="opinion-error"
            className={errors.opinion ? 'border-red-500' : ''}
          />
          {errors.opinion && (
            <p className="mt-1 text-sm text-red-500" id="opinion-error">
              {errors.opinion}
            </p>
          )}
        </div>
        
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
          </Button>
        </div>
      </form>

      <div className="flex justify-center my-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          width="20" 
          height="20" 
          strokeWidth="1"
        >
          <path d="M12 10c-2 0 -3 1 -3 3c0 1.5 1.494 3.535 3 5.5c1 1 1.5 1.5 2.5 2s2.5 1 4.5 -.5s1.5 -3.5 .5 -6s-2.333 -5.5 -5 -9.5c-.834 -1 -1.5 -1.5 -2.503 -1.5c-1 0 -1.623 .45 -2.497 1.5c-2.667 4 -4 7 -5 9.5s-1.5 4.5 .5 6s3.5 1 4.5 .5s1.5 -1 2.5 -2c1.506 -1.965 3 -4 3 -5.5c0 -2 -1 -3 -3 -3z" />
        </svg>
      </div>
    </div>
  );
}