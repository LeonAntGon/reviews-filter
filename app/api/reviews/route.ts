import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import StarClick from '@/models/StarClick';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const data = await req.json();

    // Validaciones básicas
    if (!data.rating) {
      return NextResponse.json(
        { success: false, error: 'La calificación es requerida' },
        { status: 400 }
      );
    }

    // Validar rating
    if (![1, 2, 3, 4, 5].includes(data.rating)) {
      return NextResponse.json(
        { success: false, error: 'Calificación inválida' },
        { status: 400 }
      );
    }

    // Manejar reseñas de 5 estrellas
    if (data.rating === 5) {
      try {
        const starClick = new StarClick();
        await starClick.save();
        
        return NextResponse.json({
          success: true,
          message: 'Click registrado exitosamente',
          id: starClick._id
        });
      } catch (error) {
        throw new Error('Error al registrar click de 5 estrellas');
      }
    }

    // Validaciones para reseñas 1-4 estrellas
    if (!data.name?.trim() || !data.email?.trim() || !data.opinion?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos para reseñas de 1-4 estrellas' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Crear reseña
    const review = new Review({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      rating: data.rating,
      opinion: data.opinion.trim()
    });
    
    await review.save();
    
    return NextResponse.json({
      success: true,
      review,
      message: 'Reseña guardada exitosamente'
    });

  } catch (error) {
    console.error('Error:', error);

    if (error instanceof Error) {
      // Error de validación de Mongoose
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { success: false, error: 'Error de validación', details: error.message },
          { status: 400 }
        );
      }

      // Error de duplicado
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        return NextResponse.json(
          { success: false, error: 'Entrada duplicada' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const [reviews, starClicks] = await Promise.all([
      Review.find({})
        .sort({ createdAt: -1 })
        .select('-__v')
        .lean()
        .exec(),
      StarClick.countDocuments()
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      fiveStarClicks: starClicks
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener reseñas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}