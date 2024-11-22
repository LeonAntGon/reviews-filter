"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  review: {
    marginBottom: 15,
    padding: 10,
    borderBottom: '1 solid #ccc',
  },
  label: {
    fontWeight: 'bold',
  },
});

const ReviewsPDF = ({ reviews, fiveStarClicks }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Reviews Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>5-Star Review Clicks: {fiveStarClicks}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Reviews (1-4 Stars):</Text>
        {reviews.map((review, index) => (
          <View key={index} style={styles.review}>
            <Text>Name: {review.name}</Text>
            <Text>Email: {review.email}</Text>
            <Text>Rating: {review.rating} stars</Text>
            <Text>Opinion: {review.opinion}</Text>
            <Text>Date: {new Date(review.createdAt).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default function ReportsPage() {
  const [reviews, setReviews] = useState([]);
  const [fiveStarClicks, setFiveStarClicks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
          setFiveStarClicks(data.fiveStarClicks);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reviews Report</h1>
        <PDFDownloadLink
          document={<ReviewsPDF reviews={reviews} fiveStarClicks={fiveStarClicks} />}
          fileName="reviews-report.pdf"
        >
          {({ loading }) => (
            <Button disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <Card className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">5-Star Review Clicks</h2>
        <p className="text-3xl font-bold">{fiveStarClicks}</p>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Reviews (1-4 Stars)</h2>
        {reviews.map((review) => (
          <Card key={review._id} className="p-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{review.name}</span>
              <span>{review.rating} stars</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">{review.email}</div>
            <p className="text-gray-800">{review.opinion}</p>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}