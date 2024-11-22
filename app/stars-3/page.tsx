import ReviewForm from '@/components/ReviewForm';

export default function StarsThreePage() {
  return (
    <main className="flex content-center justify-center flex-wrap min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <ReviewForm rating={3} />
    </main>
  );
}